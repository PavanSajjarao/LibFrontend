import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/signup/signup.component';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ModeratorDashboardComponent } from './pages/moderator-dashboard/moderator-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { BookListComponent } from './pages/admin-dashboard/books/book-list/book-list.component';
import { BookAddComponent } from './pages/admin-dashboard/books/book-add/book-add.component';
import { BookEditComponent } from './pages/admin-dashboard/books/book-edit/book-edit.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [AuthGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: 'moderator-dashboard', component: ModeratorDashboardComponent, canActivate: [AuthGuard] },
  // { path: '**', redirectTo: 'login' }, // Default redirect


  // admin/Book
  {
    path: 'admin-dashboard/books',
    component: BookListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dashboard/books/add',
    component: BookAddComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin-dashboard/books/:id/edit',
    component: BookEditComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', component: NotfoundComponent}
];