import {Component, effect, inject, signal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatListModule} from '@angular/material/list';
import {EventAttributes} from 'ics';
import {IcsService} from '../../services/ics/ics.service';
import {EventParserService} from '../../services/event-parser/event-parser.service';
import {EventCreatorService} from '../../services/event-creator/event-creator.service';
import {PreviewEvent} from '../../models/event/preview-event';
import {MatGridListModule} from '@angular/material/grid-list';
import {TranslocoModule, TranslocoService} from '@jsverse/transloco';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {availableLanguagesWithLabels, defaultLang} from '../../transloco/transloco.config';
import {EventPreviewer} from '../event-previewer/event-previewer';
import {ConvertFormBuilder} from './convert.form-builder';
import {FormField} from '@angular/forms/signals';

@Component({
  selector: 'app-convert',
  standalone: true,
  imports: [
    FormsModule,
    FormField,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatButtonToggleModule,
    EventPreviewer,
  ],
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss']
})
export class ConvertComponent {

  loading = signal(false);
  error = signal('');
  previews = signal<Array<PreviewEvent>>([]);
  generatedEvents = signal<Array<EventAttributes>>([]);
  currentLang = signal(defaultLang);
  languages = signal(availableLanguagesWithLabels)

  private ics: IcsService = inject(IcsService);
  private eventParser: EventParserService = inject(EventParserService);
  private eventCreator: EventCreatorService = inject(EventCreatorService);
  private transloco: TranslocoService = inject(TranslocoService);
  private fb: ConvertFormBuilder = inject(ConvertFormBuilder);
  protected convertForm = this.fb.buildForm();

  public constructor() {

    effect(() => {
      const lang = this.currentLang();
      this.transloco.setActiveLang(lang);
    });

    // Create an effect to update previews and generated events when form values change
    effect(() => {
      // Track all dependencies
      const startYear = this.convertForm.startYear().value();
      const endYear = this.convertForm.endYear().value();
      const lunarEvents = this.convertForm.lunarEvents().value();

      const items = this.eventParser.parseLines(lunarEvents);
      let effectiveEndYear;
      if (endYear === null) {
        effectiveEndYear = startYear + 30;
      } else {
        effectiveEndYear = endYear;
      }

      const events = this.eventCreator.createRecurringSolarEvents(items, startYear, effectiveEndYear);
      this.generatedEvents.set(events);
      this.previews.set(this.eventCreator.createPreviewEvents(events));
    });
  }

  public changeLanguage(lang: string) {
    this.currentLang.set(lang);
  }

  public async generateICS() {
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
    const blob = new Blob([content], {type: 'text/calendar;charset=utf-8'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'lich-am.ics';
    a.click();

    URL.revokeObjectURL(url);
  }
}


