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
            [headers]="headers"
            [sortableColumns]="headers"
            [recordsPerPage]="10"
            [headerBackground]="'primary'"
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
  selectedYear: string = '';
  // Map backend field names to headers as used in table.component.ts
  headers: string[] = ['agentId', 'performanceMetrics', 'callDuration', 'resolutionTime', 'customerFeedback'];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.yearForm = this.fb.group({
      year: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.yearForm.valid) {
      const year = this.yearForm.value.year;
      this.selectedYear = year;
      this.getPerformanceByYear(year);
    }
  }

  getPerformanceByYear(year: string): void {
    // Adjust the API URL as needed for your environment
    this.http.get<any[]>(`/api/reports/agent-performance/performanceByYear?year=${year}`).subscribe({
      next: (data) => {
        // Ensure the data has the correct property names expected by the table (agentId vs agentID)
        this.performanceData = (data || []).map(row => ({
          agentId: row.agentId,
          performanceMetrics: row.performanceMetrics,
          callDuration: row.callDuration,
          resolutionTime: row.resolutionTime,
          customerFeedback: row.customerFeedback,
        }));
      },
      error: (err) => {
        // Handle API error (optional)
        this.performanceData = [];
        alert('Failed to fetch performance data');
      }
    });
  }
}