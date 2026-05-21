export type ConsultationType = 'ROMANCE' | 'WEALTH' | 'CAREER' | 'NEWYEAR' | 'MARRIAGE' | 'REUNION' | 'ACADEMIC' | 'OTHER';

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  provider?: 'KAKAO' | 'NAVER' | 'EMAIL';
  phone?: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  type: ConsultationType;
  additionalInfo: {
    partnerAge?: string;
    jobStatus?: string;
    details: string;
  };
  status: BookingStatus;
  createdAt: string;
  adminMemo?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  type: ConsultationType;
  content: string;
  date: string;
}

export interface NotificationLog {
  id: string;
  bookingId: string;
  userName: string;
  type: 'KAKAO' | 'SMS';
  message: string;
  sentAt: string;
}
