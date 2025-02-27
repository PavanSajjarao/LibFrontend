import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BorrowService } from '../../../services/borrow.service';
import { CommonModule } from '@angular/common';
import { DateFormatService } from '../../../services/date-format.service';

@Component({
  imports: [CommonModule],
  selector: 'app-borrow-history',
  templateUrl: './borrow-history.component.html',
  styleUrls: ['./borrow-history.component.css']
})
export class BorrowHistoryComponent implements OnInit {
  borrowHistory: any[] = [];
  paginatedHistory: any[] = [];
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  selectedFormat: string = 'MM/dd/yyyy';

  constructor(private borrowService: BorrowService, private router: Router, private dateFormatService: DateFormatService) {}

  ngOnInit(): void {
    this.loadBorrowHistory();
    this.dateFormatService.dateFormat$.subscribe(format => {
      this.selectedFormat = format;
    });
  }

  loadBorrowHistory(): void {
    this.borrowService.getAllBorrowHistory().subscribe({
      next: (data) => {
        this.borrowHistory = data;
        this.totalPages = Math.ceil(this.borrowHistory.length / this.pageSize);
        this.updatePaginatedHistory();
      },
      error: (err) => console.error('Error fetching borrow history:', err)
    });
  }

  updatePaginatedHistory(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedHistory = this.borrowHistory.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedHistory();
    }
  }
}
