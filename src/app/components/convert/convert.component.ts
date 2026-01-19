import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { EventAttributes } from 'ics';
import { IcsService } from '../../services/ics/ics.service';
import { ParsedEvent } from '../../models/event/parsed-event';
import { EventParserService } from '../../services/event-parser/event-parser.service';
import { EventCreatorService } from '../../services/event-creator/event-creator.service';
import { PreviewEvent } from '../../models/event/preview-event';

@Component({
  selector: 'app-convert',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule
  ],
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss']
})
export class ConvertComponent {

  input = signal(`27/11/2023 Giỗ Ông #{{eventIndex}}. (AL: {{lunarDay}}/{{lunarMonth}}/{{lunarYear}})`);

  startYear = signal(new Date().getFullYear());
  endYear = signal<number | null>(null);

  loading = signal(false);
  error = signal('');
  previews = signal<Array<PreviewEvent>>([]);
  generatedEvents = signal<Array<EventAttributes>>([]);

  constructor(
    private ics: IcsService,
    private eventParser: EventParserService,
    private eventCreator: EventCreatorService
  ) {
    effect(() => {
      // Track all dependencies
      this.input();
      this.startYear();
      this.endYear();

      // Update preview whenever dependencies change
      const items = this.parseLines();
      const start = this.startYear();
      const end = this.endYear() ?? this.startYear() + 30;

      const events: EventAttributes[] = this.eventCreator.createRecurringSolarEvents(items, start, end);
      this.generatedEvents.set(events);
      this.previews.set(this.eventCreator.createPreviewEvents(events));
    });
  }

  private parseLines(): Array<ParsedEvent> {
    return this.eventParser.parseLines(this.input());
  }

  async generateICS() {
    this.error.set('');
    this.loading.set(true);

    try {
      const ics = await this.ics.generate(this.generatedEvents());
      this.download(ics);
    } catch (e) {
      this.error.set('Có lỗi xảy ra khi tạo file ICS.');
      console.error(e);
    }
    this.loading.set(false);
  }

  private download(content: string) {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'lich-am-expanded.ics';
    a.click();

    URL.revokeObjectURL(url);
  }
}


