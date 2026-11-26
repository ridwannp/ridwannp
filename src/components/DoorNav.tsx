import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DOORS, Door } from '../data/doors';

interface DoorNavProps {
  currentIndex: number;
  hoveredIndex: number | null;
  onHoverDoor: (index: number | null) => void;
  onSelectDoor: (index: number) => void;
}

export const DoorNav: React.FC<DoorNavProps> = memo(({
  currentIndex,
  hoveredIndex,
  onHoverDoor,
  onSelectDoor,
}) => {
  const navigate = useNavigate();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, door: Door) => {
    e.preventDefault();
    if (door.status === 'open' && door.href && door.href !== '#') {
      navigate(door.href);
    }
  };

  return (
    <nav
      aria-label="Pintu Navigasi Teras"
      className="absolute bottom-6 md:bottom-8 left-0 right-0 z-30 flex justify-center safe-bottom px-4"
    >
      <div className="inline-flex items-center gap-1.5 md:gap-2 p-1.5 md:p-2 bg-[#FBFAF7]/90 backdrop-blur-md rounded-full border border-[#141218]/15 shadow-sm max-w-full overflow-x-auto no-scrollbar">
        {DOORS.map((door, index) => {
          const isActive = currentIndex === index;
          const isHovered = hoveredIndex === index;
          const isHighlighted = isHovered || (hoveredIndex === null && isActive);

          if (door.status === 'soon') {
            return (
              <span
                key={door.id}
                role="link"
                aria-disabled="true"
                tabIndex={0}
                onMouseEnter={() => onHoverDoor(index)}
                onMouseLeave={() => onHoverDoor(null)}
                onFocus={() => {
                  onSelectDoor(index);
                  onHoverDoor(index);
                }}
                onBlur={() => onHoverDoor(null)}
                className={`relative px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-sans font-medium rounded-full cursor-not-allowed select-none whitespace-nowrap shrink-0 transition-all duration-200 ${
                  isHighlighted
                    ? 'bg-[#141218]/5 text-[#5E5669]'
                    : 'text-[#8F879A] hover:text-[#5E5669]'
                }`}
                title="Segera hadir"
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8F879A]" />
                  <span>{door.title}</span>
                  <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#141218]/5 text-[#5E5669]">
                    Nanti
                  </span>
                </span>
              </span>
            );
          }

          return (
            <a
              key={door.id}
              href={door.href}
              onClick={(e) => handleLinkClick(e, door)}
              onMouseEnter={() => onHoverDoor(index)}
              onMouseLeave={() => onHoverDoor(null)}
              onFocus={() => {
                onSelectDoor(index);
                onHoverDoor(index);
              }}
              onBlur={() => onHoverDoor(null)}
              className={`relative px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-sans font-medium rounded-full transition-all duration-200 select-none whitespace-nowrap shrink-0 ${
                isHighlighted
                  ? 'bg-white shadow-sm ring-1'
                  : 'text-[#141218] hover:bg-black/5'
              }`}
              style={{
                color: isHighlighted ? door.textColor : '#141218',
                borderColor: isHighlighted ? door.color : 'transparent',
              }}
            >
              <span className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full transition-transform duration-200"
                  style={{
                    backgroundColor: door.color,
                    transform: isHighlighted ? 'scale(1.25)' : 'scale(1)',
                  }}
                />
                <span className="font-semibold">{door.title}</span>
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
});

DoorNav.displayName = 'DoorNav';

