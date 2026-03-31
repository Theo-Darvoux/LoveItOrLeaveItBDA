import { renderToString } from 'react-dom/server';
import { I18nextProvider } from 'react-i18next';
import { createI18nInstance } from './i18n/i18n';
import App from './App';

export function render(_url: string, lang?: string) {
  const i18n = createI18nInstance(lang);
  const html = renderToString(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  );
  return { html };
}
