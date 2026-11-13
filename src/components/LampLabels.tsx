import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DOORS, Door } from '../data/doors';
import { ArrowRight } from 'lucide-react';

interface LampLabelsProps {
  labelRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  hoveredIndex: number | null;
  onHoverDoor: (index: number | null) => void;
  onSelectDoor: (index: number) => void;
}

export const LampLabels: React.FC<LampLabelsProps> = memo(({
  labelRefs,
  hoveredIndex,
  onHoverDoor,
  onSelectDoor,
}) => {
  const navigate = useNavigate();

  const handleLabelClick = (door: Door, index: number) => {
    onSelectDoor(index);
    if (door.status === 'open' && door.href && door.href !== '#') {
      navigate(door.href);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden" aria-hidden="true">
      {DOORS.map((door, index) => {
        const isHovered = hoveredIndex === index;
        const isSoon = door.status === 'soon';
        const formattedNumber = String(index + 1).padStart(2, '0');

        return (
          <div
            key={door.id}
            ref={(el) => (labelRefs.current[index] = el)}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              willChange: 'transform, opacity',
              transform: 'translate3d(-9999px, -9999px, 0)',
              opacity: 0,
            }}
            className="pointer-events-auto select-none"
          >
            <div
              onClick={() => handleLabelClick(door, index)}
              onMouseEnter={() => onHoverDoor(index)}
              onMouseLeave={() => onHoverDoor(null)}
              className={`flex flex-col items-center text-center -translate-x-1/2 p-3 rounded-2xl transition-all duration-300 max-w-[260px] sm:max-w-[280px] ${isSoon ? 'cursor-default' : 'cursor-pointer hover:bg-white/40 backdrop-blur-[1px]'
                }`}
            >
              {/* Number indicator */}
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="font-sans font-bold text-xs tracking-widest transition-colors duration-200"
                  style={{
                    color: isHovered ? door.textColor : '#8F879A',
                  }}
                >
                  {formattedNumber}
                </span>
                <span className="w-1 h-1 rounded-full bg-[#8F879A]" />
                <span className="text-[11px] font-sans font-medium text-[#8F879A]">
                  {isSoon ? 'Akan Datang' : 'Pintu Masuk'}
                </span>
              </div>

              {/* Title */}
              <h2
                className="font-sans font-bold text-lg sm:text-xl tracking-tight transition-all duration-200 flex items-center justify-center gap-1"
                style={{
                  color: isHovered ? door.textColor : '#141218',
                  transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                }}
              >
                <span>{door.title}</span>
                {!isSoon && (
                  <ArrowRight
                    className="w-4 h-4 transition-transform duration-200"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'translateX(2px)' : 'translateX(-4px)',
                      color: door.textColor,
                    }}
                  />
                )}
              </h2>

              {/* Subtitle */}
              {door.subtitle && (
                <p className="mt-1 font-sans text-xs sm:text-xs text-[#5E5669] leading-relaxed line-clamp-2">
                  {door.subtitle}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
});

LampLabels.displayName = 'LampLabels';

