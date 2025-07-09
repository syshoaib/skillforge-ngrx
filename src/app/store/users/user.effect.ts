import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UserActions from './user.action';
import { UserService } from '../../services/user.service';
import { mergeMap, map, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable()
export class UserEffects {
  // constructor(private actions$: Actions, private userService: UserService) {}
  private actions$ = inject(Actions);
  private userService = inject(UserService);

  // 1. Load all users
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(() =>
        this.userService.getUsers().pipe(
          map((users) => UserActions.loadUsersSuccess({ users })),
          catchError((error) => of(UserActions.loadUsersFailure({ error })))
        )
      )
    )
  );

  // 2. Add user
  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addUser),
      mergeMap((action) =>
        this.userService.addUser(action.user).pipe(
          map((user) => UserActions.addUserSuccess({ user })),
          catchError((error) => of(UserActions.addUserFailure({ error })))
        )
      )
    )
  );

  // 3. Update user
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUser),
      mergeMap((action) =>
        this.userService.updateUser(action.user).pipe(
          map((user) => UserActions.updateUserSuccess({ user })),
          catchError((error) => of(UserActions.updateUserFailure({ error })))
        )
      )
    )
  );

  // 4. Remove user
  removeUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.removeUser),
      mergeMap((action) =>
        this.userService.deleteUser(action.userId).pipe(
          map(() => UserActions.removeUserSuccess({ userId: action.userId })),
          catchError((error) => of(UserActions.removeUserFailure({ error })))
        )
      )
    )
  );

  // 5. Enroll user in course (user side only, course side handled in course.effects)
  enrollUserInCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.enrollUserInCourse),
      mergeMap((action) =>
        this.userService.getUser(action.userId).pipe(
          switchMap((user) => {
            if (!user)
              return of(
                UserActions.updateUserFailure({ error: 'User not found' })
              );
            if (
              user.enrolledCourseIds.some((e) => e.courseId === action.courseId)
            )
              return of(UserActions.updateUserSuccess({ user })); // Already enrolled
            const updatedUser: User = {
              ...user,
              enrolledCourseIds: [
                ...user.enrolledCourseIds,
                {
                  courseId: action.courseId,
                  progress: { completedModules: 0, totalModules: 10 },
                },
              ],
            };
            return this.userService.updateUser(updatedUser).pipe(
              map((user) => UserActions.updateUserSuccess({ user })),
              catchError((error) =>
                of(UserActions.updateUserFailure({ error }))
              )
            );
          })
        )
      )
    )
  );

  // 6. Add course review (user side only, course side handled in course.effects)
  addCourseReview$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.addCourseReview),
      mergeMap((action) =>
        this.userService.getUser(action.userId).pipe(
          switchMap((user) => {
            if (!user)
              return of(
                UserActions.updateUserFailure({ error: 'User not found' })
              );
            const updatedReviews = [
              ...user.reviews.filter((r) => r.courseId !== action.courseId),
              {
                courseId: action.courseId,
                review: action.review,
                rating: action.rating,
              },
            ];
            const updatedUser: User = {
              ...user,
              reviews: updatedReviews,
            };
            return this.userService.updateUser(updatedUser).pipe(
              map((user) => UserActions.updateUserSuccess({ user })),
              catchError((error) =>
                of(UserActions.updateUserFailure({ error }))
              )
            );
          })
        )
      )
    )
  );

  // 7. Update user progress
  updateUserProgress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.updateUserProgress),
      mergeMap((action) =>
        this.userService.getUser(action.userId).pipe(
          switchMap((user) => {
            if (!user)
              return of(
                UserActions.updateUserFailure({ error: 'User not found' })
              );
            const updatedEnrolled = user.enrolledCourseIds.map((e) =>
              e.courseId === action.courseId
                ? {
                    ...e,
                    progress: {
                      ...e.progress,
                      completedModules: action.completedModules,
                    },
                  }
                : e
            );
            const updatedUser: User = {
              ...user,
              enrolledCourseIds: updatedEnrolled,
            };
            return this.userService.updateUser(updatedUser).pipe(
              map((user) => UserActions.updateUserSuccess({ user })),
              catchError((error) =>
                of(UserActions.updateUserFailure({ error }))
              )
            );
          })
        )
      )
    )
  );
}
