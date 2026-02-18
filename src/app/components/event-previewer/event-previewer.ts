import {Component, input, InputSignal} from '@angular/core';
import {MatCard, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatList, MatListItem, MatListItemLine, MatListItemTitle} from '@angular/material/list';
import {PreviewEvent} from '../../models/event/preview-event';
import {TranslocoDirective} from '@jsverse/transloco';

@Component({
  selector: 'app-event-previewer',
  imports: [
    MatCard,
    MatList,
    MatListItem,
    MatListItemLine,
    MatListItemTitle,
    MatCardHeader,
    MatCardSubtitle,
    MatCardTitle,
    TranslocoDirective
  ],
  templateUrl: './event-previewer.html',
  styleUrl: './event-previewer.scss',
  standalone: true,
})
export class EventPreviewer {
  public readonly $events: InputSignal<Array<PreviewEvent>> = input.required({ alias: 'events' });
}
