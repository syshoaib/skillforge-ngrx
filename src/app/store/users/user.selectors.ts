import { createFeatureSelector, createSelector } from '@ngrx/store';
import { userAdapter } from './user.adapter';
import { UserState } from './user.state';

export const selectUserState = createFeatureSelector<UserState>('users');
const { selectAll, selectEntities } = userAdapter.getSelectors();

export const selectAllUsers = createSelector(selectUserState, selectAll);
export const selectUserEntities = createSelector(
  selectUserState,
  selectEntities
);

export const selectUserById = (userId: string) =>
  createSelector(selectUserEntities, (entities) => entities[userId]);

export const selectUserEnrolledCourses = (userId: string) =>
  createSelector(
    selectUserById(userId),
    (user) => user?.enrolledCourseIds ?? []
  );

export const selectUserReviews = (userId: string) =>
  createSelector(selectUserById(userId), (user) => user?.reviews ?? []);
