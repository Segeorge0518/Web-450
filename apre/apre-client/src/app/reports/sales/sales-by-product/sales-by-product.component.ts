import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from '../../../shared/table/table.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sales-by-product',
  standalone: true,
  imports: [ReactiveFormsModule, TableComponent],
  template: `
    <h1>Sales by Product</h1>
    <div class="productSales-container">

      <!-- form for product selection -->
      <form class="form" [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label for="product">Select Product:</label>
          <select class="select" formControlName="product" id="product" name="product" request>
            <option value="" disabled selected>Select a product</option>
            <option value="Portable Projector">Portable Projector</option>
            <option value="Laptop Pro 15">Laptop Pro 15</option>
            <option value="Smartphone X">Smartphone X</option>
            <option value="Office Chair Deluxe">Office Chair Deluxe</option>
            <option value="4K TV">4K TV</option>
            <option value="Gaming Console">Gaming Console</option>
            <option value="Bluetooth Headphones">Bluetooth Headphones</option>
            <option value="Smartwatch Series 5">Smartwatch Series 5</option>
            <option value="9">Wireless Mouse</option>
            <option value="10">Electric Kettle</option>
            <option value="11">Air Purifier</option>
            <option value="12">Fitness Tracker</option>
            <option value="13">Digital Camera</option>
            <option value="14">Laptop Pro 13</option>
            <option value="15">Tablet S</option>
            <option value="16">Smart Thermostat</option>
            <option value="17">Bluetooth Speaker</option>
            <option value="18">Electric Toothbrush</option>
            <option value="19">Smart Light Bulb</option>
            <option value="20">Wireless Charger</option>
            <option value="21">Noise Cancelling Headphones</option>
            <option value="22">Smart Door Lock</option>
          </select>
        </div>

        <div class="form__actions">
          <input type="submit" class="button button--primary" value="Generate Report" />
        </div>
      </form>

      <!-- div to display the data -->
      @if (salesData.length > 0) {
        <div class="card chart-card">
          <app-table
            [title]="'Sales for ' + selectedProduct"
            [data]="salesData"
            [headers]="['region', 'category', 'salesperson', 'channel', 'amount']"
            >
          </app-table>
        </div>
      }
    </div>
  `,
  styles: ``
})
export class SalesByProductComponent {
  salesData: any[] = [];
  products: any[] = [];

  readonly productNames = [
    '', 'Portable Projector', 'Laptop Pro 15', 'Smartphone X', 'Office Chair Deluxe', '4K TV', 'Gaming Console', 'Bluetooth Headphones', 'Smartwatch Series 5', 'Wireless Mouse', 'Electric Kettle', 'Air Purifier', 'Fitness Tracker', 'Digital Camera', 'Laptop Pro 13', 'Tablet S', 'Smart Thermostat', 'Bluetooth Speaker', 'Electric Toothbrush', 'Smart Light Bulb', 'Wireless Charger', 'Noise Cancelling Headphones', 'Smart Door Lock'
  ];

  get selectedProduct(): string {
    const productNum = this.productForm.controls['product'].value;
    return productNum ? this.productNames[productNum] : '';
  }

  productForm = this.fb.group({
    product: [null, Validators.required]
  })

  constructor(private fb: FormBuilder, private http: HttpClient) {

  }

  onSubmit() {
    const selectedProduct = this.productForm.controls['product'].value;

    this.http.get(`${environment.apiBaseUrl}/reports/sales/sales-by-product?product=${selectedProduct}`).subscribe({
      next: (data) => {
        this.products = data as any[];
      },
      error: (err) => {
        console.error('Error fetching data from server: ', err);
      }
    })
  }
}