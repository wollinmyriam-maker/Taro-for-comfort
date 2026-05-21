import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { LandingHero } from './components/LandingHero.tsx';
import { BookingCalendar } from './components/BookingCalendar.tsx';
import { MyPageView } from './components/MyPageView.tsx';
import { AdminPanel } from './components/AdminPanel.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { Compass, Sparkles, Heart, Coins, ShieldAlert, Lock, User } from 'lucide-react';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const { currentUser } = useApp();

  const handleTabChange = (tab: string) => {
    // If user tries to book or inspect records, enforce auth
    if ((tab === 'booking' || tab === 'mypage') && !currentUser) {
      setIsAuthOpen(true);
    } else {
      setCurrentTab(tab);
    }
  };

  const handleAuthSuccess = () => {
    // Determine target page after auth
    if (currentUser?.role === 'ADMIN') {
      setCurrentTab('admin');
    } else {
      setCurrentTab('booking');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-brand-navy-950 font-sans text-brand-gold-100 relative selection:bg-brand-gold-500 selection:text-brand-navy-950">
      
      {/* Absolute Ambient Background Details */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-b from-brand-navy-900/40 to-transparent pointer-events-none -z-10"></div>
      
      {/* Floating Subtle Ambient Tarot Cards in Background */}
      <div className="absolute top-[18%] left-4 sm:left-12 opacity-[0.14] pointer-events-none select-none -z-20 tarot-bg-card-slow hidden lg:block">
        <div className="w-32 sm:w-40 aspect-[1/1.7] rounded-xl border-2 border-[#006241]/40 p-2.5 flex flex-col justify-between bg-brand-navy-900 shadow-md">
          <div className="flex justify-between items-center text-[10px] text-brand-gold-400 font-serif">
            <span>XVII</span>
            <span className="animate-pulse">★</span>
            <span>THE STAR</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-brand-gold-300" />
          </div>
          <div className="text-center font-serif text-[10px] text-brand-gold-400 uppercase tracking-widest border-t border-brand-gold-400/10 pt-1.5">
            Taro for comfort
          </div>
        </div>
      </div>

      <div className="absolute top-[48%] right-4 sm:right-12 opacity-[0.14] pointer-events-none select-none -z-20 tarot-bg-card-fast hidden lg:block">
        <div className="w-32 sm:w-40 aspect-[1/1.7] rounded-xl border-2 border-[#006241]/40 p-2.5 flex flex-col justify-between bg-brand-navy-900 shadow-md">
          <div className="flex justify-between items-center text-[10px] text-brand-gold-400 font-serif">
            <span>X</span>
            <span className="animate-pulse">★</span>
            <span>FORTUNE</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Compass className="h-10 w-10 text-brand-gold-300" />
          </div>
          <div className="text-center font-serif text-[10px] text-brand-gold-400 uppercase tracking-widest border-t border-brand-gold-400/10 pt-1.5">
            Taro for comfort
          </div>
        </div>
      </div>

      <div className="absolute top-[75%] left-6 opacity-[0.14] pointer-events-none select-none -z-20 tarot-bg-card-slow hidden xl:block">
        <div className="w-32 sm:w-40 aspect-[1/1.7] rounded-xl border-2 border-[#006241]/40 p-2.5 flex flex-col justify-between bg-brand-navy-900 shadow-md">
          <div className="flex justify-between items-center text-[10px] text-brand-gold-400 font-serif">
            <span>II</span>
            <span className="animate-pulse">★</span>
            <span>PRIESTESS</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Heart className="h-10 w-10 text-brand-gold-300" />
          </div>
          <div className="text-center font-serif text-[10px] text-brand-gold-400 uppercase tracking-widest border-t border-brand-gold-400/10 pt-1.5">
            Taro for comfort
          </div>
        </div>
      </div>

      
      <div className="flex-1 flex flex-col">
        {/* Navigation Bar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={handleTabChange}
          openAuth={() => setIsAuthOpen(true)}
        />

        {/* Core Screen Routing Pages */}
        <main className="flex-1 relative">
          
          {currentTab === 'home' && (
            <LandingHero
              setCurrentTab={handleTabChange}
              openAuth={() => setIsAuthOpen(true)}
            />
          )}

          {currentTab === 'booking' && currentUser && (
            <div className="animate-fade-in py-6">
              <BookingCalendar setCurrentTab={handleTabChange} />
            </div>
          )}

          {currentTab === 'mypage' && currentUser && (
            <div className="animate-fade-in py-6">
              <MyPageView />
            </div>
          )}

          {currentTab === 'admin' && currentUser?.role === 'ADMIN' && (
            <div className="animate-fade-in py-6">
              <AdminPanel />
            </div>
          )}

        </main>
      </div>

      {/* FOOTER: Minimalist elegant luxury style */}
      <footer className="border-t border-brand-gold-400/20 bg-brand-navy-950/90 py-12 text-center text-xs sm:text-sm font-sans tracking-tight">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 space-y-6">
          
          {/* Footer Logo */}
          <div className="flex items-center justify-center space-x-2">
            <Sparkles className="h-4 w-4 text-brand-gold-500 opacity-85" />
            <span className="font-serif text-lg font-bold tracking-[0.25em] text-brand-gold-500">
              Taro for comfort
            </span>
          </div>

          <p className="text-xs text-brand-gold-100/60 max-w-md mx-auto leading-relaxed">
            흔들리는 관계의 틈새 속 그 사람의 마음도, 막막하게만 느껴지는 자금과 재물의 기로도 결국 올바른 때(Timing)가 있습니다. 당신 삶에 가장 안락하고 현명한 영혼의 이정표가 될 것을 약속드립니다.
          </p>

          <div className="flex justify-center space-x-4 text-[11px] text-brand-gold-400/80">
            <span>사업자등록번호: 2026-SEEUN-4001</span>
            <span>•</span>
            <span>대표 카운슬러: 석세은</span>
            <span>•</span>
            <span>이메일: seeun4001@naver.com</span>
          </div>

          <div className="text-[10px] text-brand-gold-100/30 pt-4 border-t border-brand-gold-400/5">
            © 2026 Taro for comfort All Rights Reserved. Crafted with Premium Tarot & Zodiac Alignment.
          </div>
        </div>
      </footer>

      {/* LOGIN POPUP MODAL GATEWAY */}
      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
