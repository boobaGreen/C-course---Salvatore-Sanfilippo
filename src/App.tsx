import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Lesson from './pages/Lesson';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import { ProgressionProvider } from './contexts/ProgressionContext';

import Footer from './components/layout/Footer';

function App() {
  return (
    <ProgressionProvider>
      <div className="min-h-screen transition-colors duration-200 flex flex-col font-sans">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="flex-1 overflow-y-auto w-full flex flex-col">
            <main className="flex-1 w-full">
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
