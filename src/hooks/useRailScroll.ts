import { useState, useEffect, useRef, useCallback } from 'react';
import { DOORS } from '../data/doors';
import { SP, DRAG_THRESHOLD_PX } from '../constants/terrace';

export { SP, DRAG_THRESHOLD_PX };

interface UseRailScrollReturn {
  currentIndex: number;
  scrollOffset: number; // Current lerped 3D offset
  targetOffset: number; // Target 3D offset
  isDragging: boolean;
  canPrev: boolean;
  canNext: boolean;
  scrollToIndex: (index: number) => void;
  next: () => void;
  prev: () => void;
  bindContainer: {
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
    onPointerCancel: (e: React.PointerEvent) => void;
    onWheel: (e: React.WheelEvent) => void;
  };
  hasMovedSinceDown: boolean;
}

export function useRailScroll(prefersReducedMotion = false): UseRailScrollReturn {
  const count = DOORS.length;
  const maxIndex = count - 1;

  // Active lamp index
  const [currentIndex, setCurrentIndex] = useState(0);
  // Target offset in 3D world space (negative value to translate rail left)
  const [targetOffset, setTargetOffset] = useState(0);
  // Current animated offset
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMovedSinceDown, setHasMovedSinceDown] = useState(false);

  const dragStartRef = useRef<{ x: number; offsetStart: number; id: number } | null>(null);
  const totalDragDeltaPx = useRef(0);
  const targetOffsetRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const isDraggingRef = useRef(false);
  const wheelTimeoutRef = useRef<number | null>(null);

  targetOffsetRef.current = targetOffset;
  scrollOffsetRef.current = scrollOffset;
  isDraggingRef.current = isDragging;

  const clampIndex = useCallback((idx: number) => {
    return Math.max(0, Math.min(maxIndex, idx));
  }, [maxIndex]);

  const scrollToIndex = useCallback((index: number) => {
    const clamped = clampIndex(index);
    setCurrentIndex(clamped);
    const newTarget = -clamped * SP;
    setTargetOffset(newTarget);
    if (prefersReducedMotion) {
      setScrollOffset(newTarget);
    }
  }, [clampIndex, prefersReducedMotion]);

  const next = useCallback(() => {
    scrollToIndex(currentIndex + 1);
  }, [currentIndex, scrollToIndex]);

  const prev = useCallback(() => {
    scrollToIndex(currentIndex - 1);
  }, [currentIndex, scrollToIndex]);

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't hijack if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setCurrentIndex((prevIdx) => {
          const nextIdx = Math.min(maxIndex, prevIdx + 1);
          setTargetOffset(-nextIdx * SP);
          return nextIdx;
        });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentIndex((prevIdx) => {
          const nextIdx = Math.max(0, prevIdx - 1);
          setTargetOffset(-nextIdx * SP);
          return nextIdx;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [maxIndex]);

  // Smooth lerp animation loop
  useEffect(() => {
    if (prefersReducedMotion) {
      setScrollOffset(targetOffset);
      return;
    }

    let animationFrameId: number;
    const lerpFactor = isDragging ? 0.35 : 0.08;

    const animate = () => {
      const current = scrollOffsetRef.current;
      const target = targetOffsetRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.0005) {
        const nextVal = current + diff * lerpFactor;
        setScrollOffset(nextVal);
      } else if (current !== target) {
        setScrollOffset(target);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging, prefersReducedMotion, targetOffset]);

  // Pointer drag events
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Only primary button
    if (e.button !== 0) return;
    
    dragStartRef.current = {
      x: e.clientX,
      offsetStart: targetOffsetRef.current,
      id: e.pointerId,
    };
    totalDragDeltaPx.current = 0;
    setHasMovedSinceDown(false);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragStartRef.current || dragStartRef.current.id !== e.pointerId) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    totalDragDeltaPx.current = Math.abs(deltaX);

    if (Math.abs(deltaX) > DRAG_THRESHOLD_PX) {
      setIsDragging(true);
      setHasMovedSinceDown(true);
    }

    // World units per pixel factor (responsive based on screen width)
    const factor = (SP * 2.2) / Math.max(window.innerWidth, 400);
    const newOffset = dragStartRef.current.offsetStart + deltaX * factor;

    // Soft bounds resistance
    const minBound = -maxIndex * SP - 0.8;
    const maxBound = 0.8;
    const clampedOffset = Math.max(minBound, Math.min(maxBound, newOffset));

    setTargetOffset(clampedOffset);
  }, [maxIndex]);

  const snapToNearest = useCallback(() => {
    if (!dragStartRef.current) return;
    dragStartRef.current = null;
    setIsDragging(false);

    // Snap to nearest lamp
    const nearestIndex = clampIndex(Math.round(-targetOffsetRef.current / SP));
    setCurrentIndex(nearestIndex);
    setTargetOffset(-nearestIndex * SP);
  }, [clampIndex]);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    if (dragStartRef.current && dragStartRef.current.id === e.pointerId) {
      snapToNearest();
    }
  }, [snapToNearest]);

  const onPointerCancel = useCallback((e: React.PointerEvent) => {
    if (dragStartRef.current && dragStartRef.current.id === e.pointerId) {
      snapToNearest();
    }
  }, [snapToNearest]);

  // Wheel handling
  const onWheel = useCallback((e: React.WheelEvent) => {
    // Prefer deltaX or horizontal-like intent, but allow deltaY if shiftKey or prominent
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) < 4) return;

    const factor = 0.0035;
    const newTarget = targetOffsetRef.current - delta * factor;
    const minBound = -maxIndex * SP - 0.4;
    const maxBound = 0.4;
    const clamped = Math.max(minBound, Math.min(maxBound, newTarget));

    setTargetOffset(clamped);

    // Debounce snap to nearest lamp
    if (wheelTimeoutRef.current !== null) {
      window.clearTimeout(wheelTimeoutRef.current);
    }
    wheelTimeoutRef.current = window.setTimeout(() => {
      const nearest = clampIndex(Math.round(-targetOffsetRef.current / SP));
      setCurrentIndex(nearest);
      setTargetOffset(-nearest * SP);
    }, 180);
  }, [clampIndex, maxIndex]);

  return {
    currentIndex,
    scrollOffset,
    targetOffset,
    isDragging,
    canPrev: currentIndex > 0,
    canNext: currentIndex < maxIndex,
    scrollToIndex,
    next,
    prev,
    bindContainer: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onWheel,
    },
    hasMovedSinceDown,
  };
}
