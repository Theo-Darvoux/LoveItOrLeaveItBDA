import { renderToString } from 'react-dom/server';
import './i18n/i18n';
import App from './App';

export function render() {
  const html = renderToString(<App />);
  return { html };
}
