import React, {
  CSSProperties,
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
    ...rest
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
        if (!event) return;

        const bounds = element.current.getBoundingClientRect();

        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;

        setStyling(element, x, y);
      });
    };

    const handleTouch = (event: TouchEvent) => {
      if (!isEnabled) return;
      requestAnimationFrame(() => {
        if (!element.current) return;
        if (!event) return;
        if (!event.targetTouches[0]) return;

        const bounds = element.current.getBoundingClientRect();

        const x = event.targetTouches[0].clientX - bounds.left;
        const y = event.targetTouches[0].clientY - bounds.top;

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
  }, [props]);

  return (
    <div className="relative" style={{ display: 'grid' }}>
      {isEnabled && (
        <div
          ref={element}
          className="absolute h-full w-full pointer-events-none mix-blend-multiply z-50"
          style={{ gridArea: '1/1/1/1' }}
          {...rest}
        />
      )}
      <div
        className={className}
        style={{ ...style, gridArea: '1/1/1/1' } as CSSProperties}
        {...rest}
      >
        {children}
      </div>
    </div>
  );
};
