import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { Navbar } from './components/Navbar';
import { CursorFollower } from './components/CursorFollower';
import { ParticleBackground } from './components/ParticleBackground';

import { HomePage } from './pages/HomePage';
import { UpdatesPage } from './pages/UpdatesPage';
import { GalleryPage } from './pages/GalleryPage';
import { AllWorkPage } from './pages/AllWorkPage';
import { AdminPage } from './pages/AdminPage';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const AppContent: React.FC = () => {
  return (
    <>
      <ParticleBackground />
      <CursorFollower />
      <Navbar />
      <main className="min-h-screen z-10 relative">
        <PageTransition>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/updates" element={<UpdatesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/all-work" element={<AllWorkPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </PageTransition>
      </main>
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
