import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatGridListModule } from '@angular/material/grid-list';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AmlichFormBuilder, AmlichFormGroup } from './amlich.forrm.builder';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-convert',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatButtonToggleModule,
  ],
  templateUrl: './convert.component.html',
  styleUrls: ['./convert.component.scss']
})
export class ConvertComponent {

  public form: AmlichFormGroup;
  private readonly sampleInput = `27/11/2023 Giỗ Ông #{{eventIndex}}. (AL: {{lunarDay}}/{{lunarMonth}}/{{lunarYear}})`;
  private readonly initStartYear = new Date().getFullYear();
  private readonly initEndYear = null;

  loading = signal(false);
  error = signal('');
  previews = signal<Array<PreviewEvent>>([]);
  generatedEvents = signal<Array<EventAttributes>>([]);
  currentLang = signal('en');

  private ics: IcsService = inject(IcsService);
  private eventParser: EventParserService = inject(EventParserService);
  private eventCreator: EventCreatorService = inject(EventCreatorService);
  private fb: AmlichFormBuilder = inject(AmlichFormBuilder);
  private transloco = inject(TranslocoService);

  public constructor() {

    effect(() => {
      const lang = this.currentLang();
      this.transloco.setActiveLang(lang);
    });

    this.form = this.fb.build(
      this.sampleInput,
      this.initStartYear,
      this.initEndYear
    );

    const $formValue = toSignal(
      this.form.valueChanges.pipe(map(() => this.form.getRawValue())), { initialValue: this.form.getRawValue() }
    );

    // Create an effect to update previews and generated events when form values change
    effect(() => {
      const { amlichEvents, startYear, endYear } = $formValue();
      const items = this.eventParser.parseLines(amlichEvents!);
      let effectiveEndYear = endYear;
      if (endYear === null) {
        effectiveEndYear = startYear + 30;
      } else {
        effectiveEndYear = endYear;
      }

      const events: EventAttributes[] = this.eventCreator.createRecurringSolarEvents(items, startYear, effectiveEndYear);
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
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'lich-am.ics';
    a.click();

    URL.revokeObjectURL(url);
  }
}


