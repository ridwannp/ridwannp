import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Terrace from './components/Terrace';
import CvPage from './pages/CvPage';
import RasanaraPage from './pages/RasanaraPage';
import KaryaPage from './pages/KaryaPage';

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
          <Route path="/cv" element={<CvPage />} />
          <Route path="/rasanara" element={<RasanaraPage />} />
          <Route path="/karya" element={<KaryaPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

