import gsap from 'gsap';

export function attachCardTilt(
  cardElement: HTMLElement,
  glareElement?: HTMLElement | null
): () => void {
  if (typeof window === 'undefined') return () => {};

  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isFinePointer) return () => {};

  const maxTilt = 6; // degrees

  const onMouseMove = (e: MouseEvent) => {
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    const rotateX = -normY * maxTilt;
    const rotateY = normX * maxTilt;

    gsap.to(cardElement, {
      transformPerspective: 800,
      rotateX,
      rotateY,
      duration: 0.25,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    if (glareElement) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      glareElement.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.12), transparent 70%)`;
      glareElement.style.opacity = '1';
    }
  };

  const onMouseLeave = () => {
    gsap.to(cardElement, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto',
    });

    if (glareElement) {
      glareElement.style.opacity = '0';
    }
  };

  cardElement.addEventListener('mousemove', onMouseMove);
  cardElement.addEventListener('mouseleave', onMouseLeave);

  return () => {
    cardElement.removeEventListener('mousemove', onMouseMove);
    cardElement.removeEventListener('mouseleave', onMouseLeave);
    gsap.set(cardElement, { rotateX: 0, rotateY: 0 });
  };
}

