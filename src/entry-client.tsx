import { hydrateRoot } from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n/i18n';
import './index.css';
import App from './App';

hydrateRoot(
  document.getElementById('root')!,
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
);
