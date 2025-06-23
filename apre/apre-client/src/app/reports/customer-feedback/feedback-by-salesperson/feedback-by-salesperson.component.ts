import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableComponent } from '../../../shared/table/table.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-feedback-by-salesperson',
  standalone: true,
  imports: [ReactiveFormsModule, TableComponent],
  template: `
    <h1>Customer Feedback by Salesperson</h1>
    <div class="feedback-container">

      <form class="form" [formGroup]="salespersonForm" (ngSubmit)="onSubmit()">

        <div class="form_control">

          <label for="salesperson">Select Salesperson:</label>

          <select class="select" formControlName="salesperson" id="salesperson" name="salesperson" required>

            @for (salesperson of salespersons; track salesperson) {
              <option value="{{ salesperson }}">{{ salesperson }}</option>
            }
          </select>
        </div>

        <div class="form_actions">

          <input type="submit" class="button button--primary" value="Generate Report">

        </div>
      </form>

      @if (feedbackBySalespersonData.length > 0) {
        <div class="card chart-card">
          <app-table
            [title]="'Feedback by Salesperson Data'"
            [data]="feedbackBySalespersonData"
            [headers]="['region', 'channel', 'salesperson', 'customer', 'feedbackType', 'feedbackSource', 'feedbackStatus']"
            [sortableColumns]="['region', 'channel', 'salesperson', 'customer', 'feedbackType', 'feedbackSource', 'feedbackStatus']"
            >
          </app-table>>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class FeedbackBySalespersonComponent {
  salespersons: any = [];
  feedbackBySalespersonData: any =[];

  salespersonForm = this.fb.group({
    salesperson: [null, Validators.required]
  })

  constructor(private http: HttpClient, private fb: FormBuilder) {

  }
  ngOnInit(): void {
    this.http.get(`${environment.apiBaseUrl}/reports/customer-feedback/salesperson`).subscribe({
      next: (data) => {
        this.salespersons = data;
      },
      error: (err) => {
        console.error('An error occurred while calling the salespersons API', err);
      }
    });
  }

  onSubmit() {
    const salesperson = this.salespersonForm.controls['salesperson'].value;

    this.http.get(`${environment.apiBaseUrl}/reports/customer-feedback/feedback-by-salesperson?salesperson=${salesperson}`).subscribe({
      next: (data) => {
        this.feedbackBySalespersonData = data;
      },
      error: err => {
        console.error('Error occurred while calling the customer feedback by salesperson API', err);
      }
    });
  }
}
