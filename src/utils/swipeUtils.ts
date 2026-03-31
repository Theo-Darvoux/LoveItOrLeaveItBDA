import { SwipeDirection } from '../types';

export interface SwipeCardElement extends HTMLDivElement {
  __triggerSwipe?: (direction: SwipeDirection) => void;
}

export function triggerCardSwipe(direction: SwipeDirection) {
  const cards = document.querySelectorAll('.swipe-card--top');
  for (const card of cards) {
    const swipeCard = card as SwipeCardElement;
    if (swipeCard.__triggerSwipe) {
      swipeCard.__triggerSwipe(direction);
      return true;
    }
  }
  return false;
}
