import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Terrace from './components/Terrace';
import CvPage from './pages/CvPage';
import RasanaraPage from './pages/RasanaraPage';
import KaryaPage from './pages/KaryaPage';
import CaseStudyPage from './pages/CaseStudyPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { DevKitPage } from './pages/DevKitPage';
import { Kenali } from './playground/pages/Kenali';
import { KenaliResult } from './playground/pages/KenaliResult';
import { ProductsList } from './playground/pages/ProductsList';
import { ProductDetail } from './playground/pages/ProductDetail';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="w-screen h-screen flex items-center justify-center bg-[#FBFAF7] text-xs font-sans text-[#8F879A]">
            <span>Memuat...</span>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Terrace />} />
          <Route path="/profile" element={<CvPage />} />
          <Route path="/cv" element={<CvPage />} />
          <Route path="/rasanara" element={<RasanaraPage />} />
          <Route path="/karya" element={<KaryaPage />} />
          <Route path="/karya/:slug" element={<CaseStudyPage />} />

          {/* Digital Playground */}
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/dev/kit" element={<DevKitPage />} />
          <Route path="/playground/kenali" element={<Kenali />} />
          <Route path="/playground/kenali/hasil" element={<KenaliResult />} />
          <Route path="/playground/kenali/hasil/:id" element={<KenaliResult />} />
          <Route path="/playground/produk" element={<ProductsList />} />
          <Route path="/playground/produk/:slug" element={<ProductDetail />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
