import type { UseEmblaCarouselType } from "embla-carousel-react";

type EmblaApi = UseEmblaCarouselType[1];

/**
 * Keyboard control for an embla carousel: ← → switch slides, Home / End jump
 * to the first / last. Put it on the element that wraps the carousel and its
 * buttons, so the keys work wherever focus is inside it.
 */
export function carouselKeyHandler(embla: EmblaApi) {
  return (event: React.KeyboardEvent) => {
    if (!embla || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const actions: Record<string, () => void> = {
      ArrowLeft: () => embla.scrollPrev(),
      ArrowRight: () => embla.scrollNext(),
      Home: () => embla.scrollTo(0),
      End: () => embla.scrollTo(embla.scrollSnapList().length - 1),
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  };
}
