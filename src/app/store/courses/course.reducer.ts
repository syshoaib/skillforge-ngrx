import { createReducer, on } from '@ngrx/store';
import { courseAdapter } from './course.adapter';
import * as CourseActions from './course.action';
import * as UserActions from '../users/user.action';
import { CourseState } from './course.state';

export const initialState: CourseState = courseAdapter.getInitialState();

export const courseReducer = createReducer(
  initialState,

  // Load Courses
  on(CourseActions.loadCourses, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CourseActions.loadCoursesSuccess, (state, { courses }) =>
    courseAdapter.setAll(courses, { ...state, loading: false })
  ),
  on(CourseActions.loadCoursesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add Course
  on(CourseActions.addCourse, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CourseActions.addCourseSuccess, (state, { course }) =>
    courseAdapter.addOne(course, { ...state, loading: false })
  ),
  on(CourseActions.addCourseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Course (covers comments, reviews, enrollment updates)
  on(CourseActions.updateCourse, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CourseActions.updateCourseSuccess, (state, { course }) =>
    courseAdapter.upsertOne(course, { ...state, loading: false })
  ),
  on(CourseActions.updateCourseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Remove Course
  on(CourseActions.removeCourse, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(CourseActions.removeCourseSuccess, (state, { courseId }) =>
    courseAdapter.removeOne(courseId, { ...state, loading: false })
  ),
  on(CourseActions.removeCourseFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
