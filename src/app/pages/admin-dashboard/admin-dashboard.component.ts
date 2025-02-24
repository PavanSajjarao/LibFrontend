import { Component } from '@angular/core';
import { BookListComponent } from "./books/book-list/book-list.component";

@Component({
  selector: 'app-admin-dashboard',
  imports: [BookListComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

}
