import { Exam } from '../types';
import { INITIAL_QUESTIONS } from './questionsBank';

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam_moet_2025',
    title: 'Đề Thi Tốt Nghiệp THPT Môn Tin Học 2025 - Chuẩn Cấu Trúc Bộ GD&ĐT (Đề số 01)',
    description: 'Đề thi bám sát tuyệt đối định dạng cấu trúc đề thi Tốt nghiệp THPT từ năm 2025 của Bộ GD&ĐT: Gồm 24 câu trắc nghiệm nhiều phương án (Phần I) và 4 câu trắc nghiệm Đúng/Sai (Phần II).',
    durationMinutes: 50,
    year: 2025,
    targetTrack: 'ALL',
    totalPoints: 10.0,
    part1Count: 24,
    part2Count: 4,
    questions: INITIAL_QUESTIONS,
    createdBy: 'Bộ GD&ĐT / Tổ Khảo Thí Quốc Gia',
    createdAt: '2025-01-05',
    tags: ['Chuẩn Bộ GD&ĐT', 'Đề chính thức', 'Có Đúng/Sai', 'Toàn diện A-G'],
    isOfficial: true
  },
  {
    id: 'exam_chuyen_tin_2025',
    title: 'Đề Thi Thử Tốt Nghiệp THPT - Chuyên Tin Học & Ứng Dụng Số (Đề số 02)',
    description: 'Đề nâng cao rèn luyện kỹ năng phân tích cơ sở dữ liệu quan hệ (SQL) và tư duy thuật toán lập trình Python, tối ưu tốc độ làm bài.',
    durationMinutes: 50,
    year: 2025,
    targetTrack: 'BOTH' as any,
    totalPoints: 10.0,
    part1Count: 24,
    part2Count: 4,
    questions: [...INITIAL_QUESTIONS].reverse(),
    createdBy: 'Thầy Nguyễn Văn An - GV Chuyên Tin',
    createdAt: '2025-01-15',
    tags: ['Đề thử nghiệm', 'Nâng cao', 'Định hướng ICT & CS'],
    isOfficial: false
  },
  {
    id: 'exam_topic_e_f',
    title: 'Đề Chuyên Đề Trọng Tâm: Cơ Sở Dữ Liệu SQL & Lập Trình Python (Chủ đề E - F)',
    description: 'Đề thi tập trung chuyên sâu vào 2 phân môn quan trọng nhất chiếm tỷ trọng điểm cao trong kỳ thi tốt nghiệp.',
    durationMinutes: 35,
    year: 2025,
    targetTrack: 'ICT',
    totalPoints: 10.0,
    part1Count: 16,
    part2Count: 2,
    questions: INITIAL_QUESTIONS.filter(q => q.topicId === 'topic_e' || q.topicId === 'topic_f'),
    createdBy: 'Cô Trần Thị Mai - GV Tin Học',
    createdAt: '2025-01-20',
    tags: ['Chuyên đề E-F', 'SQL & Python', 'Luyện tập nhanh'],
    isOfficial: false
  }
];
