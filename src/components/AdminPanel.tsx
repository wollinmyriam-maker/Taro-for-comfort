import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { BookingStatus, Booking } from '../types.ts';
import { ShieldAlert, Users, Calendar, Heart, Coins, Check, CheckCircle, Clock, Trash2, MessageSquare, RefreshCw, Send, AlertCircle, Sparkles } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { bookings, notifications, updateBookingStatus, clearNotifications } = useApp();
  
  // Local state for active filters
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED'>('ALL');
  const [selectedBookingForMemo, setSelectedBookingForMemo] = useState<string | null>(null);
  const [adminMemoInput, setAdminMemoInput] = useState<string>('');

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    return b.status === activeTab;
  });

  const handleUpdateStatus = (bookingId: string, status: BookingStatus) => {
    updateBookingStatus(bookingId, status);
  };

  const handleSaveMemo = (bookingId: string) => {
    updateBookingStatus(bookingId, 'COMPLETED', adminMemoInput);
    setSelectedBookingForMemo(null);
    setAdminMemoInput('');
  };

  const startMemo = (b: Booking) => {
    setSelectedBookingForMemo(b.id);
    setAdminMemoInput(b.adminMemo || '');
  };

  // Dashboard calculations
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;
  const confirmedCount = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;
  const romanceCount = bookings.filter((b) => b.type === 'ROMANCE').length;
  const wealthCount = bookings.filter((b) => b.type === 'WEALTH').length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 space-y-8">
      
      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-brand-gold-400/10 pb-4 gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-brand-gold-300 flex items-center space-x-2">
            <ShieldAlert className="h-6 w-6 text-brand-gold-400 animate-pulse" />
            <span>Taro for comfort 관리자 전용 대시보드</span>
          </h2>
          <p className="text-xs text-brand-gold-100/60 font-sans mt-1">
            실시간 고객 상담 예약 스케줄 승인관리 및 카카오알림톡/문자 발송 관제 시스템입니다.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('정말 테스트 주소의 모든 발송 알림 내역을 비우시겠습니까?')) {
              clearNotifications();
            }
          }}
          className="cursor-pointer border border-brand-gold-400/20 text-brand-gold-400/70 hover:text-brand-gold-300 text-xs px-3.5 py-1.5 rounded-lg font-sans flex items-center space-x-1"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>알림 발송 이력 비우기</span>
        </button>
      </div>

      {/* DASHBOARD ANALYTICS STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="rounded-xl border border-brand-gold-400/10 bg-brand-navy-900/30 p-4 space-y-1">
          <span className="text-[10px] text-brand-gold-400 font-bold block uppercase">전체 접수 건</span>
          <div className="font-serif text-2xl font-bold text-brand-gold-100">{totalBookings}건</div>
          <span className="text-[9px] text-brand-gold-100/40 block">사주 + 타로 가이드 누적</span>
        </div>

        <div className="rounded-xl border border-yellow-500/15 bg-yellow-950/10 p-4 space-y-1">
          <span className="text-[10px] text-yellow-400 font-bold block uppercase">승인대기 (Pending)</span>
          <div className="font-serif text-2xl font-bold text-yellow-500">{pendingCount}건</div>
          <span className="text-[10px] text-yellow-400/75 animate-pulse font-medium block">● 조치 필요 스케줄</span>
        </div>

        <div className="rounded-xl border border-emerald-500/15 bg-emerald-950/10 p-4 space-y-1">
          <span className="text-[10px] text-emerald-400 font-bold block uppercase">예약확정 (Confirmed)</span>
          <div className="font-serif text-2xl font-bold text-emerald-400">{confirmedCount}건</div>
          <span className="text-[9px] text-brand-gold-100/40 block">상담 세션 연계 예정</span>
        </div>

        <div className="rounded-xl border border-brand-gold-400/10 bg-brand-navy-900/30 p-4 space-y-1">
          <span className="text-[10px] text-brand-gold-400 font-bold block uppercase">연애상담 누적</span>
          <div className="font-serif text-3xl font-bold text-rose-300">{romanceCount}건</div>
          <span className="text-[9px] text-pink-400/60 block">전체 중 {((romanceCount/(totalBookings || 1))*100).toFixed(0)}% 차지</span>
        </div>

        <div className="rounded-xl border border-brand-gold-400/10 bg-brand-navy-900/30 p-4 space-y-1">
          <span className="text-[10px] text-brand-gold-400 font-bold block uppercase">재물상담 누적</span>
          <div className="font-serif text-3xl font-bold text-yellow-400">{wealthCount}건</div>
          <span className="text-[9px] text-yellow-400/60 block">전체 중 {((wealthCount/(totalBookings || 1))*100).toFixed(0)}% 차지</span>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: RESERVATIONS LIST & ACTIONS (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="flex items-center justify-between border-b border-brand-gold-400/10 pb-3">
            <h3 className="text-sm font-semibold text-brand-gold-300 font-serif uppercase">
              예약 접수 및 상태 통제
            </h3>

            {/* Sub-Filters tab state */}
            <div className="flex space-x-1 overflow-x-auto">
              {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`cursor-pointer text-[10px] px-2.5 py-1.5 rounded-lg border font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-brand-gold-500 text-brand-navy-950 border-brand-gold-400 text-xs font-bold'
                      : 'bg-brand-navy-950 border-brand-gold-400/10 text-brand-gold-100/70 hover:border-brand-gold-300'
                  }`}
                >
                  {tab === 'ALL' ? '전체' : tab === 'PENDING' ? '대기' : tab === 'CONFIRMED' ? '확정' : tab === 'COMPLETED' ? '완료' : '취소'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 rounded-xl border border-dashed border-brand-gold-400/10 text-brand-gold-100/40">
                선택하신 필터의 예약 내역이 존재하지 않습니다.
              </div>
            ) : (
              filteredBookings.map((b) => {
                const isSelectedForMemo = selectedBookingForMemo === b.id;

                return (
                  <div
                    key={b.id}
                    className="rounded-xl border border-brand-gold-400/15 bg-brand-navy-900/10 p-5 space-y-4 hover:border-brand-gold-500/20 transition-all duration-300"
                  >
                    
                    {/* Customer identity rows and types */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-gold-400/10 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-brand-gold-100">{b.userName} 고객님</span>
                          <span className="text-[10px] text-brand-gold-400/80 font-mono">({b.userPhone})</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-block text-[10px] px-2 py-0.5 rounded font-bold ${
                            b.type === 'ROMANCE' ? 'bg-pink-950/40 text-rose-300' : 'bg-yellow-950/40 text-yellow-400'
                          }`}>
                            {b.type === 'ROMANCE' ? '♥ 연애운' : b.type === 'WEALTH' ? '🪙 재물운' : '🔮 기타상담'}
                          </span>
                          <span className="text-[10px] text-brand-gold-100/45">생성시각: {new Date(b.createdAt).toLocaleTimeString('ko-KR')}</span>
                        </div>
                      </div>

                      {/* Explicit Interactive Click of One Button Status Manager */}
                      <div className="flex flex-wrap gap-1">
                        {[
                          { key: 'PENDING', label: '대기', style: 'bg-brand-gold-500/10 text-brand-gold-400 font-bold border border-brand-gold-400/20' },
                          { key: 'CONFIRMED', label: '접수승인', style: 'bg-emerald-950 text-emerald-400 font-bold border border-emerald-500/30' },
                          { key: 'COMPLETED', label: '상담완료', style: 'bg-brand-navy-850 text-brand-gold-400 font-normal border border-brand-gold-400/30' },
                          { key: 'CANCELED', label: '취소', style: 'bg-red-950 text-red-400 font-normal border border-red-500/35' }
                        ].map((btn) => (
                          <button
                            key={btn.key}
                            onClick={() => handleUpdateStatus(b.id, btn.key as BookingStatus)}
                            className={`cursor-pointer px-2 py-1 rounded text-[10px] transition-all ${
                              b.status === btn.key
                                ? 'bg-gradient-to-r from-brand-gold-500 to-brand-gold-400 text-brand-navy-950 font-bold scale-[1.03]'
                                : 'bg-brand-navy-950 text-brand-gold-100/60 hover:text-brand-gold-100'
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Booking metadata display grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-sans">
                      
                      {/* Schedule Slot Date */}
                      <div className="md:col-span-4 bg-brand-navy-950 p-3 rounded-lg border border-brand-gold-400/10 space-y-1">
                        <span className="text-[10px] text-brand-gold-400/60 uppercase block font-bold">상담일과 타임슬롯</span>
                        <div className="font-serif text-sm font-semibold text-brand-gold-100">{b.date}</div>
                        <div className="text-sm font-bold text-brand-gold-500 font-serif">{b.time}</div>
                      </div>

                      {/* Customer written answers */}
                      <div className="md:col-span-8 bg-brand-navy-950 p-3 rounded-lg border border-brand-gold-400/10 space-y-1">
                        <span className="text-[10px] text-brand-gold-400/60 uppercase block font-bold">고객 전달 상황지 내용</span>
                        
                        {(b.additionalInfo.partnerAge || b.additionalInfo.jobStatus) && (
                          <div className="flex space-x-2 text-[9px] text-brand-gold-300 font-medium pb-1.5 mb-1.5 border-b border-brand-gold-400/5">
                            {b.additionalInfo.partnerAge && <span>상대 정보: {b.additionalInfo.partnerAge}</span>}
                            {b.additionalInfo.jobStatus && <span>귀하 군: {b.additionalInfo.jobStatus}</span>}
                          </div>
                        )}

                        <p className="text-brand-gold-100/80 leading-relaxed italic">
                          "{b.additionalInfo.details}"
                        </p>
                      </div>

                    </div>

                    {/* ADMIN MEMO & DETAILED COUNSELING RESPONSE */}
                    <div className="bg-brand-navy-950 p-4 rounded-xl border border-brand-gold-400/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-gold-300 flex items-center space-x-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>상담 완료 메모 및 고객 전달 피드백 지포</span>
                        </span>

                        {!isSelectedForMemo && (
                          <button
                            onClick={() => startMemo(b)}
                            className="text-[11px] font-semibold text-brand-gold-400 hover:text-brand-gold-300"
                          >
                            {b.adminMemo ? '메모 편집' : '+ 피드백 추가작성'}
                          </button>
                        )}
                      </div>

                      {isSelectedForMemo ? (
                        <div className="space-y-3 pt-1">
                          <textarea
                            rows={3}
                            value={adminMemoInput}
                            onChange={(e) => setAdminMemoInput(e.target.value)}
                            placeholder="본 상담 완료 시 고객 마이페이지에 바로 노출될 피드백 지침 메모를 적어주세요. (예: 연애 상대방은 현재 방어적인 기간이므로 6월 중순에 재접근하는 전략 추천)"
                            className="w-full text-xs font-sans bg-brand-navy-900 text-brand-gold-100 border border-brand-gold-400/30 rounded p-2 focus:outline-none focus:border-brand-gold-500"
                          />
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => handleSaveMemo(b.id)}
                              className="bg-brand-gold-500 text-brand-navy-950 text-xs font-bold px-3 py-1.5 rounded"
                            >
                              피드백 등록 완료
                            </button>
                            <button
                              onClick={() => setSelectedBookingForMemo(null)}
                              className="bg-brand-navy-800 text-brand-gold-400 text-xs px-3 py-1.5 rounded border border-brand-gold-400/10"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-brand-gold-100/70 leading-relaxed font-sans italic bg-brand-navy-900/60 p-2.5 rounded border border-brand-gold-400/5">
                          {b.adminMemo || '등록된 피드백 메모가 아직 없습니다. 상담을 완료하고 고객에게 줄 이정표 메모를 작성하세요.'}
                        </p>
                      )}

                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* RIGHT: REAL-TIME SMS/KAKAO OUTBOUND GATEWAY (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border-b border-brand-gold-400/10 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-brand-gold-300 font-serif uppercase">
              실시간 알림 발송 관제 센터
            </h3>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>

          <p className="text-[11px] text-brand-gold-100/60 leading-normal font-sans">
            새로운 예약 수신 시 <strong>관리자 알림</strong> 및 
            관리자의 상태 변경 시 <strong>상황별 자동 알림톡</strong> 대행 허브 전송 로그입니다.
          </p>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {notifications.length === 0 ? (
              <div className="rounded-xl border border-dashed border-brand-gold-400/15 p-8 text-center text-xs text-brand-gold-100/30">
                아직 전송된 알림톡/문자 이력이 없습니다. 일정을 수정해 보세요!
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="rounded-lg bg-brand-navy-950 p-3.5 border border-brand-gold-400/10 space-y-2 relative overflow-hidden animate-fade-in"
                >
                  <div className="absolute top-0 right-0 -mr-2 -mt-2 opacity-5">
                    <Send className="h-12 w-12 text-brand-gold-500" />
                  </div>

                  <div className="flex items-center justify-between border-b border-brand-gold-400/5 pb-1.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      notif.type === 'KAKAO' ? 'bg-yellow-950 text-yellow-400 border border-yellow-500/20' : 'bg-brand-navy-800 text-brand-gold-400 border border-brand-gold-400/10'
                    }`}>
                      {notif.type === 'KAKAO' ? '카카오 알림톡' : 'SMS 문자'}
                    </span>
                    <span className="text-[8px] text-brand-gold-100/40 font-mono">
                      {new Date(notif.sentAt).toLocaleTimeString('ko-KR')}
                    </span>
                  </div>

                  <p className="text-[11px] text-brand-gold-100/85 leading-normal font-sans tracking-tight">
                    {notif.message}
                  </p>

                  <div className="flex justify-between items-center text-[8px] text-brand-gold-400/50">
                    <span className="font-mono">DEST: {notif.userName}</span>
                    <span className="text-emerald-400 font-semibold flex items-center space-x-0.5">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>전송 성공</span>
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
