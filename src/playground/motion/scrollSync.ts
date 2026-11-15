import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

type RenderCallback = (time: number, deltaTime: number) => void;
const renderCallbacks = new Set<RenderCallback>();

let isLoopBound = false;
let currentLenis: Lenis | null = null;

function tickerHandler(time: number, deltaTime: number) {
  if (currentLenis) {
    currentLenis.raf(time * 1000);
  }

  for (const cb of renderCallbacks) {
    try {
      cb(time, deltaTime);
    } catch {
      // Prevent render errors from interrupting ticker
    }
  }
}

export function registerRenderCallback(callback: RenderCallback): () => void {
  renderCallbacks.add(callback);
  return () => {
    renderCallbacks.delete(callback);
  };
}

export function bindScrollSync(lenis: Lenis | null): () => void {
  currentLenis = lenis;

  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
  }

  if (!isLoopBound) {
    gsap.ticker.add(tickerHandler);
    gsap.ticker.lagSmoothing(0);
    isLoopBound = true;
  }

  return () => {
    if (lenis) {
      lenis.off('scroll', ScrollTrigger.update);
    }
    currentLenis = null;
  };
}

export function refreshScrollTrigger(): void {
  ScrollTrigger.refresh();
}

