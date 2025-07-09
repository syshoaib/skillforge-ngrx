import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

// --- Load Users ---
export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction(
  '[User] Load Users Success',
  props<{ users: User[] }>()
);
export const loadUsersFailure = createAction(
  '[User] Load Users Failure',
  props<{ error: any }>()
);

// --- Add User ---
export const addUser = createAction('[User] Add User', props<{ user: User }>());
export const addUserSuccess = createAction(
  '[User] Add User Success',
  props<{ user: User }>()
);
export const addUserFailure = createAction(
  '[User] Add User Failure',
  props<{ error: any }>()
);

// --- Update User ---
export const updateUser = createAction(
  '[User] Update User',
  props<{ user: User }>()
);
export const updateUserSuccess = createAction(
  '[User] Update User Success',
  props<{ user: User }>()
);
export const updateUserFailure = createAction(
  '[User] Update User Failure',
  props<{ error: any }>()
);

// --- Remove User ---
export const removeUser = createAction(
  '[User] Remove User',
  props<{ userId: string }>()
);
export const removeUserSuccess = createAction(
  '[User] Remove User Success',
  props<{ userId: string }>()
);
export const removeUserFailure = createAction(
  '[User] Remove User Failure',
  props<{ error: any }>()
);

// --- Enroll User in Course ---
export const enrollUserInCourse = createAction(
  '[User] Enroll User In Course',
  props<{ userId: string; courseId: string }>()
);

// --- Add Course Review ---
export const addCourseReview = createAction(
  '[User] Add Course Review',
  props<{ userId: string; courseId: string; review: string; rating: number }>()
);

// --- Update User Progress ---
export const updateUserProgress = createAction(
  '[User] Update User Progress',
  props<{ userId: string; courseId: string; completedModules: number }>()
);
