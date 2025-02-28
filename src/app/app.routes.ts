import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { SignUpComponent } from './pages/signup/signup.component';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ModeratorDashboardComponent } from './pages/moderator-dashboard/moderator-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { BookListComponent } from './pages/admin-dashboard/books/book-list/book-list.component';
import { BookAddComponent } from './pages/admin-dashboard/books/book-add/book-add.component';
import { BookEditComponent } from './pages/admin-dashboard/books/book-edit/book-edit.component';
import { HomeComponent } from './pages/home/home.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { UserListComponent } from './pages/admin-dashboard/users/user-list/user-list.component';
import { UserEditComponent } from './pages/admin-dashboard/users/user-edit/user-edit.component';
import { MyBorrowsComponent } from './pages/user-dashboard/borrow/myborrows/myborrows.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redirects '/' to '/home'
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },

 //UserRoutes

  { path: 'home', component: HomeComponent, canActivate: [AuthGuard , RoleGuard], data: { roles: ['user'] }},
  // { path: 'user-dashboard', component: UserDashboardComponent, canActivate: [AuthGuard , RoleGuard] , data: { roles: ['user'] }},
  {path:'user-dashboard/myborrows' , component:MyBorrowsComponent , canActivate:[AuthGuard , RoleGuard] , data: { roles: ['user'] }},

  //Moderate Routes

  { path: 'moderator-dashboard', component: ModeratorDashboardComponent, canActivate: [AuthGuard , RoleGuard] , data: { roles: ['moderator'] } },

  //ADMIN[Books]
  // { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard , RoleGuard] , data: { roles: ['admin'] } },
  { path: 'admin-dashboard/books', component: BookListComponent, canActivate: [AuthGuard , RoleGuard] , data: { roles: ['admin'] } },
  { path: 'admin-dashboard/books/add', component: BookAddComponent, canActivate: [AuthGuard , RoleGuard] , data: { roles: ['admin'] } },
  { path: 'admin-dashboard/books/:id/edit', component: BookEditComponent, canActivate: [AuthGuard , RoleGuard] , data: { roles: ['admin'] } },

  // Admin[Users]
  { path: 'admin-dashboard/users', component: UserListComponent, canActivate: [AuthGuard , RoleGuard] , data: { roles: ['admin'] } },
  { path: 'admin-dashboard/users/:id/edit', component: UserEditComponent, canActivate: [AuthGuard , RoleGuard] , data: { roles: ['admin'] } },
 
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', component: NotfoundComponent } // Handles unknown routes
];
