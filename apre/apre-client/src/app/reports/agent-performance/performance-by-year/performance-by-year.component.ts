import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { TableComponent } from '../../../shared/table/table.component';

@Component({
  selector: 'app-performance-by-year',
  standalone: true,
  imports: [ReactiveFormsModule, TableComponent],
  template: `
    <h1>Performance by Year</h1>
    <div class="performance-container">

      <!-- form for year selection -->
      <form class="form" [formGroup]="yearForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label for="year">Select Year:</label>
          <select class="select" formControlName="year" id="year" name="year" required>
            <option value="" disabled>Select a Year</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
          </select>
        </div>

        <div class="form__actions">
          <input type="submit" class="button button--primary" value="Generate Report" />
        </div>
      </form>

      <!-- div to display the data -->
      @if (performanceData.length > 0) {
        <div class="card chart-card">
          <app-table
            [title]="'Performance for ' + selectedYear"
            [data]="performanceData"
            [headers]="['agentID', 'performanceMetrics', 'callDuration', 'resolutionTime', 'customerFeedback']"
          >
          </app-table>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class PerformanceByYearComponent {
  yearForm: FormGroup;
  performanceData: any[] = [];
  selectedYear: number = 0;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.yearForm = this.fb.group({
      year: ['', Validators.required]
    });
  }

  onSubmit(): void {
    const year = this.yearForm.value.year;
    if (!year) return;
    this.selectedYear = year;
    this.http.get<any[]>(`/api/performanceByYear?year=${year}`).subscribe({
      next: (data: any[]) => {
        this.performanceData = data.map(item => ({
          agentID: item.agentId, // <-- fix: use agentId from API, mapped to agentID for table header
          performanceMetrics: item.performanceMetrics?.join(', ') || '',
          callDuration: item.callDuration,
          resolutionTime: item.resolutionTime,
          customerFeedback: item.customerFeedback?.join(', ') || '',
        }));
      },
      error: () => {
        this.performanceData = [];
      }
    });
  }
}