import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookAddComponent } from './book-add.component';

describe('BookAddComponent', () => {
  let component: BookAddComponent;
  let fixture: ComponentFixture<BookAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
