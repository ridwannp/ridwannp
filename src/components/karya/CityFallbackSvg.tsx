import React from 'react';
import { KARYA_COPY } from '../../content/karya';

export const CityFallbackSvg: React.FC = () => {
  return (
    <div
      className="relative w-full h-full flex flex-col justify-end overflow-hidden"
      role="img"
      aria-label="Ilustrasi arsitektur kota karya: tiga bangunan mewakili karya jadi, cangkang konstruksi dengan crane, dan rangka konsep."
    >
      <svg
        viewBox="0 0 1440 600"
        className="w-full h-full object-cover object-bottom"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78B7F1" />
            <stop offset="30%" stopColor="#B2D6F6" />
            <stop offset="55%" stopColor="#F1E7D3" />
            <stop offset="85%" stopColor="#EFE4D0" />
            <stop offset="100%" stopColor="#E5DAC5" />
          </linearGradient>

          <linearGradient id="windowGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFE79A" />
            <stop offset="100%" stopColor="#E5B238" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="1440" height="600" fill="url(#skyGrad)" />

        {/* Distant City Silhouettes */}
        <g fill="#CBD9E5" opacity="0.6">
          <rect x="180" y="240" width="80" height="220" rx="2" />
          <rect x="250" y="200" width="95" height="260" rx="2" />
          <rect x="360" y="270" width="75" height="190" rx="2" />
          <rect x="520" y="210" width="110" height="250" rx="2" />
          <rect x="650" y="250" width="85" height="210" rx="2" />
          <rect x="750" y="190" width="90" height="270" rx="2" />
          <rect x="860" y="230" width="100" height="230" rx="2" />
          <rect x="980" y="210" width="85" height="250" rx="2" />
          <rect x="1080" y="260" width="95" height="200" rx="2" />
          <rect x="1190" y="220" width="110" height="240" rx="2" />
        </g>

        {/* Ground Plane with Grid lines */}
        <path d="M0 450 L1440 450 L1440 600 L0 600 Z" fill="#F8F6F0" />
        <g stroke="#E0D7C6" strokeWidth="1" opacity="0.8">
          <line x1="0" y1="465" x2="1440" y2="465" />
          <line x1="0" y1="490" x2="1440" y2="490" />
          <line x1="0" y1="525" x2="1440" y2="525" />
          <line x1="0" y1="570" x2="1440" y2="570" />
          {Array.from({ length: 28 }).map((_, i) => (
            <line
              key={i}
              x1={i * 55 - 40}
              y1="450"
              x2={i * 75 - 120}
              y2="600"
            />
          ))}
        </g>

        {/* Low-poly Trees */}
        <g>
          {/* Tree 1 */}
          <rect x="435" y="445" width="8" height="25" fill="#6B4F35" />
          <polygon points="439,410 422,430 432,448 446,448 456,430" fill="#4E8C53" />

          {/* Tree 2 */}
          <rect x="665" y="448" width="7" height="22" fill="#6B4F35" />
          <polygon points="668,418 654,435 662,450 675,450 683,435" fill="#5A9E60" />

          {/* Tree 3 */}
          <rect x="915" y="445" width="8" height="25" fill="#6B4F35" />
          <polygon points="919,412 904,432 912,448 926,448 934,432" fill="#4E8C53" />

          {/* Tree 4 */}
          <rect x="1145" y="448" width="7" height="22" fill="#6B4F35" />
          <polygon points="1148,418 1134,435 1142,450 1155,450 1163,435" fill="#5A9E60" />
        </g>

        {/* Building 1: Built (Dibangun - Jadi) */}
        <g id="bld-built">
          <rect x="230" y="270" width="165" height="195" rx="3" fill="#F4EFE6" stroke="#DCD4C4" strokeWidth="2" />
          <rect x="225" y="260" width="175" height="14" rx="2" fill="#2E2C33" />
          {/* Glowing Windows */}
          <rect x="250" y="290" width="34" height="24" rx="2" fill="url(#windowGlow)" />
          <rect x="295" y="290" width="34" height="24" rx="2" fill="url(#windowGlow)" />
          <rect x="250" y="330" width="34" height="24" rx="2" fill="url(#windowGlow)" />
          <rect x="295" y="330" width="34" height="24" rx="2" fill="url(#windowGlow)" />
          <rect x="250" y="370" width="34" height="24" rx="2" fill="url(#windowGlow)" />
          <rect x="295" y="370" width="34" height="24" rx="2" fill="url(#windowGlow)" />
          <rect x="250" y="410" width="34" height="24" rx="2" fill="url(#windowGlow)" />
          <rect x="295" y="410" width="34" height="24" rx="2" fill="url(#windowGlow)" />
          {/* Vertical Decorative Burgundy Slats */}
          <g fill="#8B1538">
            <rect x="350" y="280" width="4" height="175" rx="1" />
            <rect x="358" y="280" width="4" height="175" rx="1" />
            <rect x="366" y="280" width="4" height="175" rx="1" />
            <rect x="374" y="280" width="4" height="175" rx="1" />
            <rect x="382" y="280" width="4" height="175" rx="1" />
          </g>
        </g>

        {/* Building 2: Under Construction (Sedang dibangun) */}
        <g id="bld-building">
          {/* Solid lower concrete shell */}
          <rect x="480" y="360" width="155" height="105" rx="2" fill="#D3CBC0" stroke="#B8AFA2" strokeWidth="2" />
          {/* Rebar poles extending upward */}
          <g stroke="#55514C" strokeWidth="3">
            <line x1="490" y1="360" x2="490" y2="295" />
            <line x1="530" y1="360" x2="530" y2="295" />
            <line x1="580" y1="360" x2="580" y2="295" />
            <line x1="625" y1="360" x2="625" y2="295" />
          </g>
          {/* Scaffold horizontal railing */}
          <line x1="485" y1="315" x2="630" y2="315" stroke="#55514C" strokeWidth="2" />
          <line x1="485" y1="340" x2="630" y2="340" stroke="#55514C" strokeWidth="2" />

          {/* Construction Crane */}
          <g id="crane">
            {/* Burgundy Mast */}
            <rect x="660" y="160" width="10" height="305" fill="#8B1538" />
            {/* Operator Cab & Boom */}
            <rect x="652" y="152" width="26" height="18" rx="2" fill="#D4AF37" />
            {/* Horizontal Jib Arm */}
            <rect x="530" y="156" width="210" height="6" fill="#8B1538" />
            {/* Counterweight */}
            <rect x="720" y="152" width="22" height="14" fill="#3D3A44" />
            {/* Cable & Golden Hook */}
            <line x1="570" y1="162" x2="570" y2="270" stroke="#222026" strokeWidth="1.5" />
            <circle cx="570" cy="275" r="4" fill="#D4AF37" />
          </g>
        </g>

        {/* Building 3: Concept (Konsep - Rangka Baja) */}
        <g id="bld-concept">
          {/* Steel Pillars */}
          <rect x="730" y="300" width="7" height="165" fill="#2E2C33" />
          <rect x="800" y="300" width="7" height="165" fill="#2E2C33" />
          <rect x="870" y="300" width="7" height="165" fill="#2E2C33" />
          {/* Floor Slabs */}
          <rect x="725" y="405" width="155" height="8" rx="1" fill="#2E2C33" />
          <rect x="725" y="350" width="155" height="8" rx="1" fill="#2E2C33" />
          <rect x="725" y="295" width="155" height="8" rx="1" fill="#2E2C33" />
          {/* Ghost outline wireframe for planned volume */}
          <rect
            x="725"
            y="210"
            width="155"
            height="85"
            fill="none"
            stroke="#8B1538"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.5"
          />
        </g>
      </svg>

      <div className="absolute bottom-4 left-6 right-6 text-center text-xs text-[#5F5A66] bg-[#FBFAF7]/90 backdrop-blur-sm py-2 px-4 rounded-full border border-[#E4DED3] mx-auto max-w-lg shadow-sm">
        {KARYA_COPY.fallbackNotice}
      </div>
    </div>
  );
};

