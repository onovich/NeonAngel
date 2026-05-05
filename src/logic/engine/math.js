export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function dist(p1, p2) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

export function rand(min, max) {
  return Math.random() * (max - min) + min;
}