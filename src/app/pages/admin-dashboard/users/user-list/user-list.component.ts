import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, User } from '../../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  imports:[CommonModule],
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  paginatedUsers: User[] = [];
  currentPage: number = 1;
  pageSize: number = 5; // Users per page
  totalPages: number = 0;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data; // No need to filter, backend already returns only active users
        this.totalPages = Math.ceil(this.users.length / this.pageSize);
        this.updatePaginatedUsers();
      },
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  updatePaginatedUsers(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.users.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedUsers();
    }
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.softDeleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(user => user._id !== userId); // Remove user from UI
          this.totalPages = Math.ceil(this.users.length / this.pageSize);
          this.updatePaginatedUsers();
        },
        error: (err) => console.error('Error deleting user:', err)
      });
    }
  }
 
  onEdit(user: User): void {
    this.router.navigate(['/admin-dashboard/users', user._id, 'edit']);
  }
}
