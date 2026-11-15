import gsap from 'gsap';

export function attachMagnetic(element: HTMLElement, maxDistance = 6): () => void {
  if (typeof window === 'undefined') return () => {};

  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return () => {};

  const onMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    const moveX = Math.max(-maxDistance, Math.min(maxDistance, deltaX * maxDistance));
    const moveY = Math.max(-maxDistance, Math.min(maxDistance, deltaY * maxDistance));

    gsap.to(element, {
      x: moveX,
      y: moveY,
      duration: 0.3,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  const onMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto',
    });
  };

  element.addEventListener('mousemove', onMouseMove);
  element.addEventListener('mouseleave', onMouseLeave);

  return () => {
    element.removeEventListener('mousemove', onMouseMove);
    element.removeEventListener('mouseleave', onMouseLeave);
    gsap.set(element, { x: 0, y: 0 });
  };
}

