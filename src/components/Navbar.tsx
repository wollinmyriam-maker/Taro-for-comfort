import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Sparkles, Calendar, User, ShieldAlert, LogOut, Heart, Coins } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, openAuth }) => {
  const { currentUser, logout } = useApp();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-brand-gold-400/10 bg-brand-navy-950/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        
        {/* Brand Logo */}
        <button
          onClick={() => setCurrentTab('home')}
          className="group flex items-center space-x-3 text-left"
          id="nav-logo"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-brand-gold-400 bg-brand-navy-900 shadow-sm shadow-brand-gold-500/10">
            <Sparkles className="h-4.5 w-4.5 text-brand-gold-500 animate-pulse" />
            <div className="absolute inset-0 rounded-full border border-dashed border-brand-gold-300/30 group-hover:rotate-45 transition-transform duration-700"></div>
          </div>
          <div>
            <h1 className="font-serif text-[15px] sm:text-base font-bold tracking-[0.15em] text-brand-gold-500 flex items-center gap-1">
              <span>Taro for comfort</span>
            </h1>
            <p className="hidden text-[8px] tracking-[0.25em] text-[#006241] sm:block uppercase font-serif font-bold">
              Romance & Wealth Navigation
            </p>
          </div>
        </button>

        {/* Navigation Menus */}
        <div className="flex items-center space-x-1 sm:space-x-3">
          <button
            onClick={() => setCurrentTab('home')}
            className={`cursor-pointer rounded-lg px-3 py-1.5 font-sans text-xs sm:text-sm font-medium tracking-widest uppercase transition-all ${
              currentTab === 'home'
                ? 'bg-brand-gold-500/10 text-brand-gold-400 border border-brand-gold-500/20'
                : 'text-brand-gold-100/75 hover:bg-brand-navy-800 hover:text-brand-gold-400'
            }`}
            id="nav-home"
          >
            홈
          </button>
          
          <button
            onClick={() => {
              if (!currentUser) {
                openAuth();
              } else {
                setCurrentTab('booking');
              }
            }}
            className={`cursor-pointer flex items-center space-x-1 rounded-lg px-3 py-1.5 font-sans text-xs sm:text-sm font-medium tracking-widest uppercase transition-all ${
              currentTab === 'booking'
                ? 'bg-brand-gold-500/10 text-brand-gold-400 border border-brand-gold-500/20'
                : 'text-brand-gold-100/75 hover:bg-brand-navy-800 hover:text-brand-gold-400'
            }`}
            id="nav-booking"
          >
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span>상담 예약</span>
          </button>

          {currentUser && (
            <button
              onClick={() => setCurrentTab('mypage')}
              className={`cursor-pointer flex items-center space-x-1 rounded-lg px-3 py-1.5 font-sans text-xs sm:text-sm font-medium tracking-widest uppercase transition-all ${
                currentTab === 'mypage'
                  ? 'bg-brand-gold-500/10 text-brand-gold-400 border border-brand-gold-500/20'
                  : 'text-brand-gold-100/75 hover:bg-brand-navy-800 hover:text-brand-gold-400'
              }`}
              id="nav-mypage"
            >
              <User className="h-3.5 w-3.5 shrink-0" />
              <span>마이페이지</span>
            </button>
          )}

          {/* Admin panel Shortcut */}
          {currentUser?.role === 'ADMIN' ? (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`cursor-pointer flex items-center space-x-1 rounded-lg bg-red-950/40 border border-red-500/30 px-3 py-1.5 font-sans text-xs sm:text-sm font-medium tracking-widest uppercase text-red-400 transition-all hover:bg-red-900/30`}
              id="nav-admin"
            >
              <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">관리자 모드</span>
              <span className="sm:hidden">관리자</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (currentUser) {
                  const updatedUser = { ...currentUser, role: 'ADMIN' as const };
                  localStorage.setItem('comfort_user', JSON.stringify(updatedUser));
                  window.location.reload();
                } else {
                  const adminUser = {
                    id: 'admin-1',
                    name: '최고관리자 (공개스위치)',
                    email: 'admin@comfortcard.com',
                    role: 'ADMIN' as const,
                    provider: 'EMAIL' as const,
                  };
                  localStorage.setItem('comfort_user', JSON.stringify(adminUser));
                  window.location.reload();
                }
              }}
              className="group relative cursor-pointer flex items-center space-x-1 rounded-md border border-brand-gold-400/30 px-2 py-1 text-[9px] font-sans tracking-tight text-brand-gold-400 hover:bg-brand-gold-500/10 transition-all font-semibold"
              title="관리자 체험을 위해 간편 전환할 수 있는 버튼입니다."
              id="nav-admin-switch"
            >
              <ShieldAlert className="h-3 w-3 text-brand-gold-400 opacity-80" />
              <span className="text-brand-gold-400 font-serif">관리자 전환(테스트)</span>
            </button>
          )}

          {currentUser ? (
            <button
              onClick={() => {
                logout();
                setCurrentTab('home');
              }}
              className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy-900 text-brand-gold-100/75 hover:bg-brand-navy-800 hover:text-brand-gold-400 transition-all border border-brand-gold-400/10"
              title="로그아웃"
              id="nav-logout"
            >
              <LogOut className="h-4 w-4 text-[#006241]" />
            </button>
          ) : (
            <button
              onClick={openAuth}
              className="cursor-pointer rounded-lg bg-[#006241] text-white px-4 py-2 text-xs font-bold tracking-widest uppercase hover:bg-[#00452E] transition-colors shadow-sm"
              id="nav-login-btn"
            >
              로그인
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};
