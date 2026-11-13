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
    color: '#FF6B6B',
    textColor: '#C23B3B',
    href: '/cv',
    status: 'open',
  },
  {
    id: 'rasanara',
    title: 'Rasanara',
    subtitle: 'Digital Agency & Creative Technology',
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
    id: 'Article',
    title: 'Article',
    subtitle: 'Eksplorasi dan ruang eksperimen baru',
    color: '#475cffff',
    textColor: '#3200a8ff',
    href: '#',
    status: 'open',
  },
  // {
  //   id: 'soon-2',
  //   title: 'Segera hadir',
  //   subtitle: 'Wacana dan tulisan terpilih',
  //   color: '#8F879A',
  //   textColor: '#5E5669',
  //   href: '#',
  //   status: 'soon',
  // },
];

