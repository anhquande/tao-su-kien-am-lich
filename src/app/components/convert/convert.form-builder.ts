import {Injectable, signal} from '@angular/core';
import {ConvertFormModel} from './convert.form-model';
import {
  form,
  minLength,
  required,
} from '@angular/forms/signals';

@Injectable({
  providedIn: 'root'
})
export class ConvertFormBuilder {

  public buildForm() {
    const formModel = signal<ConvertFormModel>({
        lunarEvents: '27/11/2023 Giỗ Ông #{{eventIndex}}. (AL: {{lunarDay}}/{{lunarMonth}}/{{lunarYear}})',
        startYear: new Date().getFullYear() + 1,  // this year
        endYear: new Date().getFullYear() + 10 // 10 years from now
      }
    );

    return form(formModel, path => {
      required(path.lunarEvents);
      required(path.startYear);
      required(path.endYear);
      minLength(path.lunarEvents, 10);
    });
  }
}
