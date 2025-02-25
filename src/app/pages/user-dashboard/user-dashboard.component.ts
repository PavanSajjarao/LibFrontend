import { Component } from '@angular/core';
import { BookListComponent } from "../user-dashboard/books/book-list/book-list.component";

@Component({
  selector: 'app-user-dashboard',
  imports: [BookListComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {

}
