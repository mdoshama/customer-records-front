import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CustomerRequest, CustomerResponse, CustomerService } from '../customer';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


type Mode = 'list' | 'create' | 'edit';

@Component({
  selector: 'app-customer',
  imports: [FormsModule, CommonModule],
  templateUrl: './customer.html',
  styleUrl: './customer.scss',
})
export class CustomerComponent implements OnInit {
  mode: Mode = 'list';
  customers: CustomerResponse[] = [];
  selected: CustomerResponse | null = null;
  searchPhone = '';
  searchResult: CustomerResponse | null = null;
  searchError = '';
  errorMessage = '';
  successMessage = '';

  form: CustomerRequest = this.emptyForm();

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.customerService.getAll().subscribe({
      next: (data) => {
        this.customers = data;
        console.log('customers loaded:', this.customers.length);
        this.cdr.detectChanges(); // ← force re-render
      },
      error: () => (this.errorMessage = 'Failed to load customers.'),
    });
  }

  openCreate(): void {
    this.form = this.emptyForm();
    this.selected = null;
    this.mode = 'create';
    this.clearMessages();
  }

  openEdit(customer: CustomerResponse): void {
    this.selected = customer;
    this.form = {
      firstName: customer.firstName,
      lastName: customer.lastName,
      phoneNumber: customer.phoneNumber,
    };
    this.mode = 'edit';
    this.clearMessages();
  }

  cancel(): void {
    this.mode = 'list';
    this.clearMessages();
  }

  submit(): void {
    if (this.mode === 'create') {
      this.customerService.create(this.form).subscribe({
        next: () => {
          this.successMessage = 'Customer created successfully.';
          this.mode = 'list';
          this.loadAll();
        },
        error: () => (this.errorMessage = 'Failed to create customer.'),
      });
    } else if (this.mode === 'edit' && this.selected) {
      this.customerService.update(+this.selected.id, this.form).subscribe({
        next: () => {
          this.successMessage = 'Customer updated successfully.';
          this.mode = 'list';
          this.loadAll();
        },
        error: () => (this.errorMessage = 'Failed to update customer.'),
      });
    }
  }

  delete(id: number): void {
    if (!confirm('Delete this customer?')) return;
    this.customerService.delete(id).subscribe({
      next: () => {
        this.successMessage = 'Customer deleted.';
        this.loadAll();
      },
      error: () => (this.errorMessage = 'Failed to delete customer.'),
    });
  }

  searchByPhone(): void {
    this.searchError = '';
    this.searchResult = null;
    if (!this.searchPhone.trim()) return;
    this.customerService.searchByPhone(this.searchPhone.trim()).subscribe({
      next: (result) => (this.searchResult = result),
      error: () => (this.searchError = 'No customer found with that phone number.'),
    });
  }

  clearSearch(): void {
    this.searchPhone = '';
    this.searchResult = null;
    this.searchError = '';
  }

  private emptyForm(): CustomerRequest {
    return { firstName: '', lastName: '', phoneNumber: '' };
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.searchResult = null;
    this.searchError = '';
    this.searchPhone = '';
  }
}
