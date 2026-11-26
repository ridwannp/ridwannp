export interface Door {
  id: string;
  title: string;
  subtitle?: string;
  color: string;
  textColor: string;
  href: string;
  status: 'open' | 'soon';
}

export const DOORS: Door[] = [
  {
    id: 'founder',
    title: 'Profile',
    subtitle: 'Mengenal latar belakang saya',
    color: '#08109fff',
    textColor: '#02064fff',
    href: '/profile',
    status: 'open',
  },
  {
    id: 'rasanara',
    title: 'Rasanara',
    subtitle: 'Digital Business Transformation Partner',
    color: '#8B1538',
    textColor: '#8B1538',
    href: '/rasanara',
    status: 'open',
  },
  {
    id: 'Portofolio',
    title: 'Karya',
    subtitle: 'Melihat apa yang pernah dibangun',
    color: '#FFB547',
    textColor: '#A86A00',
    href: '/karya',
    status: 'open',
  },
  {
    id: 'playground',
    title: 'Playground',
    subtitle: 'Mencoba, menemukan, dan membawa pulang alat yang berguna',
    color: '#4FD1A1',
    textColor: '#1E8A63',
    href: '/playground',
    status: 'open',
  },
];

