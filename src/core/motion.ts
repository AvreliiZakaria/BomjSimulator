const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function onSystemMotionPreferenceChange(callback: (reduced: boolean) => void): () => void {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  const handler = (event: MediaQueryListEvent): void => callback(event.matches);

  query.addEventListener('change', handler);

  return () => query.removeEventListener('change', handler);
}
