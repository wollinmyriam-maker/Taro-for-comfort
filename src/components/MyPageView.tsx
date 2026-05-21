import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Booking, BookingStatus, ConsultationType } from '../types.ts';
import { Sparkles, Calendar, Heart, Coins, ShieldAlert, CheckCircle, MessageSquare, Star, Trash2, Edit2, Smile, AlertCircle } from 'lucide-react';

export const MyPageView: React.FC = () => {
  const { currentUser, bookings, cancelBooking, addReview, updateBookingStatus } = useApp();
  
  // States for Review Form
  const [activeReviewBookingId, setActiveReviewBookingId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewContent, setReviewContent] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);

  // States for Inline Modify (Change details/time)
  const [activeEditBookingId, setActiveEditBookingId] = useState<string | null>(null);
  const [editDetails, setEditDetails] = useState<string>('');
  const [editStatusSuccess, setEditStatusSuccess] = useState<string>('');

  const myBookings = bookings.filter((b) => b.userId === currentUser?.id);

  const handleCancel = (bookingId: string) => {
    if (window.confirm('정말 이 상담 일정을 취소하시겠습니까? 취소 후 복구가 어렵습니다.')) {
      cancelBooking(bookingId);
    }
  };

  const startEdit = (b: Booking) => {
    setActiveEditBookingId(b.id);
    setEditDetails(b.additionalInfo.details);
    setEditStatusSuccess('');
  };

  const handleEditSubmit = (b: Booking) => {
    if (!editDetails.trim()) return;

    // We can update the details of the booking in local storage
    const allBookings = JSON.parse(localStorage.getItem('comfort_bookings') || '[]');
    const updated = allBookings.map((item: Booking) => {
      if (item.id === b.id) {
        return {
          ...item,
          additionalInfo: {
            ...item.additionalInfo,
            details: editDetails
          }
        };
      }
      return item;
    });

    localStorage.setItem('comfort_bookings', JSON.stringify(updated));
    setEditStatusSuccess('상담 상황 정보가 성공적으로 변경되었습니다.');
    setTimeout(() => {
      setActiveEditBookingId(null);
      window.location.reload(); // Refresh context
    }, 1500);
  };

  const handleReviewSubmit = (e: React.FormEvent, type: ConsultationType) => {
    e.preventDefault();
    if (!reviewContent.trim()) return;

    addReview(reviewRating, type, reviewContent);
    setReviewSuccess(true);
    
    // Auto clear
    setTimeout(() => {
      setActiveReviewBookingId(null);
      setReviewContent('');
      setReviewRating(5);
      setReviewSuccess(false);
    }, 2000);
  };

  // Helper status styling badge format
  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="bg-brand-gold-500/10 text-brand-gold-300 border border-brand-gold-400/20 text-[11px] px-2.5 py-1 rounded-full font-medium">
            예약 대기
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-500/35 text-[11px] px-2.5 py-1 rounded-full font-medium">
            예약 확정
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="bg-brand-navy-800 text-brand-gold-400 border border-brand-gold-400/40 text-[11px] px-2.5 py-1 rounded-full font-medium">
            상담 완료
          </span>
        );
      case 'CANCELED':
        return (
          <span className="bg-red-950/20 text-red-400/70 border border-red-500/15 text-[11px] px-2.5 py-1 rounded-full font-medium">
            예약 취소
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:px-8 space-y-8">
      
      {/* HEADER SECTION */}
      <div className="border-b border-brand-gold-400/10 pb-4">
        <h2 className="font-serif text-2xl font-bold tracking-tight text-brand-gold-300">
          마이페이지 & 상담 기록
        </h2>
        <p className="text-xs text-brand-gold-100/60 font-sans mt-1">
          고객님의 프로필과 예약 현황 정보, 상담완료된 소중한 비대면 기록들의 현황입니다.
        </p>
      </div>

      {/* USER PROFILE INFO CARD */}
      <div className="relative rounded-2xl border border-brand-gold-400/20 bg-brand-navy-900/40 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 overflow-hidden">
        <div className="absolute top-0 right-0 h-16 w-16 rounded-full bg-brand-gold-500/5 blur-xl -z-10"></div>
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-brand-navy-800 border-2 border-brand-gold-400/30 flex items-center justify-center font-serif text-lg font-bold text-brand-gold-300">
            {currentUser?.name.charAt(0)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-sans text-base font-bold text-brand-gold-100">{currentUser?.name} 님</span>
              <span className={`text-[9px] px-2 py-0.5 rounded font-mono ${
                currentUser?.provider === 'KAKAO' ? 'bg-[#FEE500] text-[#191919] font-semibold' : 'bg-[#03C75A] text-white'
              }`}>
                {currentUser?.provider === 'KAKAO' ? '카카오 간편가입' : '네이버 간편가입'}
              </span>
            </div>
            <p className="text-xs text-brand-gold-100/60">연동형 이메일: {currentUser?.email}</p>
            {currentUser?.phone && <p className="text-xs text-brand-gold-100/65">비상 연락처: {currentUser?.phone}</p>}
          </div>
        </div>

        <div className="text-right text-xs text-brand-gold-400 font-sans bg-brand-navy-950 px-3 py-1.5 rounded-lg border border-brand-gold-400/10 shrink-0">
          상담 스케줄 대기: <strong className="text-brand-gold-100">{myBookings.filter(b => b.status === 'PENDING').length}건</strong>
        </div>
      </div>

      {/* DETAILED BOOKINGS VIEW */}
      <div className="space-y-6">
        <h3 className="font-serif text-base font-bold text-brand-gold-300 flex items-center space-x-1.5">
          <Calendar className="h-4.5 w-4.5" />
          <span>신청하신 예약 스케줄 목록 ({myBookings.length}건)</span>
        </h3>

        {myBookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-brand-gold-400/20 p-12 text-center text-brand-gold-100/50">
            <AlertCircle className="h-10 w-10 text-brand-gold-400/40 mx-auto mb-3" />
            <p className="text-sm">현재 생성 및 대기 중인 예약 일정이 없습니다.</p>
            <p className="text-xs text-brand-gold-100/30 mt-1">상담 예약 메뉴에서 첫 이정표를 스케줄링해 보세요.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myBookings.map((b) => {
              const typeLabel = b.type === 'ROMANCE' ? '♥ 연애운 상담' : b.type === 'WEALTH' ? '🪙 재물운 상담' : '🔮 기타 고민상담';
              
              return (
                <div
                  key={b.id}
                  className="rounded-xl border border-brand-gold-400/15 bg-brand-navy-900/20 p-5 space-y-4 hover:border-brand-gold-500/20 transition-all duration-300"
                >
                  {/* Top line banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-gold-400/10 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono text-brand-gold-400/80">ID: {b.id.slice(5, 12)}</span>
                        <span className="text-[10px] text-brand-gold-100/40">신청일: {new Date(b.createdAt).toLocaleDateString('ko-KR')}</span>
                      </div>
                      <h4 className="text-sm font-bold text-brand-gold-100 flex items-center space-x-2">
                        {b.type === 'ROMANCE' ? (
                          <Heart className="h-4 w-4 text-rose-400 shrink-0" />
                        ) : (
                          <Coins className="h-4 w-4 text-yellow-500 shrink-0" />
                        )}
                        <span>{typeLabel}</span>
                      </h4>
                    </div>

                    <div className="flex items-center space-x-2">
                      {getStatusBadge(b.status)}
                    </div>
                  </div>

                  {/* Booking Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-sans">
                    {/* Time frame */}
                    <div className="md:col-span-4 bg-brand-navy-950 p-3 rounded-lg border border-brand-gold-400/5 space-y-2">
                      <span className="text-[10px] text-brand-gold-400 block font-bold uppercase">희망 상담 시간</span>
                      <div className="font-serif text-sm font-semibold text-brand-gold-100">
                        {b.date}
                      </div>
                      <div className="text-base font-bold text-brand-gold-500 font-serif">
                        {b.time}
                      </div>
                    </div>

                    {/* Pre-questionnaire details */}
                    <div className="md:col-span-8 bg-brand-navy-950/40 p-3 rounded-lg border border-brand-gold-400/5 space-y-2">
                      <span className="text-[10px] text-brand-gold-400 block font-bold uppercase">사전 질문지 전달 내용</span>
                      
                      {/* Dynamic metadata */}
                      {(b.additionalInfo.partnerAge || b.additionalInfo.jobStatus) && (
                        <div className="flex flex-wrap gap-1.5 pb-1 border-b border-brand-gold-400/5 text-[10px]">
                          {b.additionalInfo.partnerAge && (
                            <span className="bg-brand-navy-800 px-2 py-0.5 rounded text-brand-gold-300">
                              상대방: {b.additionalInfo.partnerAge}
                            </span>
                          )}
                          {b.additionalInfo.jobStatus && (
                            <span className="bg-brand-navy-800 px-2 py-0.5 rounded text-brand-gold-300">
                              현재 소속/활동군: {b.additionalInfo.jobStatus}
                            </span>
                          )}
                        </div>
                      )}

                      {activeEditBookingId === b.id ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            rows={3}
                            value={editDetails}
                            onChange={(e) => setEditDetails(e.target.value)}
                            className="w-full text-xs font-sans bg-brand-navy-950 text-brand-gold-100 border border-brand-gold-500/40 rounded p-2 focus:outline-none"
                          />
                          {editStatusSuccess && (
                            <p className="text-[10px] text-green-400 font-medium">{editStatusSuccess}</p>
                          )}
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => handleEditSubmit(b)}
                              className="bg-brand-gold-500 text-brand-navy-950 text-[10px] font-bold px-2 py-1 rounded"
                            >
                              변경 완료
                            </button>
                            <button
                              onClick={() => setActiveEditBookingId(null)}
                              className="bg-brand-navy-800 text-brand-gold-400 text-[10px] px-2 py-1 rounded border border-brand-gold-400/10"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-brand-gold-100/80 leading-relaxed italic text-xs">
                          "{b.additionalInfo.details}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ACTIVE FEEDBACK ROW IF COMPLETED */}
                  {b.status === 'COMPLETED' && (
                    <div className="rounded-xl border border-brand-gold-500/20 bg-brand-gold-500/5 p-4 space-y-2">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-brand-gold-400">
                        <Smile className="h-4 w-4" />
                        <span>Taro for comfort 가이드 이정표 피드백 메모</span>
                      </div>
                      <p className="text-xs text-brand-gold-100/90 leading-relaxed font-sans bg-brand-navy-950/70 p-3 rounded border border-brand-gold-400/10 italic">
                        {b.adminMemo || '상담이 정상 완료되었습니다. 기복하는 타이밍을 유휴하여 조심해 주시고 기회를 쟁취해 보시기 바랍니다.'}
                      </p>

                      {/* Review writing action */}
                      {activeReviewBookingId !== b.id ? (
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => {
                              setActiveReviewBookingId(b.id);
                              setReviewContent('');
                              setReviewSuccess(false);
                            }}
                            className="cursor-pointer text-xs font-semibold text-brand-gold-400 flex items-center space-x-1.5 bg-brand-navy-950 border border-brand-gold-400/25 px-3 py-1.5 rounded-lg hover:bg-brand-navy-900"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>상담 감사후기 남기기</span>
                          </button>
                        </div>
                      ) : (
                        /* Simple Review Panel */
                        <form
                          onSubmit={(e) => handleReviewSubmit(e, b.type)}
                          className="pt-3 border-t border-brand-gold-400/10 space-y-3"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-brand-gold-100 font-bold">평점 선택:</span>
                            <div className="flex text-amber-500 space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  type="button"
                                  key={star}
                                  onClick={() => setReviewRating(star)}
                                  className="cursor-pointer"
                                >
                                  <Star className={`h-4.5 w-4.5 ${reviewRating >= star ? 'fill-current' : 'text-brand-gold-100/30'}`} />
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <textarea
                              rows={2}
                              value={reviewContent}
                              onChange={(e) => setReviewContent(e.target.value)}
                              placeholder="상담 후 느끼셨던 감정의 변화와 도움 되었던 조언 포인트를 적어주시면 다른 예약자분들께 큰 도움이 됩니다."
                              className="w-full text-xs font-sans bg-brand-navy-950 text-brand-gold-100 border border-brand-gold-400/20 rounded p-2 focus:outline-none focus:border-brand-gold-500"
                              required
                            />
                          </div>

                          {reviewSuccess && (
                            <p className="text-green-400 text-xs font-medium">소중한 후기가 우주 공간에 성공적으로 등록되었습니다!</p>
                          )}

                          <div className="flex space-x-2 justify-end">
                            <button
                              type="submit"
                              className="bg-brand-gold-500 text-brand-navy-950 text-xs font-bold px-3 py-1.5 rounded-lg"
                            >
                              후기 등록
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveReviewBookingId(null)}
                              className="bg-brand-navy-800 text-brand-gold-400 text-xs px-3 py-1.5 rounded-lg border border-brand-gold-400/10"
                            >
                              취소
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}

                  {/* Actions footer for pending/confirmed bookings */}
                  {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                    <div className="flex justify-end space-x-2 pt-1 border-t border-brand-gold-400/5">
                      
                      {b.status === 'PENDING' && (
                        <button
                          onClick={() => startEdit(b)}
                          className="cursor-pointer text-[11px] font-semibold text-brand-gold-400 bg-brand-navy-950/80 border border-brand-gold-400/10 px-2.5 py-1 rounded hover:bg-brand-navy-900 flex items-center space-x-1"
                        >
                          <Edit2 className="h-3 w-3" />
                          <span>상황 수정</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleCancel(b)}
                        className="cursor-pointer text-[11px] font-semibold text-rose-400 bg-red-950/20 border border-red-500/20 px-2.5 py-1 rounded hover:bg-red-900/20 flex items-center space-x-1"
                        id={`cancel-${b.id}`}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>예약 취소</span>
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
