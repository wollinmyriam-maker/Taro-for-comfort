import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Booking, Review, NotificationLog, BookingStatus, ConsultationType } from '../types.ts';
import { INITIAL_REVIEWS, INITIAL_BOOKINGS } from '../data.ts';

interface AppContextType {
  currentUser: User | null;
  bookings: Booking[];
  reviews: Review[];
  notifications: NotificationLog[];
  loginWithSocial: (provider: 'KAKAO' | 'NAVER', name: string, phone: string, email: string) => void;
  loginAsAdmin: (password: string) => boolean;
  logout: () => void;
  createBooking: (
    date: string,
    time: string,
    type: 'ROMANCE' | 'WEALTH' | 'OTHER',
    details: string,
    partnerAge?: string,
    jobStatus?: string
  ) => boolean;
  cancelBooking: (bookingId: string) => void;
  updateBookingStatus: (bookingId: string, status: BookingStatus, adminMemo?: string) => void;
  addReview: (rating: number, type: ConsultationType, content: string) => void;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);

  // Load from localStorage or seed initial data
  useEffect(() => {
    const savedUser = localStorage.getItem('comfort_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const savedBookings = localStorage.getItem('comfort_bookings');
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      setBookings(INITIAL_BOOKINGS);
      localStorage.setItem('comfort_bookings', JSON.stringify(INITIAL_BOOKINGS));
    }

    const savedReviews = localStorage.getItem('comfort_reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem('comfort_reviews', JSON.stringify(INITIAL_REVIEWS));
    }

    const savedNotifications = localStorage.getItem('comfort_notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Sync to localStorage
  const saveUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('comfort_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('comfort_user');
    }
  };

  const saveBookingsState = (newBookings: Booking[]) => {
    setBookings(newBookings);
    localStorage.setItem('comfort_bookings', JSON.stringify(newBookings));
  };

  const saveReviewsState = (newReviews: Review[]) => {
    setReviews(newReviews);
    localStorage.setItem('comfort_reviews', JSON.stringify(newReviews));
  };

  const saveNotificationsState = (newNotifications: NotificationLog[]) => {
    setNotifications(newNotifications);
    localStorage.setItem('comfort_notifications', JSON.stringify(newNotifications));
  };

  const loginWithSocial = (provider: 'KAKAO' | 'NAVER', name: string, phone: string, email: string) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: name || '사용자',
      email: email || 'user@example.com',
      role: 'USER',
      provider,
      phone: phone || '010-0000-0000',
    };
    saveUser(newUser);

    // Dynamic toast-like event or welcome message
    triggerNotification(
      'sys',
      newUser.name,
      `[Taro for comfort] ${newUser.name}님이 ${provider === 'KAKAO' ? '카카오' : '네이버'}로 회원가입 및 로그인에 성공하셨습니다.`,
      'KAKAO'
    );
  };

  const loginAsAdmin = (password: string): boolean => {
    if (password === 'admin123' || password === 'admin') {
      const adminUser: User = {
        id: 'admin-1',
        name: '최고관리자',
        email: 'admin@comfortcard.com',
        role: 'ADMIN',
        provider: 'EMAIL',
      };
      saveUser(adminUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    saveUser(null);
  };

  const triggerNotification = (bookingId: string, userName: string, message: string, type: 'KAKAO' | 'SMS') => {
    const newLog: NotificationLog = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      bookingId,
      userName,
      type,
      message,
      sentAt: new Date().toISOString(),
    };
    setNotifications((prev) => {
      const updated = [newLog, ...prev];
      localStorage.setItem('comfort_notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const createBooking = (
    date: string,
    time: string,
    type: 'ROMANCE' | 'WEALTH' | 'OTHER',
    details: string,
    partnerAge?: string,
    jobStatus?: string
  ): boolean => {
    if (!currentUser) return false;

    // Check conflict
    const hasConflict = bookings.some(
      (b) => b.date === date && b.time === time && b.status !== 'CANCELED'
    );
    if (hasConflict) return false;

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone || '010-0000-0000',
      date,
      time,
      type,
      additionalInfo: {
        partnerAge,
        jobStatus,
        details,
      },
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    const updatedBookings = [newBooking, ...bookings];
    saveBookingsState(updatedBookings);

    // Trigger Admin notification
    const typeLabel = type === 'ROMANCE' ? '연애운' : type === 'WEALTH' ? '재물운' : '기타상담';
    triggerNotification(
      newBooking.id,
      currentUser.name,
      `[Taro for comfort 알람] 새로운 예약을 축하합니다! ${currentUser.name}님이 ${date} ${time} [${typeLabel}] 예약을 보냈습니다. 관리자 답변 후 확정됩니다.`,
      'KAKAO'
    );

    return true;
  };

  const cancelBooking = (bookingId: string) => {
    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        return { ...b, status: 'CANCELED' as BookingStatus };
      }
      return b;
    });
    saveBookingsState(updated);

    const target = bookings.find((b) => b.id === bookingId);
    if (target) {
      triggerNotification(
        bookingId,
        target.userName,
        `[Taro for comfort] ${target.userName}님의 ${target.date} ${target.time} 예약이 고객 요청으로 취소되었습니다.`,
        'SMS'
      );
    }
  };

  const updateBookingStatus = (bookingId: string, status: BookingStatus, adminMemo?: string) => {
    let targetUserAndDetails: { name: string; date: string; time: string; phone: string } | null = null;

    const updated = bookings.map((b) => {
      if (b.id === bookingId) {
        targetUserAndDetails = { name: b.userName, date: b.date, time: b.time, phone: b.userPhone };
        return {
          ...b,
          status,
          adminMemo: adminMemo !== undefined ? adminMemo : b.adminMemo,
        };
      }
      return b;
    });
    saveBookingsState(updated);

    if (targetUserAndDetails) {
      const { name, date, time } = targetUserAndDetails;
      let statusLabel = '';
      switch (status) {
        case 'CONFIRMED':
          statusLabel = '확정';
          break;
        case 'COMPLETED':
          statusLabel = '상담 완료';
          break;
        case 'CANCELED':
          statusLabel = '취소';
          break;
        case 'PENDING':
          statusLabel = '대기중';
          break;
      }

      // Automatically dispatch Kakao notification for status updates
      triggerNotification(
        bookingId,
        name,
        `[Taro for comfort 알림톡] 안녕하세요, ${name}님! 신청하신 ${date} ${time} 예약 상태가 [${statusLabel}](으)로 변경되었습니다. 마이페이지에서 상세 내용을 확인해보세요.`,
        'KAKAO'
      );
    }
  };

  const addReview = (rating: number, type: ConsultationType, content: string) => {
    if (!currentUser) return;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userName: currentUser.name.charAt(0) + '*' + (currentUser.name.slice(2) || currentUser.name.charAt(currentUser.name.length - 1)),
      rating,
      type,
      content,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [newReview, ...reviews];
    saveReviewsState(updatedReviews);
  };

  const clearNotifications = () => {
    saveNotificationsState([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        bookings,
        reviews,
        notifications,
        loginWithSocial,
        loginAsAdmin,
        logout,
        createBooking,
        cancelBooking,
        updateBookingStatus,
        addReview,
        clearNotifications,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
