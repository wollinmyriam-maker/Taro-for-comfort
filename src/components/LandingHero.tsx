import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ConsultationType } from '../types.ts';
import { Star, Heart, Coins, Sparkles, MessageSquare, ShieldCheck, ArrowRight, Compass, MapPin, Phone, Clock, ExternalLink, Copy, Check, Navigation, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingHeroProps {
  setCurrentTab: (tab: string) => void;
  openAuth: () => void;
}

const TAROT_DECKS = [
  {
    id: 'fool',
    name_kr: '0. 광대 (THE FOOL)',
    symbol: '🧭',
    meaning: '순수한 시작, 무한한 가능성, 자유',
    comfortText: '지금 당신 앞에 펼쳐진 안개는 두려움이 아닌 설렘의 시작입니다. 계산되지 않은 투명한 한 걸음이 때로는 가장 안전한 돌파구가 됩니다. 마음을 비우고 당신의 첫 발걸음을 믿으세요.',
    colorTheme: 'from-blue-500/10 to-emerald-500/10 hover:border-emerald-400',
    accentColor: 'text-emerald-400',
  },
  {
    id: 'magician',
    name_kr: 'I. 마술사 (THE MAGICIAN)',
    symbol: '✨',
    meaning: '탁월한 재능, 준비 완료, 창조적 능력',
    comfortText: '당신의 상자 안에는 이미 문제를 매끄럽게 풀 수 있는 모든 도구와 재능이 갖춰져 있습니다. 망설임은 접어두고 당신의 말과 매력, 창의성을 세상에 당당하게 보여줄 타이밍입니다.',
    colorTheme: 'from-amber-500/10 to-red-500/10 hover:border-red-400',
    accentColor: 'text-red-400',
  },
  {
    id: 'priestess',
    name_kr: 'II. 여사제 (THE HIGH PRIESTESS)',
    symbol: '🌙',
    meaning: '직관과 지혜, 고요한 성찰, 비밀',
    comfortText: '소란스러운 세상 속에서 잠시 침묵해 보세요. 겉으로 드러나는 행동 너머 상대방의 깊은 진실을 당신의 마음속 직관은 이미 명확히 읽어내고 있습니다. 깊은 수면 아래의 직관을 경청해 보세요.',
    colorTheme: 'from-purple-500/10 to-indigo-500/10 hover:border-indigo-400',
    accentColor: 'text-indigo-400',
  },
  {
    id: 'empress',
    name_kr: 'III. 여황제 (THE EMPRESS)',
    symbol: '👑',
    meaning: '풍요와 번영, 모성애, 결실',
    comfortText: '겨울이 지나고 기름진 봄날의 대지가 찾아오듯, 당신의 헌신과 노력이 영양분을 만나 눈부신 결실을 맺기 시작합니다. 물질적으로도, 감정적으로도 아낌없이 베풀고 즐겨도 좋은 흐름입니다.',
    colorTheme: 'from-amber-400/10 to-pink-500/10 hover:border-pink-400',
    accentColor: 'text-pink-400',
  },
  {
    id: 'emperor',
    name_kr: 'IV. 황제 (THE EMPEROR)',
    symbol: '🏛️',
    meaning: '강인한 리더십, 흔들림 없는 질서, 견고한 지위',
    comfortText: '책임질 것이 많아 외롭지만, 지금 당신은 그 전장을 지켜낼 완벽한 통제력과 현실적 설득 능력을 가지고 있습니다. 감정적인 동요를 거두고 질서정연하게 원칙을 지키면 견고히 정상에 서게 됩니다.',
    colorTheme: 'from-red-600/10 to-slate-500/10 hover:border-slate-400',
    accentColor: 'text-slate-300',
  },
  {
    id: 'hierophant',
    name_kr: 'V. 교황 (THE HIEROPHANT)',
    symbol: '🙏',
    meaning: '자비로운 조언, 신뢰할 만한 중재, 정신적 동반자',
    comfortText: '가치관의 대립으로 숨이 막힐 때는 지혜로운 멘토의 조언에 귀 기울이거나, 내가 먼저 상대에게 자비를 아끼지 않는 중재자가 되어주세요. 신의와 도덕적 중심이 있다면 평화가 돌아옵니다.',
    colorTheme: 'from-yellow-600/10 to-amber-700/10 hover:border-amber-500',
    accentColor: 'text-amber-500',
  },
  {
    id: 'lovers',
    name_kr: 'VI. 연인 (THE LOVERS)',
    symbol: '❤️',
    meaning: '아름다운 결합, 설레는 조화, 올바른 선택',
    comfortText: '당신의 상징과 상대방의 마음 정서가 뜨겁게 이어지는 기적 같은 관계의 조율이 일어납니다. 오직 진심 어린 감정적 교감을 믿을 때, 이끌림은 가장 완전한 선택으로 안내해 줄 것입니다.',
    colorTheme: 'from-pink-500/10 to-rose-600/10 hover:border-rose-400',
    accentColor: 'text-rose-400',
  },
  {
    id: 'chariot',
    name_kr: 'VII. 전차 (THE CHARIOT)',
    symbol: '⚔️',
    meaning: '거침없는 돌파, 강한 기세, 목표 장악',
    comfortText: '고민하며 머뭇거릴 시간은 끝났습니다. 강한 의지와 내적 통제력을 조율하여 주도권을 잡고 돌파해야 합니다. 승리는 이미 당신 방향으로 움직이고 있으니 추진력을 최고조로 높이세요.',
    colorTheme: 'from-sky-500/10 to-blue-700/10 hover:border-sky-400',
    accentColor: 'text-sky-400',
  },
  {
    id: 'strength',
    name_kr: 'VIII. 힘 (STRENGTH)',
    symbol: '🦁',
    meaning: '내면의 용기, 위대한 치유, 부드러운 힘',
    comfortText: '맹수를 길들이는 힘은 거친 쇠사슬이 아닌 부드러운 교감과 지혜로운 인내입니다. 감정을 억누르는 대신 마음속 불안과 외로움을 토닥여 주면, 그 무엇보다 단단한 마음의 통제력이 차오릅니다.',
    colorTheme: 'from-amber-600/10 to-orange-500/10 hover:border-orange-400',
    accentColor: 'text-orange-400',
  },
  {
    id: 'hermit',
    name_kr: 'IX. 은둔자 (THE HERMIT)',
    symbol: '🏮',
    meaning: '깊은 자아 성찰, 고독의 지혜, 등불',
    comfortText: '바깥세상의 떠들썩한 조명에서 한 걸음 물러나 스스로를 돌아볼 귀중한 기수입니다. 등불 하나만을 의지한 외로운 탐구 같지만, 그 끝에 도달하는 당신 속마음의 지혜는 어두운 현실을 비추는 영혼의 등불이 될 것입니다.',
    colorTheme: 'from-[#0d1e3d]/40 to-indigo-950/20 hover:border-indigo-400/80',
    accentColor: 'text-indigo-400',
  },
  {
    id: 'wheel',
    name_kr: 'X. 운명의 수레바퀴 (WHEEL OF FORTUNE)',
    symbol: '🎡',
    meaning: '완벽한 타이밍, 필연적 변화, 새로운 전환점',
    comfortText: '삶의 수레바퀴가 드디어 당신 쪽으로 행운의 각도를 꺾기 시작했습니다. 피할 수 없는 긍정적인 파도이므로 머뭇거리지 말고 다가오는 기회와 사람의 파도에 온몸을 내맡겨 기회를 쟁취하세요.',
    colorTheme: 'from-teal-600/10 to-amber-500/10 hover:border-teal-400',
    accentColor: 'text-teal-400',
  },
  {
    id: 'justice',
    name_kr: 'XI. 정의 (JUSTICE)',
    symbol: '⚖️',
    meaning: '명확한 균형, 냉철한 판단, 인과관계',
    comfortText: '감정 과잉에서 완전히 벗어나 차가운 이성으로 양팔 저울 위에 조건을 올려놓을 지체입니다. 정밀한 저울질과 뿌린 대로 거둔다는 인과율을 믿으세요. 올바르고 선을 명확히 그은 선택만이 최종적 안식을 보장합니다.',
    colorTheme: 'from-emerald-600/10 to-cyan-500/10 hover:border-cyan-400',
    accentColor: 'text-cyan-400',
  }
];

export const LandingHero: React.FC<LandingHeroProps> = ({ setCurrentTab, openAuth }) => {
  const { currentUser, reviews } = useApp();
  const [selectedReviewCategory, setSelectedReviewCategory] = useState<'ALL' | ConsultationType>('ALL');
  const [activeCardReveal, setActiveCardReveal] = useState<'ROMANCE' | 'WEALTH' | null>(null);
  const [copiedKakao, setCopiedKakao] = useState(false);
  const [copiedInsta, setCopiedInsta] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [businessCardFlipped, setBusinessCardFlipped] = useState(false);
  const [mapZoom, setMapZoom] = useState<number>(2); // 1, 2, 3 range
  const [selectedTarot, setSelectedTarot] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const handleCopyText = (text: string, type: 'KAKAOTALK' | 'INSTAGRAM' | 'ADDRESS' | 'PHONE' | 'ACCOUNT') => {
    navigator.clipboard.writeText(text);
    if (type === 'KAKAOTALK') {
      setCopiedKakao(true);
      setTimeout(() => setCopiedKakao(false), 2000);
    } else if (type === 'INSTAGRAM') {
      setCopiedInsta(true);
      setTimeout(() => setCopiedInsta(false), 2000);
    } else if (type === 'PHONE') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else if (type === 'ACCOUNT') {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const filteredReviews = reviews.filter((rev) => {
    if (selectedReviewCategory === 'ALL') return true;
    return rev.type === selectedReviewCategory;
  });

  const averageRating = 5.0;

  return (
    <div className="relative overflow-hidden pt-4 pb-20">
      
      {/* Background Decorative Rings/Glow */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-gold-500/5 blur-3xl ambient-glow"></div>
      <div className="absolute top-[60%] right-[-10%] -z-10 h-[400px] w-[400px] rounded-full bg-brand-navy-700/10 blur-3xl"></div>
      
      {/* Subtle Star Particles */}
      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
        <div className="glimmer-star absolute top-12 left-1/4 h-1 w-1 rounded-full bg-white"></div>
        <div className="glimmer-star absolute top-36 right-16 h-1 w-1 rounded-full bg-brand-gold-300"></div>
        <div className="glimmer-star absolute top-96 left-8 h-1 w-1 rounded-full bg-white"></div>
        <div className="glimmer-star absolute top-72 right-1/3 h-1.5 w-1.5 rounded-full bg-brand-gold-400"></div>
        <div className="glimmer-star absolute bottom-24 left-1/3 h-1 w-1 rounded-full bg-brand-gold-300"></div>
        <div className="glimmer-star absolute bottom-40 right-10 h-1 w-1 rounded-full bg-white"></div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        
        {/* HERO HEADER COPY */}
        <div className="text-center pt-10 pb-16 max-w-3xl mx-auto">
          <div className="inline-block text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase mb-6 border-l-2 border-[#D4AF37] pl-4">
            Your Life Navigator
          </div>
          
          <h2 className="font-serif text-4xl sm:text-5xl leading-tight text-brand-gold-100 mb-6">
            답답했던 마음에 건네는<br />
            <span className="italic text-brand-gold-400 font-serif">가장 명확한 이정표.</span>
          </h2>
          
          <p className="mt-6 text-base sm:text-lg text-brand-gold-200 leading-relaxed font-sans max-w-2xl mx-auto">
            흔들리는 연애도, 막막한 재물의 흐름도 결국 타이밍입니다.<br />
            <span className="text-brand-gold-300 font-medium font-serif">Taro for comfort</span>에서 당신의 완벽한 타이밍을 찾아보세요.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => {
                if (!currentUser) {
                  openAuth();
                } else {
                  setCurrentTab('booking');
                }
              }}
              className="cursor-pointer w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-lg bg-brand-gold-500 text-white px-6 py-3.5 font-sans text-sm font-bold tracking-[0.2em] uppercase hover:bg-brand-gold-600 transition-colors shadow-lg shadow-brand-gold-500/20"
              id="hero-book-btn"
            >
              <span>Book Appointment</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            
            <a
              href="#the-star-concept"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-lg border border-brand-gold-400/30 bg-brand-navy-900 text-brand-gold-100 hover:bg-brand-navy-800 hover:text-brand-gold-500 px-6 py-3.5 font-sans text-sm font-semibold tracking-widest transition-all uppercase"
            >
              <span>Consulting Services</span>
            </a>
          </div>
        </div>

        {/* SPECIALIZED VALUE SECTION ("THE STAR" CONCEPT CARD VISUAL AND SPECIALIZED COPY) */}
        <div id="the-star-concept" className="my-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-b border-brand-gold-400/10 py-16">
          
          {/* LEFT: Elegant Tarot Visual representation of THE STAR (Inspired by upload) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-64 sm:w-72 aspect-[1/1.7] rounded-2xl border-2 border-brand-gold-500/50 bg-brand-navy-900 p-3 shadow-2xl shadow-brand-gold-500/10 hover:shadow-brand-gold-500/20 transition-all duration-500 hover:scale-[1.01] group">
              <div className="absolute inset-0 rounded-[14px] border border-brand-gold-400/20 m-1 pointer-events-none"></div>
              
              {/* Card Inner Border Decoration */}
              <div className="h-full w-full rounded-lg border-2 border-brand-gold-400/40 p-3 flex flex-col justify-between items-center bg-brand-navy-950 relative overflow-hidden">
                
                {/* Celestial Top Frame */}
                <div className="w-full flex justify-between items-center text-xs text-brand-gold-400/60 font-serif">
                  <span>XVII</span>
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-500/40"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-500/80"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-500/40"></span>
                  </div>
                  <span>THE STAR</span>
                </div>

                {/* Main Engraving Mock */}
                <div className="my-4 flex-1 flex flex-col items-center justify-center relative w-full">
                  <div className="absolute ambient-glow h-24 w-24 rounded-full bg-brand-gold-500/10 -z-10"></div>
                  
                  {/* Elegant Golden Star Grid representing the uploaded image star */}
                  <div className="relative h-28 w-28 flex items-center justify-center mb-6">
                    <Sparkles className="h-16 w-16 text-brand-gold-300 animate-pulse" />
                    <Compass className="absolute h-24 w-24 text-brand-gold-500/30 animate-spin" style={{ animationDuration: '40s' }} />
                    <div className="absolute top-0 right-2 w-1.5 h-1.5 rounded-full bg-white/80"></div>
                    <div className="absolute bottom-1 left-2 w-1 h-1 rounded-full bg-white/60"></div>
                  </div>

                  <p className="text-[11px] font-serif text-brand-gold-400 tracking-widest text-center max-w-[180px]">
                    "보이지 않는 무의식의 지도를 그리고, 안전한 포구를 안내합니다."
                  </p>
                </div>

                {/* Card Footer Banner */}
                <div className="w-full text-center border-t border-brand-gold-400/20 pt-2 pb-0.5">
                  <span className="font-serif text-xs tracking-[0.25em] text-brand-gold-400 font-bold">
                    Taro for comfort
                  </span>
                </div>
              </div>

              {/* Decorative side leaves effect */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 text-[10px] text-brand-gold-500/30 font-serif origin-center -rotate-90">
                ★ TARO FOR COMFORT GUIDES THE WAY ★
              </div>
            </div>
          </div>

          {/* RIGHT: Detailed Copy and Value Propositions (Romance & Wealth focus) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-brand-gold-300">
                우리가 집중하는 두 개의 거대한 삶의 축
              </h3>
              <p className="text-sm text-brand-gold-100/70 leading-relaxed font-sans">
                인생의 수많은 방황 중 가장 깊은 고민이 찾아오는 순간은 언제나 동일합니다. 
                누군가의 속마음을 애태울 때와 막막한 현실의 재무적 기로에 설 때. 
                Taro for comfort는 오직 이 두 분야에만 초점을 맞췄습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* ❶ Romance Section */}
              <div 
                className="relative overflow-hidden rounded-xl border border-brand-gold-400/20 bg-brand-navy-900 p-6 hover:border-brand-gold-400/60 transition-all duration-300 group shadow-sm"
              >
                <div className="absolute top-0 right-0 h-16 w-16 -mr-4 -mt-4 rounded-full bg-rose-500/5 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-[1px] bg-brand-gold-400"></div>
                  <span className="text-xs tracking-[0.2em] font-serif uppercase text-brand-gold-400 font-bold">ROMANCE</span>
                </div>

                <h3 className="font-serif text-xl font-medium text-brand-gold-100 mb-2">
                  연애 상담 전문
                </h3>
                
                <p className="text-sm text-brand-gold-200 leading-relaxed font-sans mb-4">
                  그 사람의 진짜 속마음이 궁금할 때. 보이지 않는 마음의 지도를 짚어드립니다.
                </p>
                <div className="mt-4 border-t border-brand-gold-400/10 pt-3 text-[11px] text-brand-gold-200/60 font-sans flex items-center justify-between">
                  <span className="font-medium">셀링 포인트</span>
                  <span className="bg-rose-100 border border-rose-200/45 px-2.5 py-0.5 rounded text-rose-700 text-[10px] font-bold">상대 심리 & 소통 타이밍</span>
                </div>
              </div>

              {/* ❷ Wealth Section */}
              <div 
                className="relative overflow-hidden rounded-xl border border-brand-gold-400/20 bg-brand-navy-900 p-6 hover:border-brand-gold-400/60 transition-all duration-300 group shadow-sm"
              >
                <div className="absolute top-0 right-0 h-16 w-16 -mr-4 -mt-4 rounded-full bg-amber-500/5 group-hover:scale-150 transition-transform duration-500"></div>
                
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-[1px] bg-brand-gold-400"></div>
                  <span className="text-xs tracking-[0.2em] font-serif uppercase text-brand-gold-400 font-bold">WEALTH</span>
                </div>

                <h3 className="font-serif text-xl font-medium text-brand-gold-100 mb-2">
                  재물 상담 전문
                </h3>

                <p className="text-sm text-brand-gold-200 leading-relaxed font-sans mb-4">
                  재물의 흐름, 언제쯤 기회가 올까요? 안전하고 확실한 도약의 시기를 찾아냅니다.
                </p>
                <div className="mt-4 border-t border-brand-gold-400/10 pt-3 text-[11px] text-brand-gold-200/60 font-sans flex items-center justify-between">
                  <span className="font-medium">셀링 포인트</span>
                  <span className="bg-amber-100 border border-amber-200/45 px-2.5 py-0.5 rounded text-amber-800 text-[10px] font-bold">경영/도약 & 리스크 회피</span>
                </div>
              </div>

            </div>

            <div className="flex items-center space-x-3 bg-brand-gold-500/5 border border-brand-gold-400/10 rounded-lg p-4">
              <ShieldCheck className="h-5 w-5 text-brand-gold-400 shrink-0" />
              <p className="text-xs text-brand-gold-100/80 leading-relaxed font-sans">
                <strong>막연한 대박 유도가 아닙니다.</strong> 상대를 헤아리는 가이드라인과 
                구체적인 자산 행동 리스크를 방어하는 <strong>실전형 흐름 리딩</strong>을 지향합니다.
              </p>
            </div>
          </div>

        </div>

        {/* CUSTOM ENHANCED ELEMENT: TAROT REVEAL CARD ANIMATION (Fun visual engaging mock tarot cards) */}
        <div className="my-20 text-center">
          <div className="mb-4 text-center">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-brand-gold-400">
              Pick Your Primary Path (상담 영역)
            </h3>
            <p className="text-xs text-brand-gold-100/60 font-sans mt-1">
              마음이 기우는 고민을 탭하시면 상담에 관한 지침을 읽어보실 수 있습니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-8">
            
            {/* Romance card click trigger */}
            <button
              onClick={() => setActiveCardReveal(activeCardReveal === 'ROMANCE' ? null : 'ROMANCE')}
              className={`cursor-pointer group relative w-48 aspect-[1/1.6] rounded-xl border border-brand-gold-400/30 p-2 overflow-hidden transition-all duration-300 shadow-sm ${
                activeCardReveal === 'ROMANCE' ? 'bg-brand-navy-900 ring-2 ring-brand-gold-400 scale-[1.03]' : 'bg-brand-navy-900/60 hover:bg-brand-navy-900'
              }`}
            >
              <div className="h-full border border-dashed border-brand-gold-400/20 rounded-lg p-3 flex flex-col justify-between items-center bg-brand-navy-950">
                <Heart className={`h-8 w-8 transition-transform duration-500 ${activeCardReveal === 'ROMANCE' ? 'text-rose-500 scale-125' : 'text-brand-gold-400 group-hover:scale-110'}`} />
                <span className="font-serif text-sm font-semibold tracking-wider text-brand-gold-100">
                  THE LOVERS
                </span>
                <span className="text-[10px] text-brand-gold-400 font-sans uppercase font-bold">
                  {activeCardReveal === 'ROMANCE' ? '닫기' : '조언 분석 열기'}
                </span>
              </div>
            </button>

            {/* Wealth card click trigger */}
            <button
              onClick={() => setActiveCardReveal(activeCardReveal === 'WEALTH' ? null : 'WEALTH')}
              className={`cursor-pointer group relative w-48 aspect-[1/1.6] rounded-xl border border-brand-gold-400/30 p-2 overflow-hidden transition-all duration-300 shadow-sm ${
                activeCardReveal === 'WEALTH' ? 'bg-brand-navy-900 ring-2 ring-brand-gold-400 scale-[1.03]' : 'bg-brand-navy-900/60 hover:bg-brand-navy-900'
              }`}
            >
              <div className="h-full border border-dashed border-brand-gold-400/20 rounded-lg p-3 flex flex-col justify-between items-center bg-brand-navy-950">
                <Coins className={`h-8 w-8 transition-transform duration-500 ${activeCardReveal === 'WEALTH' ? 'text-amber-500 scale-125' : 'text-brand-gold-400 group-hover:scale-110'}`} />
                <span className="font-serif text-sm font-semibold tracking-wider text-brand-gold-100">
                  WHEEL OF FORTUNE
                </span>
                <span className="text-[10px] text-brand-gold-400 font-sans uppercase font-bold">
                  {activeCardReveal === 'WEALTH' ? '닫기' : '조언 분석 열기'}
                </span>
              </div>
            </button>

          </div>

          <AnimatePresence mode="wait">
            {activeCardReveal && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="mt-8 max-w-xl mx-auto rounded-xl border border-brand-gold-400/20 bg-brand-navy-900 p-5 text-left text-sm shadow-md"
              >
                {activeCardReveal === 'ROMANCE' ? (
                  <div>
                    <h5 className="font-serif font-bold text-base text-rose-700 flex items-center space-x-2">
                      <Heart className="h-4.5 w-4.5" />
                      <span>The Romance Card 가이드 지침</span>
                    </h5>
                    <p className="mt-3 text-xs sm:text-sm text-brand-gold-200 leading-relaxed font-sans">
                      어긋난 타이밍 속에서 헤매지 마세요. 우리는 타로를 통해 연인이나 정해진 사람의 속마음 에너지 카드(감정과 미련 무의식)를 수치화하고, 언제 말을 건네며 언제 한 걸음 물러나 기다려야 하는지 명쾌한 타임라인 행동 가이드를 드립니다.
                    </p>
                  </div>
                ) : (
                  <div>
                    <h5 className="font-serif font-bold text-base text-amber-700 flex items-center space-x-2">
                      <Coins className="h-4.5 w-4.5" />
                      <span>The Wealth Card 가이드 지침</span>
                    </h5>
                    <p className="mt-3 text-xs sm:text-sm text-brand-gold-200 leading-relaxed font-sans">
                      대세 상승이나 하락의 흐름을 보지 못한 채 섣부른 한 걸음으로 낭패를 보기 쉽습니다. 사주의 용신과 타로의 카드를 융합하여 당신의 자금이 모이는 흐름, 계약 취득운, 사업의 리스크를 방어할 수 있는 실무적 대비법을 드립니다.
                    </p>
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      if (!currentUser) {
                        openAuth();
                      } else {
                        setCurrentTab('booking');
                      }
                    }}
                    className="cursor-pointer text-xs font-semibold text-brand-gold-400 flex items-center space-x-1 hover:text-brand-gold-300"
                  >
                    <span>이 분야 예약하기</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* INTERACTIVE 3D TAROT BOARD (1:1 with User Request) */}
        <div className="my-24 border-t border-b border-brand-gold-400/10 py-16 space-y-10 relative overflow-hidden">
          {/* Subtle star particles background */}
          <div className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-brand-gold-500/5 blur-3xl -z-10 animate-pulse"></div>
          
          <div className="text-center space-y-2">
            <span className="text-xs text-brand-gold-400 font-bold tracking-[0.3em] uppercase block">
              12 Cards of Comfort Board
            </span>
            <h3 className="font-serif text-3xl font-bold tracking-tight text-brand-gold-100">
              Taro for comfort 3D 인터랙티브 타로 보드
            </h3>
            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-brand-gold-200/80 font-sans leading-relaxed">
              제시해주신 클래식 타로 카드 12장을 센스있는 3D 카드로 재탄생시켰습니다.<br />
              마음을 고요히 정돈하고, <strong>아래 카드 중 끌리는 장들을 탭하여</strong> 3D 플립과 함께 치유의 메시지를 열어보세요.
            </p>
          </div>

          {/* Controls to reset or reveal all */}
          <div className="flex justify-center space-x-4 py-2">
            <button
              onClick={() => {
                setSelectedTarot(null);
                // Flip all cards by setting them to a fully flipped state
                const cardElements = document.querySelectorAll('.tarot-card-inner');
                cardElements.forEach(el => el.classList.add('rotate-y-180'));
              }}
              className="cursor-pointer border border-brand-gold-400/40 bg-brand-gold-500/10 text-brand-gold-100 text-xs px-4 py-2 rounded-lg font-sans flex items-center space-x-1.5 hover:bg-brand-gold-500/20 transition-all font-semibold"
            >
              <span>✨ 전체 카드 공개 (Flip All Front)</span>
            </button>
            <button
              onClick={() => {
                setSelectedTarot(null);
                const cardElements = document.querySelectorAll('.tarot-card-inner');
                cardElements.forEach(el => el.classList.remove('rotate-y-180'));
              }}
              className="cursor-pointer border border-brand-gold-400/30 bg-brand-navy-900 text-brand-gold-100 text-xs px-4 py-2 rounded-lg font-sans flex items-center space-x-1.5 hover:bg-brand-navy-800 transition-all font-semibold"
            >
              <span>🎒 전체 카드 뒤집기 (Reset All Backs)</span>
            </button>
          </div>

          {/* The 3D Grid of 12 Tarot Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-7xl mx-auto px-4 sm:px-6">
            {TAROT_DECKS.map((card, idx) => {
              return (
                <div 
                  key={card.id}
                  className="group perspective-1000 aspect-[1/1.65] w-full relative"
                  id={`tarot-container-${card.id}`}
                >
                  <div 
                    onClick={(e) => {
                      const inner = e.currentTarget;
                      inner.classList.toggle('rotate-y-180');
                      if (inner.classList.contains('rotate-y-180')) {
                        setSelectedTarot(idx);
                        setIsFlipped(true);
                      } else {
                        if (selectedTarot === idx) {
                          setSelectedTarot(null);
                        }
                      }
                    }}
                    className="tarot-card-inner w-full h-full duration-700 preserve-3d relative transition-all rounded-2xl cursor-pointer hover:shadow-2xl hover:shadow-brand-gold-500/15"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* BACK OF THE TAROT CARD - Golden border, elegant starry background */}
                    <div className="absolute inset-0 w-full h-full bg-[#1A4235] rounded-2xl border-2 border-brand-gold-400 p-2.5 backface-hidden shadow-lg flex flex-col justify-between items-center z-10">
                      <div className="w-full h-full rounded-xl border border-dashed border-brand-gold-300/30 p-2 bg-[#0E291F] flex flex-col justify-between items-center text-center">
                        <span className="text-[8px] text-brand-gold-300 tracking-[0.25em] font-serif uppercase block font-bold">
                          COMFORT
                        </span>
                        
                        {/* Golden geometric/mystic eye core logo */}
                        <div className="relative flex items-center justify-center my-2 group-hover:scale-110 transition-transform duration-550">
                          <div className="absolute h-10 w-10 rounded-full border border-dashed border-brand-gold-300/20 animate-spin" style={{ animationDuration: '25s' }}></div>
                          <Sparkles className="h-6 w-6 text-brand-gold-400 opacity-90 animate-pulse" />
                        </div>

                        <div className="space-y-0.5">
                          <span className="text-[12px] text-brand-gold-300 font-serif font-extrabold">{card.name_kr.split(' ')[0]}</span>
                          <span className="text-[8px] text-brand-gold-300/60 font-sans block leading-none font-bold">CLICK TO REVEAL</span>
                        </div>
                      </div>
                    </div>

                    {/* FRONT OF THE TAROT CARD */}
                    <div className="absolute inset-0 w-full h-full bg-[#12352B] rounded-2xl border-2 border-brand-gold-400 p-2.5 backface-hidden rotate-y-180 shadow-2xl flex flex-col justify-between items-center">
                      <div className="w-full h-full rounded-xl border border-dashed border-brand-gold-300/40 p-2.5 bg-[#0A221B] flex flex-col justify-between items-center text-center">
                        
                        {/* Number Indicator */}
                        <span className="text-[7px] text-brand-gold-400 tracking-[0.25em] font-serif uppercase block font-bold leading-none">
                          {card.name_kr.split(' ')[0]}
                        </span>

                        {/* Interactive Symbol/Badge */}
                        <div className="my-1.5 flex flex-col items-center">
                          <span className="text-3xl filter drop-shadow-[0_2px_4px_rgba(196,155,69,0.3)] block animate-bounce" style={{ animationDuration: '4s' }}>
                            {card.symbol}
                          </span>
                          <h4 className="text-[11px] font-extrabold text-white tracking-widest mt-1 text-center whitespace-nowrap">
                            {card.name_kr.split(' ').slice(1).join(' ')}
                          </h4>
                          <span className="text-[7.5px] bg-brand-gold-400/20 text-brand-gold-300 border border-brand-gold-400/30 px-1.5 py-0.5 rounded mt-1 font-sans text-center leading-none font-bold">
                            {card.meaning}
                          </span>
                        </div>

                        <div className="w-full border-t border-brand-gold-400/15 pt-1 text-[7px] text-brand-gold-300/40 tracking-[0.2em] font-serif uppercase">
                          comfort guide
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTIVE SELECT DETAIL READOUT DISPLAY PANEL */}
          <AnimatePresence>
            {selectedTarot !== null && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="mt-8 max-w-2xl mx-auto rounded-2xl border-2 border-brand-gold-400 bg-brand-navy-900 p-6 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 h-32 w-32 bg-brand-gold-500/5 rounded-full blur-2xl"></div>
                <div className="absolute inset-1 rounded-[14px] border border-dashed border-brand-gold-400/20 pointer-events-none"></div>

                <div className="relative space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-brand-gold-400/25">
                    <div className="flex items-center space-x-2.5">
                      <span className="text-2xl filter drop-shadow-md">{TAROT_DECKS[selectedTarot].symbol}</span>
                      <div>
                        <h4 className="font-serif text-lg font-bold text-brand-gold-100">
                          {TAROT_DECKS[selectedTarot].name_kr}
                        </h4>
                        <p className="text-[11px] text-brand-gold-200 font-mono mt-0.5 font-semibold">
                          키워드: {TAROT_DECKS[selectedTarot].meaning}
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-[#006241] bg-brand-gold-500/10 border border-[#006241]/20 px-2.5 py-1 rounded font-bold">
                      ACTIVE READING
                    </span>
                  </div>

                  <div className="space-y-3 pt-1">
                    <p className="text-xs sm:text-xs text-[#006241] font-extrabold uppercase tracking-widest block font-sans">
                      대표 가운슬러 석세은의 힐링 지침서
                    </p>
                    <p className="text-xs sm:text-sm text-brand-gold-100 font-sans leading-relaxed italic bg-brand-navy-950 p-4 rounded-xl border border-brand-gold-400/10 text-center font-medium">
                      "{TAROT_DECKS[selectedTarot].comfortText}"
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-xs">
                    <span className="text-[10px] text-brand-gold-200">
                      ※ 이 카드는 제시해주신 12종의 실제 정식 라이더-웨이트 덱을 담고 있습니다.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (!currentUser) {
                          openAuth();
                        } else {
                          setCurrentTab('booking');
                        }
                      }}
                      className="cursor-pointer bg-brand-gold-500 hover:bg-brand-gold-600 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-brand-gold-500/10 active:scale-97 transition-all leading-tight text-center"
                    >
                      실시간 1:1 심층 매칭 예약하러 가기
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* NEW SECTION: DETAILED PROGRAM PRICING & OFFLINE STUDIO MAP (Faithful to provided images) */}
        <div className="my-24 border-t border-b border-brand-gold-400/10 py-16 space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs text-brand-gold-400 font-bold tracking-[0.3em] uppercase block">
              TARO MASTER SSE & STUDIO DIRECTION
            </span>
            <h3 className="font-serif text-3xl font-bold tracking-tight text-brand-gold-100">
              검증된 타로 마스터와 함께하는 힐링 스페이스
            </h3>
            <p className="max-w-xl mx-auto text-xs sm:text-sm text-brand-gold-200/80 font-sans leading-relaxed">
              대표 카운슬러 석세은의 공인 요금 프로그램 및 울산 성남동 오프라인 샵 정보를 확인해 보세요.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            
            {/* LEFT SIDE: DUAL INTERACTIVE SMART BUSINESS CARD & PRICING TABLE (Fidelity to Image 1 & 2) */}
            <div className="flex flex-col space-y-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-brand-gold-400" />
                <h4 className="font-serif text-lg font-bold text-brand-gold-300">
                  타로마스터 석세은 정식 실물 스마트 명함 (3D Flip)
                </h4>
              </div>

              {/* TACTILE 3D SMART BUSINESS CARD WRAPPER */}
              <div className="flex justify-center py-4 bg-brand-navy-950/40 rounded-2xl border border-brand-gold-400/10 p-4 shadow-inner relative overflow-hidden group">
                {/* Micro instructions */}
                <span className="absolute top-2 right-3 text-[10px] text-brand-gold-400/60 font-sans flex items-center space-x-1 select-none group-hover:text-brand-gold-400 transition-colors animate-pulse">
                  <span>명함을 클릭하여 앞뒤를 돌려보세요 🔄</span>
                </span>

                <div 
                  className="relative w-full max-w-[310px] sm:max-w-[320px] aspect-[1/1.65] bg-transparent rounded-2xl cursor-pointer" 
                  onClick={() => setBusinessCardFlipped(!businessCardFlipped)}
                  style={{ perspective: '1000px' }}
                  id="tactile-smart-card"
                >
                  {/* card inner */}
                  <div 
                    className={`relative w-full h-full duration-700 transition-transform preserve-3d`} 
                    style={{ 
                      transformStyle: 'preserve-3d',
                      transform: businessCardFlipped ? 'rotateY(180deg)' : 'none'
                    }}
                  >
                    
                    {/* CARD FRONT SIDE (High Fidelity Representation of Image 1) */}
                    <div className="absolute inset-0 w-full h-full rounded-2xl backface-hidden flex flex-col justify-between p-5 sm:p-6 bg-[#FAF9F5] border-2 border-[#D4AF37]/50 text-gray-800 shadow-xl overflow-hidden selection:bg-brand-gold-300/30">
                      {/* Subtle high-tech gradient surface texture */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FCFAF2] via-[#FDFCF7] to-[#EDEDE2] opacity-90 pointer-events-none -z-10"></div>

                      {/* Header Block: Title & Name */}
                      <div className="text-center pt-1.5">
                        <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#C49B45] uppercase">
                          TAROT MASTER
                        </span>
                        <h2 className="font-serif text-2xl sm:text-[25px] font-extrabold tracking-[0.2em] text-gray-800 mt-1 pl-1">
                          석 세 은
                        </h2>
                        <div className="mt-2 text-[10px] sm:text-[11px] font-sans font-semibold text-gray-500 flex items-center justify-center space-x-1.5 grayscale opacity-80">
                          <span>방문상담</span>
                          <span className="text-[#C49B45]/50">•</span>
                          <span>전화상담</span>
                          <span className="text-[#C49B45]/50">•</span>
                          <span>카톡상담</span>
                        </div>
                      </div>

                      {/* Contact Numbers and Badges block */}
                      <div className="space-y-3 font-sans text-center">
                        {/* Main phone: copyable, clickable */}
                        <div className="inline-block">
                          <a 
                            href="tel:010-4827-3796"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyText('010-4827-3796', 'PHONE');
                            }} 
                            className="text-lg sm:text-[20px] font-bold font-mono tracking-wide text-gray-950 bg-gray-100/80 hover:bg-gray-200/80 border border-gray-200 hover:text-[#006241] px-4 py-1.5 rounded-xl transition-all cursor-pointer block relative"
                            title="예약 및 상담 직통 전화번호 (클릭시 복사/통화연결)"
                          >
                            <span>010.4827.3796</span>
                            {copiedPhone && (
                              <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#006241] text-white text-[9px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap font-bold">
                                전화번호 복사 완료!
                              </span>
                            )}
                          </a>
                        </div>

                        {/* Social connections: Kakao ID copyable */}
                        <div className="flex justify-center items-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyText('seeun4001', 'KAKAOTALK');
                            }}
                            className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1 bg-[#FEE500] hover:bg-[#EED000] text-[#191919] font-semibold text-[11px] rounded-lg shadow-sm transition-all relative"
                          >
                            <span className="text-[10px] shrink-0">💬</span>
                            <span className="font-extrabold tracking-tight">kakao | seeun4001</span>
                            {copiedKakao && (
                              <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-50">
                                카톡ID 복사 완료!
                              </span>
                            )}
                          </button>
                        </div>

                        {/* Location details */}
                        <p className="text-[10.5px] text-gray-500 font-bold font-sans">
                          울산 중구 젊음의2거리 28-4
                        </p>
                      </div>

                      {/* Main core subjects round dark box (CHARCOAL CAPSULE BOX) */}
                      <div className="bg-[#2B2B2B] border border-[#DCB75C]/30 rounded-xl p-3 shadow-inner text-center space-y-1">
                        <div className="flex items-center justify-center space-x-2 text-[10.5px] sm:text-[11px] text-[#FAF8F2] tracking-[0.05em] font-medium leading-none">
                          <span className="text-[#E2C784] font-bold">연애운</span>
                          <span className="text-gray-500/60 font-light">|</span>
                          <span className="text-[#E2C784] font-bold">재회운</span>
                          <span className="text-gray-500/60 font-light">|</span>
                          <span className="text-[#E2C784] font-bold">결혼운</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-[10.5px] sm:text-[11px] text-[#FAF8F2] tracking-[0.05em] font-medium leading-none">
                          <span className="text-[#E2C784] font-bold">금전운</span>
                          <span className="text-gray-500/60 font-light">|</span>
                          <span className="text-[#E2C784] font-bold">직장운</span>
                          <span className="text-gray-500/60 font-light">|</span>
                          <span className="text-[#E2C784] font-bold">사업운</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2 text-[10.5px] sm:text-[11px] text-[#FAF8F2] tracking-[0.05em] font-medium leading-none">
                          <span className="text-[#E2C784] font-bold">신년운</span>
                          <span className="text-gray-500/60 font-light">|</span>
                          <span className="text-[#E2C784] font-bold">학업운</span>
                          <span className="text-gray-500/60 font-light">|</span>
                          <span className="text-[#E2C784] font-bold">속마음</span>
                        </div>
                      </div>

                      {/* Bottom account payment block */}
                      <div className="pt-2 text-center border-t border-gray-200/55">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyText('카카오뱅크 3333-05-6644225', 'ACCOUNT');
                          }}
                          className="cursor-pointer w-full text-center hover:bg-gray-100 p-1.5 rounded-lg transition-all text-[11px] font-sans text-gray-700 font-bold border border-gray-100 flex items-center justify-center space-x-1.5 relative"
                        >
                          <span className="text-yellow-600 block leading-tight font-extrabold text-[10px]">카카오뱅크</span>
                          <span className="text-gray-900 underline block leading-tight font-extrabold">3333-05-6644225</span>
                          {copiedAccount && (
                            <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#006241] text-white text-[9px] px-2.5 py-1 rounded shadow-lg font-bold z-50 whitespace-nowrap">
                              계좌번호 복사 완료!
                            </span>
                          )}
                        </button>
                      </div>

                      {/* Hint to Flip */}
                      <div className="text-[9px] text-[#C49B45] font-sans tracking-tight text-center mt-1 select-none animate-bounce font-bold leading-none">
                        FRONT • 클릭 시 뒷면 전환
                      </div>
                    </div>

                    {/* CARD BACK SIDE (High Fidelity Representation of Image 2) */}
                    <div 
                      className="absolute inset-0 w-full h-full rounded-2xl backface-hidden flex flex-col justify-between p-5 sm:p-6 bg-[#FAF9F5] border-2 border-[#D4AF37]/50 text-gray-800 shadow-xl overflow-hidden selection:bg-brand-gold-300/30"
                      style={{ transform: 'rotateY(180deg)' }}
                    >
                      {/* Luxury subtle ivory gradient surface texture */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#FCFAF2] via-[#FDFCF7] to-[#EDEDE2] opacity-90 pointer-events-none -z-10"></div>
                      
                      {/* Beautiful stylized gold shooting stars arcs simulated from image 2 with SVG */}
                      <div className="absolute top-6 left-6 w-32 h-20 opacity-90 pointer-events-none">
                        <svg className="w-full h-full stroke-amber-500/80 fill-none" viewBox="0 0 100 60">
                          <line x1="10" y1="52" x2="68" y2="12" strokeWidth="1.2" strokeLinecap="round" />
                          <polygon points="68,12 63,16 68,17" fill="#D4AF37" stroke="#D4AF37" strokeWidth="1" />
                          
                          <line x1="30" y1="58" x2="80" y2="24" strokeWidth="0.8" strokeLinecap="round" />
                          <polygon points="80,24 76,27 80,28" fill="#D4AF37" stroke="#D4AF37" strokeWidth="0.8" />
                          
                          {/* Small sparkling stars */}
                          <polygon points="42,20 43,21.5 45,21.5 43.5,23 44,25 42,23.5 40,25 40.5,23 39,21.5 41,21.5" fill="#D4AF37" stroke="none" />
                          <polygon points="76,42 76.5,43 77.5,43 76.7,43.7 77,44.7 76,44 75,44.7 75.3,43.7 74.5,43 75.5,43" fill="#D4AF37" stroke="none" />
                        </svg>
                      </div>

                      {/* Main Star from top right corner */}
                      <div className="absolute top-8 right-8 flex flex-col items-center">
                        <Sparkles className="h-6 w-6 text-[#C49B45] animate-pulse" />
                      </div>

                      {/* Content of Back Side */}
                      <div className="text-center pt-14 flex-1 flex flex-col justify-center space-y-6">
                        {/* Gold logo text representation "위로의 카드" */}
                        <div className="font-serif text-[26px] sm:text-[28px] font-bold tracking-[0.25em] text-[#C49B45] leading-none drop-shadow-sm">
                          위로의 카드
                        </div>

                        {/* Inspirational quotes exactly matched from Image 2 */}
                        <div className="space-y-3 px-2">
                          <p className="text-gray-900 text-[13px] sm:text-[14px] font-bold leading-relaxed tracking-wider font-serif">
                            어둠 속에도 빛은 존재합니다.
                          </p>
                          <p className="text-gray-700 text-[12px] sm:text-[13px] font-bold leading-relaxed font-serif">
                            힘든 순간,
                          </p>
                          <p className="text-[#C49B45] text-[13px] sm:text-[14px] font-extrabold leading-relaxed tracking-wide font-serif">
                            그 빛을 함께 찾아보아요.
                          </p>
                        </div>
                      </div>

                      {/* Brand/Office footnote */}
                      <div className="pt-2 text-center border-t border-gray-200/40 text-[9px] text-gray-400 font-sans tracking-widest uppercase">
                        Taro Master Sse • Comfort Guide
                      </div>

                      {/* Hint to Flip */}
                      <div className="text-[9px] text-[#C49B45] font-sans tracking-tight text-center mt-1 select-none animate-bounce font-bold leading-none">
                        BACK • 클릭 시 앞면 전환
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* STYLISH DETAILED PRICING UNDER THE CARD */}
              <div className="p-6 rounded-2xl border border-brand-gold-400/20 bg-brand-navy-900 shadow-md space-y-4">
                <div className="text-center space-y-1 pb-3 border-b border-brand-gold-400/10">
                  <h5 className="font-serif text-sm font-bold text-brand-gold-300">
                    석세은 마스터의 공인 프로그램 요금제
                  </h5>
                  <p className="text-[11px] text-brand-gold-200/70 font-sans">
                    사주와 타로의 융합 분석을 거쳐 최상의 이정표를 설계해 드립니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                  
                  {/* Left block - Single or special sessions */}
                  <div className="space-y-2">
                    <div className="bg-brand-navy-950 p-2 rounded border border-brand-gold-400/5 text-[11px] font-bold text-brand-gold-300">
                      셔플 / 질문별 요금
                    </div>
                    
                    <div className="flex justify-between items-center py-1.5 border-b border-brand-gold-400/10 px-1">
                      <span className="font-semibold text-brand-gold-100">간편타로 <span className="text-brand-gold-200/50 text-[10px] font-normal">(1셔플)</span></span>
                      <span className="font-mono font-bold text-brand-gold-300">5,000원</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-brand-gold-400/10 px-1">
                      <span className="font-semibold text-brand-gold-100">심층상담 <span className="text-brand-gold-200/50 text-[10px] font-normal">(1질문)</span></span>
                      <span className="font-mono font-bold text-brand-gold-300 font-bold">10,000원</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-brand-gold-400/10 px-1">
                      <span className="font-semibold text-brand-gold-100">신년운세 <span className="text-brand-gold-200/50 text-[10px] font-normal">(+오행)</span></span>
                      <span className="font-mono font-bold text-brand-gold-300 font-bold">50,000원</span>
                    </div>
                  </div>

                  {/* Right block - Time limited readings */}
                  <div className="space-y-2">
                    <div className="bg-[#0E291F] p-2 rounded border border-[#006241]/20 text-[11px] font-bold text-brand-gold-100 flex justify-between">
                      <span>시간 상담 <span className="text-brand-gold-300 text-[9px] font-normal">(질문 무제한)</span></span>
                      <span className="text-[10px] text-emerald-400 font-bold font-sans">추천</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-brand-gold-400/10 px-1">
                      <span className="font-semibold text-brand-gold-100">30분 진행</span>
                      <span className="font-mono font-bold text-brand-gold-300 font-bold">20,000원</span>
                    </div>

                    <div className="flex justify-between items-center py-1.5 border-b border-brand-gold-400/10 px-1">
                      <span className="font-semibold text-brand-gold-100">60분 진행 (1시간)</span>
                      <span className="font-mono font-bold text-brand-gold-300 font-bold">35,000원</span>
                    </div>
                  </div>

                </div>

                {/* Footer Copy Social */}
                <div className="pt-2 border-t border-brand-gold-400/10 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => handleCopyText('taro_for_comfort', 'INSTAGRAM')}
                    className="cursor-pointer inline-flex items-center space-x-2 bg-brand-navy-950 border border-brand-gold-400/10 hover:border-brand-gold-400/30 px-4 py-1.5 rounded-full text-[11px] text-brand-gold-250 transition-all font-semibold relative"
                  >
                    <span className="text-[11px]">🔍 인스타 팔로우:</span>
                    <span className="font-serif text-[#C49B45] tracking-[0.1em]">@taro_for_comfort</span>
                    {copiedInsta && (
                      <span className="absolute -top-9 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap font-bold">
                        인스타 아이디 복사 완료!
                      </span>
                    )}
                  </button>
                </div>

              </div>
            </div>

            {/* RIGHT SIDE: INTERACTIVE MAP & CONTACT CARD (Fidelity to Image 1 Naver map UI) */}
            <div className="flex flex-col justify-between">
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-brand-gold-400" />
                  <h4 className="font-serif text-lg font-bold text-brand-gold-300">
                    울산 오프라인 전용 스튜디오 오시는 길
                  </h4>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-sans font-medium text-emerald-400">
                    현재 대기실 오픈
                  </span>
                </div>
              </div>

              {/* Map Holder Wrapper Box */}
              <div className="flex-1 rounded-2xl border border-brand-gold-400/20 bg-brand-navy-900 p-4 sm:p-5 flex flex-col justify-between space-y-6 relative overflow-hidden shadow-md">
                
                {/* 1. Address, Phone, Operation details (Extracted exactly from Naver Map Listing screenshot) */}
                <div className="space-y-3 font-sans text-xs sm:text-sm">
                  {/* Title Block & Copy Button */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-brand-gold-100 flex items-center space-x-2">
                        <span>위로의카드</span>
                        <span className="text-xs text-brand-gold-400 font-normal ml-1 border-l border-brand-gold-400/25 pl-2">운세, 사주</span>
                      </h3>
                      <p className="text-xs text-brand-gold-200/50 font-mono mt-0.5">TARO FOR COMFORT OFFICE</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyText('울산광역시 중구 젊음의2거리 28-4', 'ADDRESS')}
                      className="cursor-pointer text-[11px] text-brand-gold-400 hover:text-brand-gold-500 flex items-center space-x-1 px-2.5 py-1.5 bg-brand-navy-950 border border-brand-gold-400/15 rounded-lg hover:border-brand-gold-400/40 transition-all relative"
                    >
                      <Copy className="h-3 w-3" />
                      <span>주소 복사</span>
                      {copiedAddress && (
                        <span className="absolute -top-9 right-0 bg-[#006241] text-white text-[10px] px-2.5 py-1 rounded shadow-lg font-bold z-20">
                          복사되었습니다!
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Icon details from Map Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-brand-gold-400/10">
                    
                    {/* Phone */}
                    <a
                      href="tel:0507-1319-3796"
                      className="flex items-center space-x-2.5 p-2 bg-brand-navy-950 border border-brand-gold-400/10 hover:border-[#006241]/30 rounded-lg text-brand-gold-100 hover:text-[#006241] transition-colors"
                    >
                      <Phone className="h-4 w-4 text-[#D4AF37]" />
                      <div className="text-left font-sans">
                        <span className="text-[10px] text-brand-gold-200/50 block leading-tight">상담안내 예약번호</span>
                        <span className="font-semibold text-sm">0507-1319-3796</span>
                      </div>
                    </a>

                    {/* Clock Hours */}
                    <div className="flex items-center space-x-2.5 p-2 bg-brand-navy-950 border border-brand-gold-400/10 rounded-lg text-brand-gold-100">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <div className="text-left">
                        <span className="text-[10px] text-brand-gold-200/50 block leading-tight">영업 시간안내</span>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-semibold text-xs shrink-0">10:00 - 21:00</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded border border-emerald-400/20 font-bold">영업중</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Physical Street address breakdown */}
                  <div className="space-y-1.5 p-3 rounded-lg bg-brand-navy-950/60 text-xs text-brand-gold-200 leading-relaxed border border-brand-gold-400/10">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-brand-gold-100">도로명:</span> 울산광역시 중구 젊음의2거리 28-4
                        <br />
                        <span className="font-bold text-brand-gold-100">지번:</span> 성남동 219-141
                        <span className="text-[10px] bg-brand-navy-900 border border-brand-gold-400/10 px-1.5 py-0.5 rounded text-[#D4AF37] ml-2 font-bold">성남 메인 젊음의 거리 뒷길 인접</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 2. Interactive SVG Vector Map Frame (Simulated Naver Map Interface exactly matched) */}
                <div className="relative rounded-xl border border-brand-gold-400/20 h-56 bg-[#EFF0F2] overflow-hidden select-none">
                  
                  {/* Naver Map header simulation bar */}
                  <div className="absolute top-0 inset-x-0 bg-white/90 backdrop-blur-sm border-b border-gray-200/80 z-20 px-3 py-1.5 flex items-center justify-between text-gray-700 font-sans text-[11px]">
                    <span className="font-bold text-gray-900 flex items-center space-x-1">
                      <span className="text-emerald-700 font-serif font-black mr-0.5">N</span>
                      <span>울산광역시 중구 성남동</span>
                    </span>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <span>• Naver Map API Active</span>
                    </div>
                  </div>

                  {/* MAP CANVAS GRID CONTAINER AREA - responds slightly to mapZoom state */}
                  <div className="absolute inset-0 pt-7 z-10 overflow-hidden flex items-center justify-center bg-[#E5E7EB]">
                    
                    {/* SVG Map Graphics - scales down or up based on zoom */}
                    <div 
                      className="relative w-[340px] h-[180px] origin-center transition-transform duration-500"
                      style={{
                        transform: `scale(${mapZoom === 1 ? 0.75 : mapZoom === 2 ? 1 : 1.35})`,
                      }}
                    >
                      {/* Streets and roads representation in exact matching colors */}
                      
                      {/* Road background grid */}
                      <div className="absolute top-2 w-full h-[1px] bg-white border-b-2 border-gray-300"></div>
                      <div className="absolute top-12 w-full h-[1px] bg-white border-b-4 border-gray-300"></div>
                      
                      {/* Real street representing "젊음의2거리" running vertically */}
                      <div className="absolute left-[130px] h-full w-8 bg-white border-l-2 border-r-2 border-gray-300/60 rotate-12 flex items-center justify-center">
                        <span className="font-sans text-[8px] text-gray-400 tracking-tight font-bold rotate-[102deg] absolute">젊음의2거리</span>
                      </div>

                      {/* Major horizontal road "번영로" in top area */}
                      <div className="absolute top-2 left-0 w-full h-8 bg-white border-t border-b border-gray-300 transform -rotate-1 skew-x-12"></div>
                      
                      {/* River Representation: 태화강 at the bottom */}
                      <div className="absolute bottom-0 inset-x-0 h-11 bg-sky-200 border-t-2 border-sky-300 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-sky-100 opacity-20 bg-gradient-to-r from-sky-400 via-sky-300 to-sky-400 animate-pulse"></div>
                        <span className="font-sans text-[10px] text-sky-700 tracking-widest font-bold z-10 flex items-center space-x-1">
                          <span>⛵</span>
                          <span>태화강 (Taehwa River)</span>
                        </span>
                      </div>

                      {/* LANDMARK LABELS */}
                      {/* 1. 번영로센트리지 5단지 */}
                      <div className="absolute top-3 left-16 bg-white border border-gray-300 px-1 py-0.5 rounded shadow-sm text-[8px] text-gray-500 scale-90">
                        번영로센트리지 5단지아파트
                      </div>

                      {/* 2. MBC */}
                      <div className="absolute top-4 right-10 bg-white border border-gray-300 px-1 py-0.5 rounded shadow-sm text-[8px] text-gray-500 scale-90">
                        MBC 방송국
                      </div>

                      {/* 3. 태화동 우정동 푸르지오 */}
                      <div className="absolute top-14 left-4 text-gray-400 text-[8px] scale-95 font-medium">
                        태화동 푸르지오
                      </div>                      {/* 4. 세이브존 */}
                      <div className="absolute bottom-14 left-9 bg-yellow-101 border border-yellow-300 text-yellow-800 px-1 py-0.5 rounded shadow-sm text-[8px] font-semibold scale-90">
                        🛒 세이브존 울산점
                      </div>

                      {/* 5. 태화강변 유채꽃단지 */}
                      <div className="absolute bottom-14 right-4 bg-emerald-100 border border-emerald-300 text-emerald-800 px-1.5 py-0.5 rounded shadow-sm text-[8px] font-semibold scale-90">
                        ☘️ 강변 유채꽃단지
                      </div>

                      {/* 6. 팩토리아울렛 */}
                      <div className="absolute top-16 right-24 bg-white border border-gray-200/90 px-1 py-0.5 rounded text-[8px] text-gray-500 scale-90">
                        팩토리아울렛
                      </div>

                      {/* CRITICAL BLUE NAVER MARKER: "위로의카드" (Fortune, Saju) Pinpoint */}
                      <div className="absolute top-12 left-[125px] transform translate-y-2 z-30 flex flex-col items-center">
                        
                        {/* Interactive floating Naver blue pinpoint tag */}
                        <div className="bg-[#1F65FF] hover:bg-[#0047E0] transition-colors text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-lg flex items-center space-x-1 relative whitespace-nowrap font-sans">
                          <span>📍</span>
                          <span>위로의카드</span>
                          
                          {/* Triangle Indicator tail */}
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-[#1F65FF]"></div>
                        </div>

                        {/* Pulsing Dot underneath the pin tail */}
                        <span className="relative flex h-3 w-3 mt-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1F65FF] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1F65FF]"></span>
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* MAP CONTROLS OVERLAYS (Scale level widgets exactly representing Naver Map UI) */}
                  <div className="absolute bottom-3 right-3 z-30 flex flex-col space-y-1 bg-white border border-gray-200 shadow rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setMapZoom(Math.min(3, mapZoom + 1))}
                      disabled={mapZoom === 3}
                      className={`h-6 w-6 text-xs text-gray-700 hover:bg-gray-100 rounded flex items-center justify-center font-bold ${mapZoom === 3 ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      +
                    </button>
                    <div className="h-[1px] bg-gray-200 mx-1"></div>
                    <button
                      type="button"
                      onClick={() => setMapZoom(Math.max(1, mapZoom - 1))}
                      disabled={mapZoom === 1}
                      className={`h-6 w-6 text-xs text-gray-700 hover:bg-gray-100 rounded flex items-center justify-center font-bold ${mapZoom === 1 ? 'text-gray-300 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      −
                    </button>
                  </div>

                  {/* Distance meter banner in bottom-left */}
                  <div className="absolute bottom-3 left-3 z-30 bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded px-1.5 py-0.5 text-[8px] text-gray-600 font-sans flex items-center space-x-1 shadow-sm">
                    <span className="font-semibold text-emerald-600">© NAVER Corp.</span>
                    <span>|</span>
                    <span className="font-semibold text-gray-800">500m 축척단위</span>
                  </div>

                </div>

                {/* Reservation Action Board */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!currentUser) {
                        openAuth();
                      } else {
                        setCurrentTab('booking');
                      }
                    }}
                    className="cursor-pointer w-full inline-flex items-center justify-center space-x-2 rounded-xl bg-[#D4AF37] hover:bg-[#b8952e] text-white p-3 font-sans text-xs sm:text-sm font-bold tracking-[0.15em] uppercase transition-colors shadow-lg shadow-[#000]/30"
                  >
                    <Navigation className="h-4 w-4 animate-bounce" />
                    <span>석세은 마스터 상담 예약하기</span>
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* REVIEW/FEEDBACK DISPLAY SECTION */}
        <div className="my-16 rounded-3xl bg-[#FCFAF5] border border-brand-gold-400/30 p-6 sm:p-10 shadow-xl relative overflow-hidden font-sans">
          {/* Ambient healing light effects */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-brand-gold-400/15 pb-6 mb-8 gap-4 relative z-10">
            <div>
              <h3 className="font-serif text-2xl font-bold text-slate-900 flex items-center space-x-2">
                <span>실제 방문자 상담 후기</span>
                <span className="text-[11px] font-sans font-bold bg-[#006241]/10 text-[#006241] px-2.5 py-0.5 rounded-full border border-emerald-600/20">
                  100% 리얼 후기
                </span>
              </h3>
              <p className="text-xs text-slate-600 mt-2">
                석세은 타로 마스터와의 깊이 있는 질문을 통해 변화와 위로를 찾은 분들의 솔직한 기록입니다.
              </p>
            </div>
 
            {/* Star Summary Stats */}
            <div className="flex items-center space-x-4 bg-white border border-brand-gold-400/30 px-4 py-2.5 rounded-xl shadow-sm">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current text-amber-500 shrink-0" />
                ))}
              </div>
              <div className="text-xs text-slate-700 font-semibold">
                평균 평점 <strong className="text-[#006241] font-serif text-base ml-1">{averageRating.toFixed(1)}</strong> / 5.0
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-none relative z-10">
            {[
              { key: 'ALL', label: '전체 후기' },
              { key: 'ROMANCE', label: '연애 상담' },
              { key: 'WEALTH', label: '재물 상담' },
              { key: 'CAREER', label: '직장·사업' },
              { key: 'NEWYEAR', label: '신년운세' },
              { key: 'MARRIAGE', label: '결혼 궁합' },
              { key: 'REUNION', label: '재회 타이밍' },
              { key: 'ACADEMIC', label: '학업·시험' }
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedReviewCategory(cat.key as any)}
                className={`cursor-pointer whitespace-nowrap rounded-full px-4.5 py-1.8 text-xs font-bold tracking-wide transition-all duration-200 border ${
                  selectedReviewCategory === cat.key
                    ? 'bg-[#006241] text-white border-brand-gold-400/40 shadow-md shadow-emerald-950/10'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-brand-gold-400/40 hover:text-[#006241] hover:bg-[#F7F5EE]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Review Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {filteredReviews.length === 0 ? (
              <div className="col-span-1 md:col-span-2 text-center py-12 rounded-2xl border border-dashed border-slate-200 bg-white shadow-sm">
                <p className="text-xs text-slate-400 font-sans">
                  선택하신 카테고리의 후기가 아직 등록되지 않았습니다. 예약 상담 완료 후 가장 먼저 남겨보세요!
                </p>
              </div>
            ) : (
              filteredReviews.map((rev) => {
                // Category info configuration helper inside map
                const catMap: Record<ConsultationType, { label: string; textClass: string; bgClass: string }> = {
                  ROMANCE: { label: '연애 상담', textClass: 'text-rose-250 border-rose-500/20', bgClass: 'bg-rose-950/40' },
                  WEALTH: { label: '재물 상담', textClass: 'text-amber-200 border-amber-500/20', bgClass: 'bg-amber-950/40' },
                  CAREER: { label: '직장·사업', textClass: 'text-blue-200 border-blue-500/20', bgClass: 'bg-blue-950/40' },
                  NEWYEAR: { label: '신년운세', textClass: 'text-purple-200 border-purple-500/20', bgClass: 'bg-purple-950/40' },
                  MARRIAGE: { label: '결혼 궁합', textClass: 'text-emerald-205 border-emerald-500/20', bgClass: 'bg-[#0E291F]' },
                  REUNION: { label: '재회 타이밍', textClass: 'text-pink-200 border-pink-500/20', bgClass: 'bg-pink-950/40' },
                  ACADEMIC: { label: '학업·시험', textClass: 'text-teal-200 border-teal-500/20', bgClass: 'bg-teal-950/40' },
                  OTHER: { label: '기타 고민', textClass: 'text-gray-200 border-gray-500/20', bgClass: 'bg-gray-950/40' }
                };
                const activeCat = catMap[rev.type] || { label: '기타 고민', textClass: 'text-brand-gold-200', bgClass: 'bg-brand-navy-950' };

                return (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-brand-gold-400/25 bg-gradient-to-br from-[#051F16] to-[#01140E] p-6 flex flex-col justify-between hover:border-brand-gold-400/40 hover:bg-gradient-to-br hover:from-[#07261B] hover:to-[#021811] transition-all duration-300 shadow-lg relative overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <div className="h-8.5 w-8.5 rounded-full bg-[#006241] border border-brand-gold-400/30 flex items-center justify-center text-xs text-brand-gold-100 font-extrabold uppercase shadow-sm">
                            {rev.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-white">{rev.userName} 고객님</div>
                            <span className={`inline-block text-[9px] px-2 py-0.5 rounded font-extrabold border ${activeCat.textClass} ${activeCat.bgClass} mt-0.5`}>
                              {activeCat.label}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, idx) => (
                            <Star key={idx} className="h-3.5 w-3.5 fill-current text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-zinc-100/95 leading-relaxed italic font-medium">
                        "{rev.content}"
                      </p>
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-[#E2C784]/15 flex justify-end text-[10px] text-brand-gold-400/75 font-mono">
                      상담 진행 보장 일자 • {rev.date}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
