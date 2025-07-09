import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserProfileComponent } from './components/user-profile/user-profile';
import { CourseCatalogComponent } from './components/course-catalog/course-catalog';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Store } from '@ngrx/store';
import * as UserActions from './store/users/user.action';
import * as CourseActions from './store/courses/course.action';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    CourseCatalogComponent,
    UserProfileComponent,
    MatToolbarModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'ngrx-assignment';
}
