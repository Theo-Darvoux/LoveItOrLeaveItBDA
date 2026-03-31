import { useEffect } from 'react';
import { movies } from '../data/movies';

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).requestIdleCallback(() => preloadImages());
    } else {
      setTimeout(preloadImages, 1000);
    }
  }, []);

  return null;
}
