import {EventAttributes} from 'ics';

// Create an extended type that includes all properties of EventAttributes
// and adds an 'excluded' boolean property
export type ExtendedEventAttributes = EventAttributes & {
  excluded: boolean;
};
