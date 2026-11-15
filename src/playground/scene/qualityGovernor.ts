export type QualityTier = 'high' | 'balanced' | 'low' | 'off';

export interface QualityConfig {
  pixelRatio: number;
  maxObjects: number;
  enableIdleFloat: boolean;
  enablePointerParallax: boolean;
  isWebGLDisabled: boolean;
}

export class QualityGovernor {
  private tier: QualityTier = 'high';
  private frameTimes: number[] = [];
  private readonly maxSamples = 60;

  constructor() {
    if (typeof window !== 'undefined') {
      const isMobile =
        window.innerWidth <= 760 ||
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

      // Check Save-Data header / connection setting
      const connection = (navigator as unknown as { connection?: { saveData?: boolean } }).connection;
      const isSaveData = connection?.saveData === true;

      if (isSaveData) {
        this.tier = 'off';
      } else if (isMobile) {
        this.tier = 'balanced';
      }
    }
  }

  getTier(): QualityTier {
    return this.tier;
  }

  getConfig(): QualityConfig {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    switch (this.tier) {
      case 'high':
        return {
          pixelRatio: Math.min(dpr, 1.75),
          maxObjects: 7,
          enableIdleFloat: true,
          enablePointerParallax: true,
          isWebGLDisabled: false,
        };
      case 'balanced':
        return {
          pixelRatio: 1.0,
          maxObjects: 5,
          enableIdleFloat: true,
          enablePointerParallax: false,
          isWebGLDisabled: false,
        };
      case 'low':
        return {
          pixelRatio: 1.0,
          maxObjects: 4,
          enableIdleFloat: false,
          enablePointerParallax: false,
          isWebGLDisabled: false,
        };
      case 'off':
      default:
        return {
          pixelRatio: 1.0,
          maxObjects: 0,
          enableIdleFloat: false,
          enablePointerParallax: false,
          isWebGLDisabled: true,
        };
    }
  }

  recordFrame(deltaMs: number): QualityTier {
    if (this.tier === 'off') return this.tier;

    this.frameTimes.push(deltaMs);
    if (this.frameTimes.length > this.maxSamples) {
      this.frameTimes.shift();
    }

    if (this.frameTimes.length >= 30) {
      const avg =
        this.frameTimes.reduce((acc, val) => acc + val, 0) / this.frameTimes.length;

      // Ambang batas:
      // > 33ms -> turun ke 'low'
      // > 24ms -> turun ke 'balanced' (bila sebelumnya 'high')
      if (avg > 33) {
        if (this.tier !== 'low') {
          this.tier = 'low';
        }
      } else if (avg > 24) {
        if (this.tier === 'high') {
          this.tier = 'balanced';
        }
      }
    }

    return this.tier;
  }

  forceTier(tier: QualityTier): void {
    this.tier = tier;
  }
}
