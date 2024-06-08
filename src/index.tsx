import React, {
  ComponentPropsWithoutRef,
  RefObject,
  useEffect,
  useRef,
} from 'react';

interface ITunnelVisionAreaProps extends ComponentPropsWithoutRef<'div'> {
  size?: number;
  isEnabled?: boolean;
}

export const TunnelVisionArea: React.FC<ITunnelVisionAreaProps> = (props) => {
  const {
    size = 50,
    isEnabled = true,
    className = '',
    style,
    children,
  } = props;

  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setStyling = (
      element: RefObject<HTMLDivElement>,
      x: number,
      y: number
    ) => {
      element.current?.style.setProperty(
        'background',
        `radial-gradient(circle ${size}px at ${x}px ${y}px, transparent ${size}px, rgb(0, 0, 0) ${size}px)`
      );
      element.current?.style.setProperty('transition', 'background 0.05s');
    };

    const handlePointer = (event: PointerEvent) => {
      if (!isEnabled) return;
      requestAnimationFrame(() => {
        if (!element.current) return;

        const x = event.clientX;
        const y = event.clientY;

        setStyling(element, x, y);
      });
    };

    const handleTouch = (event: TouchEvent) => {
      if (!isEnabled) return;
      requestAnimationFrame(() => {
        if (!element.current) return;

        const x = event.targetTouches[0].clientX;
        const y = event.targetTouches[0].clientY;

        setStyling(element, x, y);
      });
    };

    window.addEventListener('pointermove', handlePointer);
    window.addEventListener('pointerleave', handlePointer);
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('touchmove', handleTouch);
    window.addEventListener('touchend', handleTouch);

    return () => {
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('pointerleave', handlePointer);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handleTouch);
    };
  }, []);

  return (
    <div className="relative" style={{ display: 'grid' }}>
      {isEnabled && (
        <div
          ref={element}
          className="absolute h-full w-full pointer-events-none mix-blend-multiply z-50"
          style={{ gridArea: '1/1/1/1' }}
        />
      )}
      <div className={className} style={{ ...style, gridArea: '1/1/1/1' }}>
        {children}
      </div>
    </div>
  );
};
