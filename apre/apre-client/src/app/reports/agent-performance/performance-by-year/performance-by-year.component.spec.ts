import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerformanceByYearComponent } from './performance-by-year.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PerformanceByYearComponent', () => {
  let component: PerformanceByYearComponent;
  let fixture: ComponentFixture<PerformanceByYearComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      declarations: [PerformanceByYearComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PerformanceByYearComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with a year control', () => {
    expect(component.yearForm.contains('year')).toBeTrue();
  });

  it('should set selectedYear and fetch performance data on form submit', () => {
    component.yearForm.setValue({ year: 2023 });
    component.onSubmit();

    const req = httpMock.expectOne('/api/performanceByYear?year=2023');
    expect(req.request.method).toBe('GET');
    req.flush([{ agentId: 1, performanceMetrics: ['metric1'], callDuration: 30, resolutionTime: 5, customerFeedback: ['good'] }]);

    expect(component.selectedYear).toBe(2023);
    expect(component.performanceData.length).toBe(1);
    expect(component.performanceData[0].agentID).toBe(1);
  });

  it('should handle error and reset performance data on HTTP error', () => {
    component.yearForm.setValue({ year: 2023 });
    component.onSubmit();

    const req = httpMock.expectOne('/api/performanceByYear?year=2023');
    req.error(new ErrorEvent('Network error'));

    expect(component.performanceData.length).toBe(0);
  });
});
