import { useEffect } from 'react';
import { movies } from '../data/movies';

interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining(): number;
}

type IdleRequestCallback = (deadline: IdleDeadline) => void;

interface IdleRequestOptions {
  timeout?: number;
}

declare global {
  interface Window {
    requestIdleCallback: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
    cancelIdleCallback: (handle: number) => void;
  }
}

export function ImagePreloader() {
  useEffect(() => {
    const preloadImages = () => {
      movies.forEach((movie) => {
        if (movie.posterUrl) {
          const img = new Image();
          img.src = movie.posterUrl;
        }
      });
      
      const logo = new Image();
      logo.src = '/static/bda.webp';
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => preloadImages());
    } else {
      setTimeout(preloadImages, 1000);
    }
  }, []);

  return null;
}
