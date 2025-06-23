import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackBySalespersonComponent } from './feedback-by-salesperson.component';

describe('FeedbackBySalespersonComponent', () => {
  let component: FeedbackBySalespersonComponent;
  let fixture: ComponentFixture<FeedbackBySalespersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackBySalespersonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackBySalespersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
