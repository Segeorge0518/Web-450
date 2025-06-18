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
  // Form group for selecting the year
  yearForm: FormGroup;

  // Array to hold agent performance data retrieved from the API
  performanceData: any[] = [];

  // Currently selected year, used for displaying and querying data
  selectedYear: string = '';

  // Table headers, mapping backend field names to those expected by table.component.ts
  headers: string[] = ['agentId', 'performanceMetrics', 'callDuration', 'resolutionTime', 'customerFeedback'];

  // Constructor injects FormBuilder for building reactive forms and HttpClient for API calls by initializing the form group with a required 'year' field
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.yearForm = this.fb.group({
      year: ['', Validators.required],
    });
  }

  // Called when the year form is submitted, only when the code is valid. The selected year is stored by this.selectedYear line and then the this.getPerformanceByYear line.
  onSubmit(): void {
    if (this.yearForm.valid) {
      const year = this.yearForm.value.year;
      this.selectedYear = year;
      this.getPerformanceByYear(year);
    }
  }

  // Fetch agent performance data for a given year from the backend API
  getPerformanceByYear(year: string): void {
    // Adjust the API URL as necessary depending on your environment
    this.http.get<any[]>(`/api/reports/agent-performance/performanceByYear?year=${year}`).subscribe({
      // On successful API response
      next: (data) => {
        // Map each row to ensure property names match those expected by the table
        this.performanceData = (data || []).map(row => ({
          agentId: row.agentId,
          performanceMetrics: row.performanceMetrics,
          callDuration: row.callDuration,
          resolutionTime: row.resolutionTime,
          customerFeedback: row.customerFeedback,
        }));
      },
      // If there' an API error, show an error alert
      error: (err) => {
        this.performanceData = [];
        alert('Failed to fetch performance data');
      }
    });
  }
}