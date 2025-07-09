export interface User {
  id: string;
  email: string;
  enrolledCourseIds: {
    courseId: string;
    progress: {
      completedModules: number;
      totalModules: number;
    };
  }[];
  reviews: {
    courseId: string;
    review: string;
    rating: number;
  }[];
}
