import { Injectable } from '@angular/core';
import * as Handlebars from 'handlebars';
import { Context } from '../../models/context';

@Injectable({
  providedIn: 'root',
})
export class RenderTextService {

  render(inputText: string, context: Context): string {
    const template = Handlebars.compile(inputText);
    return template(context);
  }
}
