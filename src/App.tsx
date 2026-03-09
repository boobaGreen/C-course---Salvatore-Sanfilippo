import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Lesson from './pages/Lesson';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import { ProgressionProvider } from './contexts/ProgressionContext';
import XpToast from './components/ui/XpToast';

import Footer from './components/layout/Footer';

function App() {
  return (
    <ProgressionProvider>
      <XpToast />
      <div className="h-screen w-full transition-colors duration-200 flex flex-col font-sans overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-y-auto w-full flex flex-col bg-slate-50 dark:bg-[#0c0c0e]">
            <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lesson/:slug" element={<Lesson />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </ProgressionProvider>
  );
}

export default App;
