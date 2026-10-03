import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { EnquiryModal } from './components/modals/EnquiryModal';
import { AuthModal } from './components/modals/AuthModal';
import { FloatingCompareBar } from './components/common/FloatingCompareBar';
import { ChatWidget } from './chat/components/ChatWidget';
import { Home } from './pages/Home';
import { Colleges } from './pages/Colleges';
import { Compare } from './pages/Compare';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Account } from './pages/Account';
import { Admin } from './pages/Admin';

function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/colleges" element={<Colleges />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/account" element={<Account />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
            <Footer />
            <Toast />
            <EnquiryModal />
            <AuthModal />
            <FloatingCompareBar />
            <ChatWidget />
          </div>
        </BrowserRouter>
      </CompareProvider>
    </AuthProvider>
  );
}

export default App;
