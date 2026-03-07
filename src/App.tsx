import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Lesson from './pages/Lesson';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import { ProgressionProvider } from './contexts/ProgressionContext';

function App() {
  return (
    <ProgressionProvider>
      <div className="min-h-screen transition-colors duration-200 flex flex-col font-sans">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lesson/:slug" element={<Lesson />} />
            </Routes>
          </main>
        </div>
      </div>
    </ProgressionProvider>
  );
}

export default App;
