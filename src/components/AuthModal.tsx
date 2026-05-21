import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Sparkles, Shield, X, MessageCircle, Link, Check, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const { loginWithSocial, loginAsAdmin } = useApp();
  
  // Simulation Steps
  const [step, setStep] = useState<'SELECT' | 'CONFIRM_SOCIAL' | 'ADMIN_LOGIN'>('SELECT');
  const [selectedProvider, setSelectedProvider] = useState<'KAKAO' | 'NAVER' | null>(null);
  
  // Prefill matching user meta and environment
  const [userName, setUserName] = useState<string>('이미란');
  const [userPhone, setUserPhone] = useState<string>('010-9941-8812');
  const [userEmail, setUserEmail] = useState<string>('wollinmyriam@gmail.com');
  
  // Admin form
  const [adminPass, setAdminPass] = useState<string>('');
  const [adminError, setAdminError] = useState<string>('');

  const handleSocialSelect = (provider: 'KAKAO' | 'NAVER') => {
    setSelectedProvider(provider);
    setStep('CONFIRM_SOCIAL');
  };

  const handleSocialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) return;

    if (selectedProvider) {
      loginWithSocial(selectedProvider, userName, userPhone, userEmail);
      onSuccess();
      onClose();
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    
    const success = loginAsAdmin(adminPass);
    if (success) {
      onSuccess();
      onClose();
    } else {
      setAdminError('올바른 최고관리자 패스워드가 아닙니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-brand-navy-950/90 backdrop-blur-sm cursor-pointer"
      ></div>

      {/* Modal Main Board */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-brand-gold-400/30 bg-brand-navy-900 p-6 shadow-2xl animate-fade-in">
        
        {/* Subtle Decorative Stars */}
        <div className="absolute top-0 right-0 h-24 w-24 -mr-6 -mt-6 rounded-full bg-brand-gold-500/10 blur-xl"></div>
        <div className="absolute -left-4 top-1/2 h-16 w-16 rounded-full bg-brand-navy-800/80 blur-xl"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 text-brand-gold-100/60 hover:text-brand-gold-300 transition-colors"
          id="auth-close-btn"
        >
          <X className="h-5 w-5" />
        </button>

        {step === 'SELECT' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold-300/40 bg-brand-navy-950">
                <Sparkles className="h-5 w-5 text-brand-gold-500 animate-spin" style={{ animationDuration: '30s' }} />
              </div>
              <h3 className="font-serif text-lg font-bold tracking-widest text-brand-gold-500 uppercase">
                Taro for comfort
              </h3>
              <p className="text-xs text-brand-gold-100/70 font-sans max-w-xs mx-auto">
                로그인 하나로 더 높은 퀄리티의 연애 & 재물 운의 이정표 스케줄링을 시작하세요.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* KAKAO BTN: Style matching standard Kakao specs */}
              <button
                onClick={() => handleSocialSelect('KAKAO')}
                className="cursor-pointer w-full flex items-center justify-center space-x-3 rounded-xl bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-sans text-sm font-semibold py-3 px-4 transition-all duration-200 shadow-md shadow-amber-900/10"
                id="social-kakao-btn"
              >
                <MessageCircle className="h-5 w-5 fill-[#191919] text-[#191919] shrink-0" />
                <span>카카오 1초 간편 로그인</span>
              </button>

              {/* NAVER BTN: Style matching standard Naver specs */}
              <button
                onClick={() => handleSocialSelect('NAVER')}
                className="cursor-pointer w-full flex items-center justify-center space-x-3 rounded-xl bg-[#03C75A] hover:bg-[#03C75A]/90 text-white font-sans text-sm font-semibold py-3 px-4 transition-all duration-200 shadow-md shadow-emerald-950/10"
                id="social-naver-btn"
              >
                <div className="h-5 w-5 rounded bg-white text-[#03C75A] font-extrabold flex items-center justify-center text-xs tracking-tighter shrink-0">
                  N
                </div>
                <span>네이버 1초 간편 로그인</span>
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-brand-gold-400/15 pt-4 text-xs">
              <button
                onClick={() => setStep('ADMIN_LOGIN')}
                className="cursor-pointer text-brand-gold-400 hover:text-brand-gold-300 flex items-center space-x-1"
                id="toggle-admin-login-btn"
              >
                <Shield className="h-3 w-3" />
                <span>최고관리자 콘솔 접속</span>
              </button>

              <span className="text-[10px] text-brand-gold-100/45 font-mono">
                Powered by Taro for comfort
              </span>
            </div>
          </div>
        )}

        {/* STEP: CONFIRM SOCIAL: simulated 1-second permission gate */}
        {step === 'CONFIRM_SOCIAL' && (
          <form onSubmit={handleSocialSubmit} className="space-y-5">
            <div className="border-b border-brand-gold-400/15 pb-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold-400">
                {selectedProvider === 'KAKAO' ? 'KakaoTalk 간편 가입허가' : 'Naver Quick Onboarding'}
              </span>
              <h3 className="font-serif text-lg font-bold text-brand-gold-100 mt-1">
                전체 동의 및 1초 연동하기
              </h3>
              <p className="text-xs text-brand-gold-100/60 font-sans mt-0.5 leading-relaxed">
                상담 진행 및 실시간 알림톡 발송을 위해 프로필 정보를 확인해 주세요.
              </p>
            </div>

            <div className="space-y-4 font-sans text-xs">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-gold-300 block">이름 *</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-brand-navy-950 text-brand-gold-100 border border-brand-gold-400/20 rounded-lg p-2.5 focus:border-brand-gold-500 focus:outline-none"
                  placeholder="실명 입력"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-gold-300 block">휴대폰 번호 *</label>
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full bg-brand-navy-950 text-brand-gold-100 border border-brand-gold-400/20 rounded-lg p-2.5 focus:border-brand-gold-500 focus:outline-none"
                  placeholder="010-0000-0000"
                  required
                />
                <span className="text-[10px] text-brand-gold-400/60 block leading-tight">
                  ※ 새로운 예약 상태 변경 시 카카오톡이나 문자로 상담 번호가 자동 안내됩니다.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-gold-300 block">이메일 주소</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-brand-navy-950 text-brand-gold-100 border border-brand-gold-400/20 rounded-lg p-2.5 focus:border-brand-gold-500 focus:outline-none"
                  placeholder="your-email@domain.com"
                />
              </div>

              <div className="bg-brand-navy-950/60 p-3 rounded-lg border border-brand-gold-400/10 space-y-2">
                <div className="flex items-start space-x-2">
                  <Check className="h-3.5 w-3.5 text-brand-gold-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-brand-gold-100/75 leading-normal">
                    [필수] Taro for comfort 서비스 이용 및 알림 대행 연계를 동의합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="submit"
                className="cursor-pointer flex-1 rounded-lg bg-brand-gold-500 text-brand-navy-950 font-sans text-xs sm:text-sm font-bold py-2.5 text-center active:scale-97 transition-all"
                id="social-auth-confirm"
              >
                가입 완료 및 서비스 동의
              </button>
              <button
                type="button"
                onClick={() => setStep('SELECT')}
                className="cursor-pointer border border-brand-gold-400/20 bg-brand-navy-950/60 text-brand-gold-300 px-4 py-2.5 rounded-lg text-xs"
              >
                취소
              </button>
            </div>
          </form>
        )}

        {/* STEP: ADMIN LOGIN PANEL */}
        {step === 'ADMIN_LOGIN' && (
          <form onSubmit={handleAdminSubmit} className="space-y-5">
            <div className="border-b border-brand-gold-400/15 pb-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-red-400 flex items-center space-x-1">
                <Shield className="h-3 w-3 text-red-500 shrink-0" />
                <span>Security Vault</span>
              </span>
              <h3 className="font-serif text-lg font-bold text-brand-gold-100 mt-1">
                최고관리자 전용 콘솔 접속
              </h3>
              <p className="text-xs text-brand-gold-100/60 font-sans mt-0.5">
                예약 내역 변경 승인 알람 발송을 위한 계정 패스워드를 입력하세요.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-gold-300 block">관리자 암호 *</label>
                <input
                  type="password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full bg-brand-navy-950 text-brand-gold-100 border border-brand-gold-400/20 rounded-lg p-2.5 focus:border-brand-gold-500 focus:outline-none text-xs sm:text-sm"
                  placeholder="비밀번호(테스트용: admin123 또는 admin)"
                  required
                />
              </div>

              {adminError && (
                <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-950/20 p-3 text-xs text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{adminError}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="submit"
                className="cursor-pointer flex-1 rounded-lg bg-red-900/80 hover:bg-red-800 text-white font-sans text-xs sm:text-sm font-bold py-2.5 text-center transition-colors"
                id="admin-auth-confirm"
              >
                보안 키 전송
              </button>
              <button
                type="button"
                onClick={() => setStep('SELECT')}
                className="cursor-pointer border border-brand-gold-400/20 bg-brand-navy-950/60 text-brand-gold-300 px-4 py-2.5 rounded-lg text-xs"
              >
                뒤로가기
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
