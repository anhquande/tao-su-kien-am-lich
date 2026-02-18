import { Injectable } from '@angular/core';
import { ParsedEvent } from '../../models/event/parsed-event';
import { LunarService } from '../lunar/lunar.service';
import { RenderTextService } from '../text/render-text.service';
import { Context } from '../../models/context';
import { PreviewEvent } from '../../models/event/preview-event';
import { ExtendedEventAttributes } from '../../models/event/extended-event-attributes';

@Injectable({
  providedIn: 'root',
})
export class EventCreatorService {

  constructor(
    private lunar: LunarService,
    private textRenderer: RenderTextService,
  ) { }

  public createPreviewEvents(events: Array<ExtendedEventAttributes>): Array<PreviewEvent> {
    return events.map(ev => {
      const day = ev.start.toString().split(',')[2];
      const month = ev.start.toString().split(',')[1];
      const year = ev.start.toString().split(',')[0];
      return {
        excluded: ev.excluded,
        title: ev.title as string,
        solarDate: `${day}/${month}/${year}`
      };
    });
  }

  public createRecurringSolarEvents(items: Array<ParsedEvent>, startLunarYear: number, endLunarYear: number): Array<ExtendedEventAttributes> {
    const events: Array<ExtendedEventAttributes> = [];
    // Go through each parsed event
    for (const item of items) {
      let eventIndex = 0;
      const effectiveStartLunarYear = Math.min(startLunarYear, item.year);
      const totalEvents = endLunarYear - effectiveStartLunarYear + 1;
      for (let lunarYear = effectiveStartLunarYear; lunarYear <= endLunarYear; lunarYear++) {
        if (lunarYear >= item.year) {
          // start counting index only when the lunar year reaches the event's starting year
          eventIndex++;
        } else {
          continue; // Skip years before the event's starting year
        }

        // When the lunar year is before the event's starting year, skip
        if (item.year > lunarYear) {
          continue; // Skip years before the event's starting year
        }

        const solar = this.lunar.lunarToSolar(item.day, item.month, lunarYear);

        const excluded = lunarYear < startLunarYear // Mark events before the start year as excluded

        const context: Context = {
          startLunarYear,
          endLunarYear,
          solarDay: solar.day,
          solarMonth: solar.month,
          solarYear: solar.year,
          lunarDay: item.day,
          lunarMonth: item.month,
          lunarYear: lunarYear,
          eventIndex: eventIndex,
          totalEvents: totalEvents,
          isFirstEvent: lunarYear === startLunarYear,
          isLastEvent: lunarYear === endLunarYear,
        };

        events.push({
          excluded, // Mark events before the start year as excluded
          title: this.textRenderer.render(item.title, context),
          start: [solar.year, solar.month, solar.day],
          duration: { days: 1 },
          status: 'CONFIRMED',
          busyStatus: 'FREE',
          alarms: [
            { action: 'display', trigger: { days: 1, before: true } }
          ]
        });
      }
    }
    return events;
  };
}
