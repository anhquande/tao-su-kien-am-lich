// src/app/services/ics.service.ts
import { Injectable } from '@angular/core';
import { createEvents, EventAttributes } from 'ics';

@Injectable({ providedIn: 'root' })
export class IcsService {

  public generate(events: EventAttributes[]): Promise<string> {
    return new Promise((resolve, reject) => {
      createEvents(events, (error, value) => {
        if (error) reject(error);
        else resolve(value);
      });
    });
  }
}
