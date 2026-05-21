import { Review, Booking } from './types.ts';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userName: '김*현',
    rating: 5,
    type: 'ROMANCE',
    content: '그 사람의 진짜 속마음이 도통 보이지 않아 혼자 앓고만 있었습니다. 리딩을 통해 상대방의 한 발 물러선 이유와 심리를 이해하고 나서, 조언받은 타이밍에 맞춰 연락했더니 놀랍도록 솔직한 답변을 받았습니다. 단순한 타로가 아니라 마음의 지도를 선물받은 기분입니다.',
    date: '2026-05-18'
  },
  {
    id: 'rev-2',
    userName: '이*준',
    rating: 5,
    type: 'WEALTH',
    content: '사업 도약기를 앞두고 동업 제안이 들어와 고민이 많았습니다. 현실적인 리스크 요인을 미리 짚어주시고 무리한 확장 대신 시기를 조율하라는 조언이 적중했습니다. 리스크를 정확하게 우회하여 최선의 기회를 잡을 수 있었습니다. 실전형 조언의 가치를 알게 되었네요.',
    date: '2026-05-17'
  },
  {
    id: 'rev-3',
    userName: '최*아',
    rating: 5,
    type: 'ROMANCE',
    content: '서로 어긋나는 대화 패턴에 지쳐 포기하려던 찰나에 상담을 받았습니다. 우리가 어긋나던 타이밍의 원인과 해결책을 구체적으로 알려주셔서, 상대에게 더 깊은 신뢰를 심어줄 수 있는 대화를 시작했습니다. 정말 감사한 상담이었습니다.',
    date: '2026-05-15'
  },
  {
    id: 'rev-4',
    userName: '박*호',
    rating: 5,
    type: 'WEALTH',
    content: '막연히 대박이 날 거라는 달콤한 말이 아니라, 피해야 할 투자처와 적극적으로 승부수를 띄워야 하는 정확한 달(Month)을 계산해 조언해 주셔서 큰 도움이 되었습니다. 계획 수립에 필수적인 이정표가 되었습니다.',
    date: '2026-05-10'
  },
  {
    id: 'rev-5',
    userName: '윤*민',
    rating: 5,
    type: 'CAREER',
    content: '이직 제안이 와서 심리적으로 크게 흔들렸을 때 커리어 패스와 제 운의 흐름을 정확히 짚어주셨어요. 지금 회사에서의 기회와 이직할 곳의 내부 성향을 면밀히 비교해 주시며 조언해 주신 덕에 후회 없는 완벽한 흐름의 이직 선택을 내렸습니다.',
    date: '2026-05-20'
  },
  {
    id: 'rev-6',
    userName: '송*지',
    rating: 5,
    type: 'NEWYEAR',
    content: '매년 신년운세를 보지만 사주와 타로의 융합 및 오행 분석까지 깊이 있게 짚어준 곳은 처음이에요. 올해 조심해야 할 달과 추진해야 할 달을 월별로 정교하게 알려주셔서 달력에 표시해두고 유용하게 지표로 삼고 있습니다.',
    date: '2026-05-19'
  },
  {
    id: 'rev-7',
    userName: '정*우',
    rating: 5,
    type: 'MARRIAGE',
    content: '결혼을 앞두고 현실적인 가치 조율 갈등이 많았는데, 단순한 성격 궁합을 넘어 두 사람의 다름을 어떻게 대화로 풀어야 하는지 구체적인 소통법을 제시해 주셨습니다. 결혼식 준비 과정의 든든한 등대 같은 시간이었습니다.',
    date: '2026-05-16'
  },
  {
    id: 'rev-8',
    userName: '한*서',
    rating: 5,
    type: 'REUNION',
    content: '이별 후 오랜 시간 마음 정리를 못 하고 있었는데, 상대의 진짜 속마음 상태와 재회 연락운이 강하게 작용하는 완벽한 시기를 알려주셨어요. 거짓말같이 그 조언받은 타이밍에 맞춰 다시 서서히 연결되어 기적 같은 만남을 가꿔가고 있습니다.',
    date: '2026-05-14'
  },
  {
    id: 'rev-9',
    userName: '강*우',
    rating: 5,
    type: 'ACADEMIC',
    content: '중요한 시험을 앞두고 집중력이 계속 무너져서 정신적으로 번아웃 직전이었습니다. 제 타고난 사주 학업운의 성패 흐름과 멘탈 관리 명상을 함께 코칭해 주셔서 큰 정신적 위안을 받았고, 무사히 합격의 영예를 안을 수 있었습니다.',
    date: '2026-05-12'
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book-1',
    userId: 'user-id-1',
    userName: '박지희',
    userPhone: '010-4481-2910',
    date: '2026-05-22',
    time: '11:30',
    type: 'ROMANCE',
    additionalInfo: {
      partnerAge: '28',
      jobStatus: '직장인 (연애 2년 차)',
      details: '남자친구와의 잦은 갈등으로 인해 현재 서로 연락을 잠시 쉬고 있는 상태입니다. 진짜 상대방의 속마음과 다시 잘해볼 수 있는 소통의 완벽한 타이밍을 알고 싶습니다.'
    },
    status: 'CONFIRMED',
    createdAt: '2026-05-20T10:14:00Z',
    adminMemo: '갈등 해결 및 소통 타이밍 중심으로 리딩 준비. 상대방 성향별 대화법 카드 준비.'
  },
  {
    id: 'book-2',
    userId: 'user-id-2',
    userName: '정우성',
    userPhone: '010-8839-4411',
    date: '2026-05-22',
    time: '14:30',
    type: 'WEALTH',
    additionalInfo: {
      jobStatus: '스타트업 공동창업 준비 중',
      details: '올해 하반기 법인 설립 예정입니다. 최적의 투자 유치 시기와 사주상 조심해야 할 리스크 관리 방향성에 대해 구체적인 리딩이 필요합니다.'
    },
    status: 'PENDING',
    createdAt: '2026-05-21T06:45:00Z'
  },
  {
    id: 'book-3',
    userId: 'user-id-3',
    userName: '강민아',
    userPhone: '010-2211-5509',
    date: '2026-05-20',
    time: '16:00',
    type: 'ROMANCE',
    additionalInfo: {
      partnerAge: '31',
      jobStatus: '프리랜서 디자이너',
      details: '최근에 알게 된 분과 썸을 타고 있는데, 이 관계가 진짜 깊어질 수 있을지 상대의 심리가 알고 싶습니다.'
    },
    status: 'COMPLETED',
    createdAt: '2026-05-19T09:20:00Z',
    adminMemo: '썸 타는 기간과 호감 단계 심도 리딩 진행 완료. 긍정적인 신호 분석.'
  }
];

export const TIME_SLOTS = [
  '10:00',
  '11:30',
  '13:00',
  '14:30',
  '16:00',
  '17:30',
  '19:00',
  '20:30'
];
