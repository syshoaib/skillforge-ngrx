import { createReducer, on } from '@ngrx/store';
import { userAdapter } from './user.adapter';
import * as UserActions from './user.action';
import { UserState } from './user.state';

export const initialState: UserState = userAdapter.getInitialState();

export const userReducer = createReducer(
  initialState,

  // Load Users
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.loadUsersSuccess, (state, { users }) =>
    userAdapter.setAll(users, { ...state, loading: false })
  ),
  on(UserActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add User
  on(UserActions.addUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.addUserSuccess, (state, { user }) =>
    userAdapter.addOne(user, { ...state, loading: false })
  ),
  on(UserActions.addUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update User (covers enroll, review, progress)
  on(UserActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.updateUserSuccess, (state, { user }) =>
    userAdapter.upsertOne(user, { ...state, loading: false })
  ),
  on(UserActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Remove User
  on(UserActions.removeUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(UserActions.removeUserSuccess, (state, { userId }) =>
    userAdapter.removeOne(userId, { ...state, loading: false })
  ),
  on(UserActions.removeUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
