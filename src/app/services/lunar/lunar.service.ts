import { Injectable } from '@angular/core';
import {Solar, Lunar} from 'lunar-typescript';
import { SonarDate } from '../../models/solar-date';

@Injectable({ providedIn: 'root' })
export class LunarService {

  public lunarToSolar(day: number, month: number, year: number, leap = false): SonarDate {

    const lunar: Lunar = Lunar.fromYmd(year, month, day);
    const solar: Solar = lunar.getSolar();

    return {
      day: solar.getDay(),
      month: solar.getMonth(),
      year: solar.getYear()
    };
  }
}
