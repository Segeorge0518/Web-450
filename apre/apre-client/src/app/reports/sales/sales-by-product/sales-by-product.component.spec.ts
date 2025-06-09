import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesByProductComponent } from './sales-by-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

describe('SalesByProductComponent', () => {
  let component: SalesByProductComponent;
  let fixture: ComponentFixture<SalesByProductComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesByProductComponent, HttpClientTestingModule],
      declarations: [SalesByProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesByProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should fetch sales data on form submission', () => {
    const mockResponse = [{ region: 'North', product: 'Laptop Pro 15', category: 'Electronics', salesperson: 'John Doe', channel: 'Online', amount: 1000 }];
    component.productForm.controls['product'].setValue(2);
    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/reports/sales/sales-by-product?product=2`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(component.salesData).toEqual(mockResponse);
  });

  it('should handle error when fetching sales data', () => {
    spyOn(console, 'error');
    component.productForm.controls['product'].setValue(2);
    component.onSubmit();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/reports/sales/sales-by-product?product=2`);
    req.error(new ErrorEvent('Network error'));

    expect(console.error).toHaveBeenCalledWith('Error fetching data from server: ', jasmine.any(Object));
  });

  it('should return the correct selected product name', () => {
    component.productForm.controls['product'].setValue(3);
    expect(component.selectedProduct).toBe('Smartphone X');
  });
});
