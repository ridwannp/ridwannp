export interface PathSegment {
  x0: number;
  x1: number;
  top: number;
  land?: number; // 0..4 if landing floor
}

export function smoothstep(v: number): number {
  const c = Math.max(0, Math.min(1, v));
  return c * c * (3 - 2 * c);
}

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function buildPath() {
  const segments: PathSegment[] = [];
  const CX: number[] = [];
  const LT: number[] = [];

  // 14 stairs descending before the first floor (m = 14 down to 1)
  for (let m = 14; m >= 1; m--) {
    segments.push({
      x0: -m,
      x1: -m + 1,
      top: -0.5 * m,
    });
  }

  let currentX = 0;
  let currentTop = 0;

  for (let k = 0; k < 5; k++) {
    const floorLen = k === 4 ? 12 : 5;
    segments.push({
      x0: currentX,
      x1: currentX + floorLen,
      top: currentTop,
      land: k,
    });

    CX[k] = currentX + 2.5;
    LT[k] = currentTop;
    currentX += floorLen;

    // 10 stairs between stop k and k+1 (only for k < 4)
    if (k < 4) {
      for (let s = 0; s < 10; s++) {
        currentTop += 0.5;
        segments.push({
          x0: currentX,
          x1: currentX + 1,
          top: currentTop,
        });
        currentX += 1;
      }
    }
  }

  function heightAt(x: number): number {
    if (segments.length === 0) return 0;
    if (x <= segments[0].x0) return segments[0].top;
    if (x >= segments[segments.length - 1].x1) {
      return segments[segments.length - 1].top;
    }

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (x >= seg.x0 && x < seg.x1) {
        const next = segments[i + 1];
        if (next && next.top > seg.top) {
          const v = (x - (seg.x1 - 0.4)) / 0.4;
          return seg.top + (next.top - seg.top) * smoothstep(v);
        }
        return seg.top;
      }
    }

    return segments[segments.length - 1].top;
  }

  return {
    segments,
    CX,
    LT,
    heightAt,
  };
}

export const PATH = buildPath();

