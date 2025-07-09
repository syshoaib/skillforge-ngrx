export interface Course {
  id: string;
  title: string;
  author: string;
  enrolledUserIds: string[];
  reviews: {
    userId: string;
    review: string;
    rating: number;
  }[];
  comments: {
    userId: string;
    comment: string;
    date: string;
  }[];
  rating: number; // average
  totalEnrolled: number;
  totalHours: number;
}
