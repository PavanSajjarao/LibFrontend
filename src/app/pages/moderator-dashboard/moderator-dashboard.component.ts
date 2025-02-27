import { Component } from '@angular/core';
import { BorrowHistoryComponent } from "./borrow-history/borrow-history.component";

@Component({
  selector: 'app-moderator-dashboard',
  imports: [BorrowHistoryComponent],
  templateUrl: './moderator-dashboard.component.html',
  styleUrl: './moderator-dashboard.component.css'
})
export class ModeratorDashboardComponent {

}
