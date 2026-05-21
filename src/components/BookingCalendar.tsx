import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { TIME_SLOTS } from '../data.ts';
import { Calendar as CalendarIcon, Clock, Sparkles, HelpCircle, Heart, Coins, AlertCircle, CheckCircle } from 'lucide-react';

interface BookingCalendarProps {
  setCurrentTab: (tab: string) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ setCurrentTab }) => {
  const { bookings, createBooking, currentUser } = useApp();
  
  // Set default selected date (today) or next days
  const todayStr = '2026-05-21';
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Form fields
  const [consultationType, setConsultationType] = useState<'ROMANCE' | 'WEALTH' | 'OTHER'>('ROMANCE');
  const [partnerAge, setPartnerAge] = useState<string>('');
  const [jobStatus, setJobStatus] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  
  // States
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [successInfo, setSuccessInfo] = useState<{ date: string; time: string } | null>(null);

  // Generate 14 days of calendar options beginning on 2026-05-21
  const getNext14Days = () => {
    const days = [];
    const baseDate = new Date('2026-05-21');
    for (let i = 0; i < 14; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const dayOfWeek = d.toLocaleDateString('ko-KR', { weekday: 'short' });
      days.push({
        dateStr,
        dayNum: day,
        dayOfWeek,
        isWeekend: d.getDay() === 0 || d.getDay() === 6
      });
    }
    return days;
  };

  const calendarDays = getNext14Days();

  // Reset selected time when date changes
  useEffect(() => {
    setSelectedTime('');
    setErrorMessage('');
  }, [selectedDate]);

  // Determine reserved times for the active selected date
  const activeReservations = bookings
    .filter((b) => b.date === selectedDate && b.status !== 'CANCELED')
    .map((b) => b.time);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedTime) {
      setErrorMessage('예약 시간대를 활성화하고 하나를 선택해 주세요.');
      return;
    }

    if (!details.trim()) {
      setErrorMessage('고민 중이신 상황 정보를 한줄 이상 적어주시면 더 높은 퀄리티의 리딩이 완성됩니다.');
      return;
    }

    const compiledJobStatus = consultationType === 'WEALTH' ? jobStatus : undefined;
    const compiledPartnerAge = consultationType === 'ROMANCE' ? partnerAge : undefined;

    const result = createBooking(
      selectedDate,
      selectedTime,
      consultationType,
      details,
      compiledPartnerAge,
      compiledJobStatus
    );

    if (result) {
      setSuccessInfo({ date: selectedDate, time: selectedTime });
      setIsSuccess(true);
      
      // Reset form
      setSelectedTime('');
      setDetails('');
      setPartnerAge('');
      setJobStatus('');
    } else {
      setErrorMessage('선택하신 날짜와 시간에는 이미 예정된 상담 일정이 존재합니다.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:px-8">
      
      {isSuccess ? (
        /* Booking Confirmation Card View */
        <div className="mx-auto max-w-xl rounded-2xl border-2 border-brand-gold-500/40 bg-brand-navy-900 p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-gold-500/5 blur-3xl"></div>
          <div className="absolute inset-2 rounded-xl border border-dashed border-brand-gold-400/20 pointer-events-none"></div>
          
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold-500/10 border border-brand-gold-500/30 text-brand-gold-400">
            <CheckCircle className="h-10 w-10 text-brand-gold-500" />
          </div>

          <h3 className="font-serif text-2xl font-bold tracking-tight text-brand-gold-100">
            상담 예약 접수 완료
          </h3>
          
          <p className="mt-4 text-sm text-brand-gold-100/80 leading-relaxed font-sans">
            당신의 마음을 짚어주는 명확한 이정표, <strong className="text-brand-gold-400 font-serif">Taro for comfort</strong>를 선택해 주셔서 대단히 감사드립니다.<br />
            아래 예약 내역에 대한 관리자 확인 후 확정 알림(알림톡)이 발송됩니다.
          </p>

          <div className="my-8 rounded-xl border border-brand-gold-400/15 bg-brand-navy-950 p-5 text-left font-sans space-y-3">
            <div className="flex justify-between border-b border-brand-gold-400/10 pb-2">
              <span className="text-xs text-brand-gold-400">예약자명</span>
              <span className="text-sm font-semibold text-brand-gold-100">{currentUser?.name}</span>
            </div>
            <div className="flex justify-between border-b border-brand-gold-400/10 pb-2">
              <span className="text-xs text-brand-gold-400">선택 분야</span>
              <span className="text-sm font-semibold text-brand-gold-300">
                {consultationType === 'ROMANCE' ? '♥ 연애운 상담' : consultationType === 'WEALTH' ? '🪙 재물운 상담' : '🔮 기타 고민상담'}
              </span>
            </div>
            <div className="flex justify-between border-b border-brand-gold-400/10 pb-2">
              <span className="text-xs text-brand-gold-400">예약 일시</span>
              <span className="text-sm font-semibold text-brand-gold-100">
                {successInfo?.date} ({new Date(successInfo?.date || '').toLocaleDateString('ko-KR', { weekday: 'short' })})  {successInfo?.time}
              </span>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-xs text-brand-gold-400">예약 상태</span>
              <span className="bg-brand-gold-500/20 text-brand-gold-400 border border-brand-gold-400/30 text-[10px] px-2 py-0.5 rounded">예약 대기 (관리자 확인중)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <button
              onClick={() => setCurrentTab('mypage')}
              className="cursor-pointer w-full sm:w-auto inline-flex justify-center rounded-lg bg-gradient-to-r from-brand-gold-500 to-brand-gold-400 px-5 py-2.5 font-sans text-xs sm:text-sm font-semibold text-brand-navy-950 active:scale-95 transition-transform"
            >
              예약 내역 & 이력 확인하기
            </button>
            <button
              onClick={() => {
                setIsSuccess(false);
                setSuccessInfo(null);
              }}
              className="cursor-pointer w-full sm:w-auto inline-flex justify-center rounded-lg border border-brand-gold-400/30 px-5 py-2.5 font-sans text-xs sm:text-sm text-brand-gold-300 hover:bg-brand-navy-800 transition-colors"
            >
              새 예약 추가 신청
            </button>
          </div>
        </div>
      ) : (
        /* Multi-step Calendar Scheduler */
        <div className="space-y-8">
          <div className="border-b border-brand-gold-400/10 pb-4">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-brand-gold-300">
              실시간 1:1 집중 카운슬링 예약
            </h2>
            <p className="text-xs text-brand-gold-100/60 font-sans mt-1">
              원하시는 날짜와 비어있는 황금 시간대를 터치하여 예약을 신청해 주세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* STEP 1: 달력 UI 날짜 선택 */}
            <div className="space-y-4">
              <label className="font-serif text-sm font-semibold text-brand-gold-400 flex items-center space-x-2">
                <CalendarIcon className="h-4.5 w-4.5" />
                <span>STEP 1. 예약 가능한 날짜 선택</span>
              </label>

              {/* Responsive Elegant Horizontal Slide Calendar list */}
              <div className="flex space-x-2 overflow-x-auto pb-3 scrollbar-thin">
                {calendarDays.map((day) => {
                  const isSelected = selectedDate === day.dateStr;
                  return (
                    <button
                      type="button"
                      key={day.dateStr}
                      onClick={() => setSelectedDate(day.dateStr)}
                      className={`cursor-pointer transition-all shrink-0 w-16 h-20 rounded-xl border flex flex-col justify-between items-center py-2.5 ${
                        isSelected
                          ? 'bg-brand-gold-500 border-brand-gold-400 text-brand-navy-950 scale-102 font-bold shadow-lg shadow-brand-gold-500/25'
                          : 'bg-brand-navy-900 border-brand-gold-400/15 text-brand-gold-100 hover:border-brand-gold-300'
                      }`}
                    >
                      <span className={`text-[10px] tracking-wide uppercase ${isSelected ? 'text-brand-navy-950' : 'text-brand-gold-400/70'}`}>
                        {day.dayOfWeek}
                      </span>
                      <span className="font-serif text-xl font-bold leading-none">
                        {day.dayNum}
                      </span>
                      <span className={`text-[8px] tracking-tight ${isSelected ? 'text-brand-navy-950/80' : day.isWeekend ? 'text-rose-400/70' : 'text-brand-gold-400/40'}`}>
                        {day.dateStr.slice(5)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: 가능한 시간대(슬롯)가 활성화되어 선택 가능 */}
            <div className="space-y-4">
              <label className="font-serif text-sm font-semibold text-brand-gold-400 flex items-center space-x-2">
                <Clock className="h-4.5 w-4.5" />
                <span>STEP 2. 시간대 선택 (해당일 예약현황 반영)</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TIME_SLOTS.map((slot) => {
                  const isBooked = activeReservations.includes(slot);
                  const isSelected = selectedTime === slot;

                  return (
                    <button
                      type="button"
                      key={slot}
                      disabled={isBooked}
                      onClick={() => setSelectedTime(slot)}
                      className={`cursor-pointer text-xs font-semibold py-3 px-3 rounded-lg border transition-all flex justify-between items-center ${
                        isBooked
                          ? 'bg-brand-navy-900/30 border-brand-gold-400/5 text-brand-gold-100/30 line-through cursor-not-allowed'
                          : isSelected
                          ? 'bg-brand-gold-500 text-brand-navy-950 border-brand-gold-400 scale-[1.01] shadow-lg shadow-brand-gold-500/10'
                          : 'bg-brand-navy-900 border-brand-gold-400/15 text-brand-gold-100/90 hover:bg-brand-navy-800'
                      }`}
                    >
                      <span className="font-serif tracking-wide">{slot}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase ${
                        isBooked
                          ? 'bg-black/25 text-brand-gold-100/20'
                          : isSelected
                          ? 'bg-brand-navy-950 text-brand-gold-500 font-bold'
                          : 'bg-brand-gold-500/10 text-brand-gold-300'
                      }`}>
                        {isBooked ? '마감' : isSelected ? '선택' : '가능'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: 사전 질문지 (상담 퀄리티 향상 유치) */}
            <div className="rounded-2xl border border-brand-gold-400/15 bg-brand-navy-900/40 p-6 space-y-6">
              
              <div className="flex items-center space-x-2 border-b border-brand-gold-400/10 pb-3">
                <HelpCircle className="h-5 w-5 text-brand-gold-400" />
                <div>
                  <h4 className="text-sm font-semibold text-brand-gold-200">
                    상담 사전 질문지 (Pre-Consultation Questionnaire)
                  </h4>
                  <p className="text-[10px] text-brand-gold-400/70 font-sans">
                    사전에 고민 정보를 주시면 심도 깊은 정밀 사주 조합과 전반 리딩을 준비할 수 있습니다.
                  </p>
                </div>
              </div>

              {/* 고민 분야 선택 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-gold-100 block">
                  상담을 원하는 카테고리를 골라주세요 *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'ROMANCE', label: '♥ 연애운', desc: '속마음, 궁합, 시기' },
                    { key: 'WEALTH', label: '🪙 재물운', desc: '리스크, 투자, 흐름' },
                    { key: 'OTHER', label: '🔮 기타 고민', desc: '사업, 인간관계 등' }
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.key}
                      onClick={() => setConsultationType(cat.key as any)}
                      className={`cursor-pointer border text-center p-3 rounded-lg transition-all flex flex-col justify-center items-center gap-1 ${
                        consultationType === cat.key
                          ? 'border-brand-gold-400 bg-brand-gold-500/10 text-brand-gold-100'
                          : 'border-brand-gold-400/10 bg-brand-navy-950/60 text-brand-gold-100/65 hover:border-brand-gold-400/30'
                      }`}
                    >
                      <span className="text-xs font-bold tracking-wide">{cat.label}</span>
                      <span className="text-[9px] text-brand-gold-400/60 font-sans">{cat.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* DYNAMIC FIELD: ROMANCE */}
              {consultationType === 'ROMANCE' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-gold-300 block">
                      상대방 나이 또는 나이차이 (선택)
                    </label>
                    <input
                      type="text"
                      placeholder="예: 28살 동갑 또는 3살 연상"
                      value={partnerAge}
                      onChange={(e) => setPartnerAge(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-brand-navy-950 text-brand-gold-100 border border-brand-gold-400/20 rounded-lg p-2.5 focus:border-brand-gold-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-gold-300 block">
                      현재 소통/연애 상태 (선택)
                    </label>
                    <select
                      value={jobStatus}
                      onChange={(e) => setJobStatus(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-brand-navy-950 text-brand-gold-100 border border-brand-gold-400/20 rounded-lg p-2.5 focus:border-brand-gold-500 focus:outline-none"
                    >
                      <option value="">-- 현재 상태를 골라주세요 --</option>
                      <option value="썸">현재 상호 호감단계 (썸)</option>
                      <option value="연애중">연애 중 (어긋남 복원 필요)</option>
                      <option value="이별상태">이별 및 연락 휴식기 (재회운)</option>
                      <option value="짝사랑">외로운 짝사랑 (진전 타이밍)</option>
                      <option value="기타">기타 애정관계 고민</option>
                    </select>
                  </div>
                </div>
              )}

              {/* DYNAMIC FIELD: WEALTH */}
              {consultationType === 'WEALTH' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-gold-300 block">
                      현재 귀하의 직업 또는 경제활동 군 *
                    </label>
                    <input
                      type="text"
                      placeholder="예: 중소기업 대리, 요식업 자영업, 창업 대기 등"
                      value={jobStatus}
                      onChange={(e) => setJobStatus(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-brand-navy-950 text-brand-gold-100 border border-brand-gold-400/20 rounded-lg p-2.5 focus:border-brand-gold-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-gold-300 block">
                      주의 깊게 보려는 경제적 기회/리스크 군 (선택)
                    </label>
                    <select
                      value={partnerAge}
                      onChange={(e) => setPartnerAge(e.target.value)}
                      className="w-full text-xs sm:text-sm bg-brand-navy-950 text-brand-gold-100 border border-brand-gold-400/20 rounded-lg p-2.5 focus:border-brand-gold-500 focus:outline-none"
                    >
                      <option value="">-- 주된 관심 관심사를 골라주세요 --</option>
                      <option value="사업도약">사업 창업 / 확장 및 동업 타이밍</option>
                      <option value="투자결정">주식/부동산 매매 등 핵심 자물운</option>
                      <option value="이직취업">연봉 협상 및 회사 이직 기로</option>
                      <option value="안전확보">금전 손실 및 리스크 방어</option>
                    </select>
                  </div>
                </div>
              )}

              {/* 고민 상세 사항 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-gold-100 block">
                  현재 어긋나거나 답답하고 느끼시는 구체적 고민 상황 기술 *
                </label>
                <textarea
                  rows={4}
                  placeholder={
                    consultationType === 'ROMANCE'
                      ? '남자친구의 연락 빈도가 줄었어요. 마음이 식은 건지 다른 고민이 있는 건지 궁금하고 언제 어떤 방식으로 속을 털어놓는 소통을 해야 어긋나지 않는지 알고 싶어요.'
                      : consultationType === 'WEALTH'
                      ? '그동안 준비해둔 식음 가맹 창업 계약을 6월에 하려고 합니다. 시기상 손재수가 들어와 있는지, 자금을 투입하여 기회로 바꿀 최선의 타이밍이 맞는지 궁금합니다.'
                      : '기타 고민하시는 상황과 질문들에 대해 한눈에 흐름을 파악할 수 있도록 편안하게 적어주세요.'
                  }
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-brand-navy-950 text-brand-gold-100 border border-brand-gold-400/20 rounded-lg p-2.5 focus:border-brand-gold-500 focus:outline-none focus:ring-1 focus:ring-brand-gold-500"
                  required
                />
              </div>

            </div>

            {/* Error Message Section */}
            {errorMessage && (
              <div className="flex items-center space-x-2 rounded-lg border border-red-500/30 bg-red-950/20 p-4 text-xs font-medium text-red-400">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Reservation Action */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                className="cursor-pointer flex-1 inline-flex justify-center items-center space-x-2 rounded-xl bg-gradient-to-r from-brand-gold-500 to-brand-gold-400 p-3.5 font-sans text-sm font-semibold text-brand-navy-950 shadow-lg shadow-brand-gold-500/20 active:scale-[0.99] transition-all"
                id="booking-submit-final"
              >
                <Sparkles className="h-4 w-4 text-brand-navy-950" />
                <span>
                  {selectedDate && selectedTime 
                    ? `${selectedDate} ${selectedTime} 예약신청 및 사전제출`
                    : '날짜와 시간을 지정해 주세요'}
                </span>
              </button>
              
              <button
                type="button"
                onClick={() => setCurrentTab('home')}
                className="cursor-pointer border border-brand-gold-400/30 bg-brand-navy-950/50 hover:bg-brand-navy-800 text-brand-gold-300 px-6 py-3.5 rounded-xl font-sans text-sm text-center"
              >
                이전 페이지로
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
