export type UserRole = 'student' | 'instructor' | 'admin' | 'super_admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  wishlist: string[]; // Course IDs
  certificates: Certificate[];
  createdAt: string;
  status?: 'active' | 'suspended' | 'banned';
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  issuedAt: string;
  verificationUrl: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  durationMinutes: number;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  scorePercentage: number;
  correctCount: number;
  totalQuestions: number;
  completedAt: string;
  answers: { [questionId: string]: number }; // questionId -> chosen index
}

export interface VideoModule {
  id: string;
  title: string;
  videoUrl: string; // fallback placeholders
  durationSeconds: number;
}

export interface Chapter {
  id: string;
  title: string;
  modules: VideoModule[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  duration?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  instructorId: string;
  instructorName: string;
  chapters: Chapter[];
  highlights: string[];
  studentsCount: number;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CourseNote {
  id: string;
  userId: string;
  courseId: string;
  moduleId: string;
  videoTimeSeconds: number;
  text: string;
  createdAt: string;
}

export interface DiscussionThread {
  id: string;
  courseId: string | null; // null for global feed
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  likesCount: number;
  replies: DiscussionReply[];
  createdAt: string;
}

export interface DiscussionReply {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar: string;
  body: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  text: string;
  type: 'info' | 'success' | 'alert' | 'update';
  read: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed';
  paymentGateway: 'stripe' | 'razorpay';
  createdAt: string;
  invoiceId?: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  progressPercentage: number;
  completedModuleIds: string[];
  createdAt: string;
  isTrial?: boolean;
  trialStartDate?: string;
  lastSeenModuleId?: string;
  lastSeenPositionSeconds?: number;
}
