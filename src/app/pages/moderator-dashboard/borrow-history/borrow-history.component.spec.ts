import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowHistoryComponent } from './borrow-history.component';

describe('BorrowHistoryComponent', () => {
  let component: BorrowHistoryComponent;
  let fixture: ComponentFixture<BorrowHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrowHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrowHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
