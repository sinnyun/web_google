import React, { useState } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Home from './pages/Home';
import Work from './pages/Work';
import ProjectDetail from './pages/ProjectDetail';
import AboutOverlay from './components/AboutOverlay';
import { AnimatePresence } from 'framer-motion';

const Navbar: React.FC<{ onOpenAbout: () => void }> = ({ onOpenAbout }) => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 px-6 py-6 md:px-12 md:py-8 flex justify-between items-center mix-blend-difference text-white transition-colors duration-500`}>
      <Link to="/" className="text-xl md:text-2xl font-bold tracking-[0.2em] uppercase hover:opacity-70 transition-opacity">
        Sinnyun
      </Link>

      <div className="flex items-center gap-8 md:gap-12">
        <Link to="/work" className={`hidden md:block text-sm tracking-widest uppercase hover:underline underline-offset-8 ${location.pathname === '/work' ? 'underline' : ''}`}>
          Work
        </Link>
        <button 
          onClick={onOpenAbout} 
          className="flex items-center gap-2 text-sm tracking-widest uppercase hover:opacity-70 transition-opacity group"
        >
          <span className="hidden md:inline">About</span>
          <Menu className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </nav>
  );
};

const App: React.FC = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <HashRouter>
      <div className="bg-stone-950 min-h-screen text-stone-50 selection:bg-white selection:text-black">
        <Navbar onOpenAbout={() => setIsAboutOpen(true)} />
        
        <AboutOverlay isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

        <AnimatePresence mode='wait'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/work" element={<Work />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
          </Routes>
        </AnimatePresence>
      </div>
    </HashRouter>
  );
};

export default App;
