import { Injectable } from '@angular/core';
import { ParsedEvent } from '../../models/event/parsed-event';

@Injectable({
  providedIn: 'root',
})
export class EventParserService {

  public parseLines(input: string): Array<ParsedEvent> {
      const lines = input.split('\n').map(l => l.trim()).filter(Boolean);

      const currentYear = new Date().getFullYear();
      return lines.map(line => {
        // Pattern: DD/MM/YYYY Title
        // or       DD/MM/ Title
        const match = line.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?\s+(.*)$/);

        if (!match) {
          throw new Error(`Invalid format: ${line}`);
        }

        const [, dd, mm, yyyy, title] = match;

        return {
          day: +dd,
          month: +mm,
          year: yyyy ? +yyyy : currentYear,
          title: title.trim()
        };
      });
    }
}
