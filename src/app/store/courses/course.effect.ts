import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CourseActions from './course.action';
import * as UserActions from '../users/user.action';
import { CourseService } from '../../services/course.service';
import { UserService } from '../../services/user.service';
import {
  mergeMap,
  map,
  catchError,
  withLatestFrom,
  switchMap,
} from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCourseById } from './course.selectors';
import { selectUserById } from '../users/user.selectors';
import { Course } from '../../models/course.model';
import { User } from '../../models/user.model';

@Injectable()
export class CourseEffects {
  constructor(
    private actions$: Actions,
    private courseService: CourseService,
    private userService: UserService,
    private store: Store
  ) {}

  // 1. Load all courses
  loadCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.loadCourses),
      mergeMap(() =>
        this.courseService.getCourses().pipe(
          map((courses) => CourseActions.loadCoursesSuccess({ courses })),
          catchError((error) => of(CourseActions.loadCoursesFailure({ error })))
        )
      )
    )
  );

  // 2. Add course
  addCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.addCourse),
      mergeMap((action) =>
        this.courseService.addCourse(action.course).pipe(
          map((course) => CourseActions.addCourseSuccess({ course })),
          catchError((error) => of(CourseActions.addCourseFailure({ error })))
        )
      )
    )
  );

  // 3. Update course
  updateCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.updateCourse),
      mergeMap((action) =>
        this.courseService.updateCourse(action.course).pipe(
          map((course) => CourseActions.updateCourseSuccess({ course })),
          catchError((error) =>
            of(CourseActions.updateCourseFailure({ error }))
          )
        )
      )
    )
  );

  // 4. Remove course
  removeCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.removeCourse),
      mergeMap((action) =>
        this.courseService.deleteCourse(action.courseId).pipe(
          map(() =>
            CourseActions.removeCourseSuccess({ courseId: action.courseId })
          ),
          catchError((error) =>
            of(CourseActions.removeCourseFailure({ error }))
          )
        )
      )
    )
  );

  // 5. Enroll user in course (two-way sync)
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
            // Update user
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
              switchMap(() =>
                this.courseService.getCourse(action.courseId).pipe(
                  switchMap((course) => {
                    if (!course)
                      return of(
                        CourseActions.updateCourseFailure({
                          error: 'Course not found',
                        })
                      );
                    // Update course
                    const updatedCourse: Course = {
                      ...course,
                      enrolledUserIds: [
                        ...course.enrolledUserIds,
                        action.userId,
                      ],
                      totalEnrolled: course.totalEnrolled + 1,
                    };
                    return this.courseService.updateCourse(updatedCourse).pipe(
                      map(() =>
                        CourseActions.updateCourseSuccess({
                          course: updatedCourse,
                        })
                      ),
                      catchError((error) =>
                        of(CourseActions.updateCourseFailure({ error }))
                      )
                    );
                  })
                )
              ),
              catchError((error) =>
                of(UserActions.updateUserFailure({ error }))
              )
            );
          })
        )
      )
    )
  );

  // 6. Add course review (two-way sync)
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
            // Update user's reviews
            const updatedUser: User = {
              ...user,
              reviews: [
                ...user.reviews.filter((r) => r.courseId !== action.courseId),
                {
                  courseId: action.courseId,
                  review: action.review,
                  rating: action.rating,
                },
              ],
            };
            return this.userService.updateUser(updatedUser).pipe(
              switchMap(() =>
                this.courseService.getCourse(action.courseId).pipe(
                  switchMap((course) => {
                    if (!course)
                      return of(
                        CourseActions.updateCourseFailure({
                          error: 'Course not found',
                        })
                      );
                    // Update course's reviews and average rating
                    const updatedReviews = [
                      ...course.reviews.filter(
                        (r) => r.userId !== action.userId
                      ),
                      {
                        userId: action.userId,
                        review: action.review,
                        rating: action.rating,
                      },
                    ];
                    const avgRating =
                      updatedReviews.length > 0
                        ? updatedReviews.reduce((sum, r) => sum + r.rating, 0) /
                          updatedReviews.length
                        : 0;
                    const updatedCourse: Course = {
                      ...course,
                      reviews: updatedReviews,
                      rating: avgRating,
                    };
                    return this.courseService.updateCourse(updatedCourse).pipe(
                      map(() =>
                        CourseActions.updateCourseSuccess({
                          course: updatedCourse,
                        })
                      ),
                      catchError((error) =>
                        of(CourseActions.updateCourseFailure({ error }))
                      )
                    );
                  })
                )
              ),
              catchError((error) =>
                of(UserActions.updateUserFailure({ error }))
              )
            );
          })
        )
      )
    )
  );

  // 7. Add course comment
  addCourseComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.addCourseComment),
      mergeMap((action) =>
        this.courseService.getCourse(action.courseId).pipe(
          switchMap((course) => {
            if (!course)
              return of(
                CourseActions.updateCourseFailure({ error: 'Course not found' })
              );
            const updatedComments = [
              ...course.comments,
              {
                userId: action.userId,
                comment: action.comment,
                date: action.date,
              },
            ];
            const updatedCourse: Course = {
              ...course,
              comments: updatedComments,
            };
            return this.courseService.updateCourse(updatedCourse).pipe(
              map(() =>
                CourseActions.updateCourseSuccess({ course: updatedCourse })
              ),
              catchError((error) =>
                of(CourseActions.updateCourseFailure({ error }))
              )
            );
          })
        )
      )
    )
  );

  // 8. Update user progress in a course
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
              map(() => UserActions.updateUserSuccess({ user: updatedUser })),
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
