import { createFeatureSelector, createSelector } from '@ngrx/store';
import { courseAdapter } from './course.adapter';
import { CourseState } from './course.state';

export const selectCourseState = createFeatureSelector<CourseState>('courses');
const { selectAll, selectEntities } = courseAdapter.getSelectors();

export const selectAllCourses = createSelector(selectCourseState, selectAll);
export const selectCourseEntities = createSelector(
  selectCourseState,
  selectEntities
);

export const selectCourseById = (courseId: string) =>
  createSelector(selectCourseEntities, (entities) => entities[courseId]);

export const selectCourseReviews = (courseId: string) =>
  createSelector(selectCourseById(courseId), (course) => course?.reviews ?? []);

export const selectCourseComments = (courseId: string) =>
  createSelector(
    selectCourseById(courseId),
    (course) => course?.comments ?? []
  );

export const selectAverageRating = (courseId: string) =>
  createSelector(selectCourseById(courseId), (course) => course?.rating ?? 0);
