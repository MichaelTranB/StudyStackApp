import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'places/tabs/dashboard', pathMatch: 'full' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthPageModule) },
  {
    path: 'places',
    loadChildren: () => import('./places/places.module').then(m => m.PlacesPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'bookings',
    loadChildren: () => import('./bookings/bookings.module').then(m => m.BookingsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'flashcard',
    loadChildren: () => import('./dashboard/flashcard/flashcard.module').then(m => m.FlashcardPageModule)
  },
  {
    path: 'login', 
    loadChildren: () => import("./auth/auth.module").then(m => m.AuthPageModule)
  },
  {
    path: 'community',
    loadChildren: () => import('./community/community.module').then(m => m.CommunityPageModule)
  },
  {
    path: 'courses',
    loadChildren: () => import('./shared/courses.module').then(m => m.CoursesModule) // Import practice, study, and quiz here
  },
  {
    path: 'course-topics/:courseId',  // Update this path to include courseId as a parameter
    loadChildren: () => import('./course-topics/course-topics.module').then(m => m.CourseTopicsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}