import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { selectAllCourses } from '../../store/courses/course.selectors';
import { MatListModule } from '@angular/material/list';
import * as CourseActions from '../../store/courses/course.action';
import * as UserActions from '../../store/users/user.action';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-course-catalog',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
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
  templateUrl: './course-catalog.html',
  styleUrls: ['./course-catalog.scss'],
})
export class CourseCatalogComponent {
  private store = inject(Store);
  courses$ = this.store.select(selectAllCourses);
  currentUserId = 'u1'; // Or use @Input() as shown above
  today = new Date().toISOString().slice(0, 10);
  private snackBar = inject(MatSnackBar);

  // Methods to dispatch add review/comment actions
  ngOnInit() {
    this.store.dispatch(CourseActions.loadCourses());
  }

  addComment(courseId: string, userId: string, comment: string, date: string) {
    if (!comment || !comment.trim()) {
      this.snackBar.open('Comment cannot be empty', 'Close', {
        duration: 2000,
      });
      return;
    }
    this.store.dispatch(
      CourseActions.addCourseComment({ courseId, userId, comment, date })
    );
    this.snackBar.open('Comment added!', 'Close', { duration: 1500 });
  }
}
