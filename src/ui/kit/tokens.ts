export const DUSK_COLORS = {
  cream: '#FFF1D6',
  gold: '#FFC83D',
  coral: '#E0316A',
  mint: '#4FD1A1',
  ink: '#1A0F24',
  burgundy: '#8B1538',
  plum: '#2B1026',
} as const;

export const DUSK_HEX = {
  cream: 0xfff1d6,
  gold: 0xffc83d,
  coral: 0xe0316a,
  mint: 0x4fd1a1,
  ink: 0x1a0f24,
  burgundy: 0x8b1538,
  plum: 0x2b1026,
  ambient: 0x9a7ab8,
  directional: 0xffe0b0,
  fog: 0x4a1236,
} as const;

export const DUSK_FONTS = {
  display: '"Bricolage Grotesque", -apple-system, sans-serif',
  body: '"Space Grotesk", -apple-system, sans-serif',
  serif: '"Instrument Serif", Georgia, serif',
} as const;

export const DUSK_SHADOWS = {
  chunky: '4px 4px 0 #1A0F24',
  chunkyHover: '7px 7px 0 #1A0F24',
  chunkyActive: '2px 2px 0 #1A0F24',
  booth: (accent = '#FFC83D') => `9px 9px 0 ${accent}`,
  sticker: '3.5px 3.5px 0 #E0316A',
  stickerSm: '2.5px 2.5px 0 #E0316A',
} as const;

