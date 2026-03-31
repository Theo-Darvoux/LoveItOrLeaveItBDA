import { hydrateRoot } from 'react-dom/client';
import './i18n/i18n';
import './index.css';
import App from './App';

hydrateRoot(
  document.getElementById('root')!,
  <App />
);
