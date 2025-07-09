import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import {
  selectUserById,
  selectUserEnrolledCourses,
  selectUserReviews,
} from '../../store/users/user.selectors';
import { combineLatest, map, Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { MatListModule } from '@angular/material/list';
import * as UserActions from '../../store/users/user.action';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { selectAllCourses } from '../../store/courses/course.selectors';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './user-profile.html',
})
export class UserProfileComponent {
  private store = inject(Store);
  private snackBar = inject(MatSnackBar);

  userId = 'u1'; // Hardcoded for simulation

  user$!: Observable<User | undefined>;
  enrolledCourses$!: Observable<any[]>;
  enrolledCoursesWithTitle$!: Observable<any[]>;
  reviews$!: Observable<any[]>;
  allCourses$ = this.store.select(selectAllCourses);

  ngOnInit() {
    this.store.dispatch(UserActions.loadUsers());
    this.user$ = this.store.select(selectUserById(this.userId));
    this.enrolledCourses$ = this.store.select(
      selectUserEnrolledCourses(this.userId)
    );
    this.enrolledCoursesWithTitle$ = combineLatest([
      this.enrolledCourses$,
      this.allCourses$,
    ]).pipe(
      map(([enrolled, allCourses]) =>
        enrolled.map((ec) => ({
          ...ec,
          title:
            allCourses.find((c) => c.id === ec.courseId)?.title || ec.courseId,
        }))
      )
    );
    this.reviews$ = this.store.select(selectUserReviews(this.userId));
  }

  enrollInCourse(courseId: string) {
    this.store.dispatch(
      UserActions.enrollUserInCourse({ userId: this.userId, courseId })
    );
    this.snackBar.open('Enrolled in course!', 'Close', { duration: 1500 });
  }

  addReview(courseId: string, review: string, rating: number) {
    this.store.dispatch(
      UserActions.addCourseReview({
        userId: this.userId,
        courseId,
        review,
        rating,
      })
    );
    this.snackBar.open('Review added!', 'Close', { duration: 1500 });
  }

  updateProgress(courseId: string, completedModules: number) {
    this.store.dispatch(
      UserActions.updateUserProgress({
        userId: this.userId,
        courseId,
        completedModules,
      })
    );
    this.snackBar.open('Progress updated!', 'Close', { duration: 1500 });
  }
}
