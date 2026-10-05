export interface Feedback {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  timestamp: string;
}

export const feedbackData: Feedback[] = [];
