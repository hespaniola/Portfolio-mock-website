// Shared timing so every animation on the site feels like one hand made it.
export const ease = [0.22, 1, 0.36, 1] as const; // long, gentle ease-out
export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const dur = {
  fast: 0.6,
  base: 0.9,
  slow: 1.2,
};
