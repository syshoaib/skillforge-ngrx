import { createAction, props } from '@ngrx/store';
import { Course } from '../../models/course.model';

// --- Load Courses ---
export const loadCourses = createAction('[Course] Load Courses');
export const loadCoursesSuccess = createAction(
  '[Course] Load Courses Success',
  props<{ courses: Course[] }>()
);
export const loadCoursesFailure = createAction(
  '[Course] Load Courses Failure',
  props<{ error: any }>()
);

// --- Add Course ---
export const addCourse = createAction(
  '[Course] Add Course',
  props<{ course: Course }>()
);
export const addCourseSuccess = createAction(
  '[Course] Add Course Success',
  props<{ course: Course }>()
);
export const addCourseFailure = createAction(
  '[Course] Add Course Failure',
  props<{ error: any }>()
);

// --- Update Course ---
export const updateCourse = createAction(
  '[Course] Update Course',
  props<{ course: Course }>()
);
export const updateCourseSuccess = createAction(
  '[Course] Update Course Success',
  props<{ course: Course }>()
);
export const updateCourseFailure = createAction(
  '[Course] Update Course Failure',
  props<{ error: any }>()
);

// --- Remove Course ---
export const removeCourse = createAction(
  '[Course] Remove Course',
  props<{ courseId: string }>()
);
export const removeCourseSuccess = createAction(
  '[Course] Remove Course Success',
  props<{ courseId: string }>()
);
export const removeCourseFailure = createAction(
  '[Course] Remove Course Failure',
  props<{ error: any }>()
);

// --- Add Course Comment ---
export const addCourseComment = createAction(
  '[Course] Add Course Comment',
  props<{ courseId: string; userId: string; comment: string; date: string }>()
);
export const addCourseCommentSuccess = createAction(
  '[Course] Add Course Comment Success',
  props<{ course: Course }>()
);
export const addCourseCommentFailure = createAction(
  '[Course] Add Course Comment Failure',
  props<{ error: any }>()
);
