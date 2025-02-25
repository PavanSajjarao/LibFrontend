import { Component } from '@angular/core';
import { UserDashboardComponent } from "../user-dashboard/user-dashboard.component";

@Component({
  selector: 'app-home',
  imports: [UserDashboardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
