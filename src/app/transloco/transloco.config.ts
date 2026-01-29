import {TranslocoGlobalConfig} from '@jsverse/transloco-utils';

export const defaultLang = 'vi';
export const availableLanguagesWithLabels = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
];
export const availableLangs = availableLanguagesWithLabels.map(lang => lang.code);
export const fallbackLang = 'en';

const config: TranslocoGlobalConfig = {
  rootTranslationsPath: 'public/i18n/',
  langs: availableLangs,
  keysManager: {}
};

export default config;