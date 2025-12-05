// src/app/components/smartphones/smartphones.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IManufacturerRead } from '../../Models/Manufacturer/IManufacturerRead';
import { ISmartphoneRead } from '../../Models/Smartphones/ISmartphoneRead';
import { IAddSmartPhone } from '../../Models/Smartphones/IAddSmartPhone';
import { IUpdateSmartPhone } from '../../Models/Smartphones/IUpdateSmartPhone';
import { ISmartphoneFilter } from '../../Models/Smartphones/ISmartphoneFilter';
import { ISpecificationRead } from '../../Models/Specification/ISpecificationRead';
import { ManufacturerService } from '../../services/manufacturer-service';
import { SmartphoneService } from '../../services/smartphone-service';
import { SpecificationService } from '../../services/specification-service';
import { LoginService } from '../../services/login-service';
import { PENDING_SMARTPHONE_ACTION_KEY } from '../../constants/storage-keys';

type PendingSmartphoneAction =
  | { type: 'add' }
  | { type: 'edit'; payload: { id: number } };

@Component({
  selector: 'app-smartphones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './smartphones.html',
  styleUrl: './smartphones.css',
})
export class Smartphones implements OnInit {
  private readonly pendingActionKey = PENDING_SMARTPHONE_ACTION_KEY;

  smartphones: ISmartphoneRead[] = [];
  filteredSmartphones: ISmartphoneRead[] = [];
  manufacturers: IManufacturerRead[] = [];
  specifications: ISpecificationRead[] = [];
  

  filters: ISmartphoneFilter = { manufacturerId: 0, specId: 0, searchText: '' };

  formModel: (IAddSmartPhone & { id?: number }) = this.getEmptyFormModel();
  formMode: 'add' | 'edit' = 'add';
  showForm = false;

  // Tracks the id of the smartphone currently being edited (for safe routing)
  private editingId: number | null = null;

  isLoadingList = false;
  isSaving = false;
  feedbackMessage = '';
  errorMessage = '';

  constructor(
    private smartphoneService: SmartphoneService,
    private manufacturerService: ManufacturerService,
    private specificationService: SpecificationService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadLookupsAndSmartphones();
  }

  trackById(_: number, phone: ISmartphoneRead): number {
    return (phone as any).smartphoneId ?? phone.id;
  }

  onAddClick(): void {
    this.invokeProtectedAction({ type: 'add' }, () => this.openFormForAdd());
  }

  onEditClick(phone: ISmartphoneRead): void {
    const phoneId = (phone as any).smartphoneId ?? phone.id;
    this.invokeProtectedAction({ type: 'edit', payload: { id: phoneId } }, () =>
      this.openFormForEdit(phone)
    );
  }

  onDeleteClick(phone: ISmartphoneRead): void {
    if (!confirm(`Delete ${phone.name}?`)) {
      return;
    }
    
    // Remove from local arrays only (no API call)
    const phoneId = (phone as any).smartphoneId ?? phone.id;
    this.smartphones = this.smartphones.filter(
      (p) => ((p as any).smartphoneId ?? p.id) !== phoneId
    );
    this.applyFilters();
    this.feedbackMessage = 'Smartphone removed from list.';
    
    // Clear feedback message after 3 seconds
    setTimeout(() => {
      if (this.feedbackMessage === 'Smartphone removed from list.') {
        this.feedbackMessage = '';
      }
    }, 3000);
  }

  onFiltersChange(): void {
    this.applyFilters();
  }

  resetFilters(): void {
    this.filters = { manufacturerId: 0, specId: 0, searchText: '' };
    this.applyFilters();
  }

  submitSmartphone(formRef: NgForm): void {
    if (formRef.invalid) {
      formRef.control.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.feedbackMessage = '';

    const payload: IAddSmartPhone = {
      name: this.formModel.name.trim(),
      description: this.formModel.description.trim(),
      manufacturerId: this.formModel.manufacturerId,
      specId: this.formModel.specId,
    };

    if (this.formMode === 'edit') {
      // Prioritize editingId as it's set when opening the form and shouldn't change
      const updateId = this.editingId ?? this.formModel?.id;
      if (!updateId || updateId === 0) {
        console.error('Update failed: editingId =', this.editingId, 'formModel.id =', this.formModel?.id, 'formMode =', this.formMode);
        this.errorMessage = 'Unable to update: smartphone ID is missing. Please try editing again.';
        this.isSaving = false;
        return;
      }
      const updatePayload: IUpdateSmartPhone = {
        ...payload,
        id: updateId,
      };
      this.smartphoneService.updateSmartphone(updatePayload).subscribe({
        next: () => {
          this.feedbackMessage = 'Smartphone updated successfully.';
          this.closeForm();
          this.refreshSmartphones();
        },
        error: (error) => {
          console.error('Save smartphone error:', error);
          this.errorMessage =
            (typeof error.error === 'string' && error.error) ||
            error.error?.message ||
            error.message ||
            'Unable to save smartphone changes.';
          this.isSaving = false;
        },
      });
      return;
    }

    // Add mode
    this.smartphoneService.addSmartphone(payload).subscribe({
      next: () => {
        this.feedbackMessage = 'Smartphone added successfully.';
        this.closeForm();
        this.refreshSmartphones();
      },
      error: (error) => {
        console.error('Save smartphone error:', error);
        this.errorMessage =
          (typeof error.error === 'string' && error.error) ||
          error.error?.message ||
          error.message ||
          'Unable to save smartphone changes.';
        this.isSaving = false;
      },
    });
  }

  cancelForm(): void {
    this.closeForm();
  }

  private loadLookupsAndSmartphones(): void {
    this.isLoadingList = true;

    const shouldLoadLookups = this.loginService.isLoggedIn();

    const manufacturers$ = shouldLoadLookups
      ? this.manufacturerService.getAllManufacturer().pipe(
          catchError((error) => {
            console.warn('Unable to load manufacturers:', error);
            return of([]);
          })
        )
      : of([]);

    const specifications$ = shouldLoadLookups
      ? this.specificationService.getAllSpecifications().pipe(
          catchError((error) => {
            console.warn('Unable to load specifications:', error);
            return of([]);
          })
        )
      : of([]);

    forkJoin({
      smartphones: this.smartphoneService.getAllSmartphones(),
      manufacturers: manufacturers$,
      specifications: specifications$,
    }).subscribe({
      next: ({ smartphones, manufacturers, specifications }) => {
        this.smartphones = smartphones;
        this.filteredSmartphones = smartphones;
        this.manufacturers = manufacturers;
        this.specifications = specifications;
        // Debug: log first smartphone to see structure
        if (smartphones.length > 0) {
          console.log('Sample smartphone data:', smartphones[0]);
        }
        this.isLoadingList = false;
        this.restorePendingAction();
      },
      error: (error) => {
        this.isLoadingList = false;
        this.errorMessage =
          error.error?.message || 'Unable to load smartphones at this time.';
      },
    });
  }

  private refreshSmartphones(): void {
    this.smartphoneService.getAllSmartphones().subscribe({
      next: (smartphones) => {
        this.smartphones = smartphones;
        this.applyFilters();
        this.isSaving = false;
      },
      error: () => {
        this.errorMessage = 'Unable to refresh smartphone list.';
        this.isSaving = false;
      },
    });
  }

  private applyFilters(): void {
    const manufacturerFilterId = Number(this.filters.manufacturerId) || 0;
    const specFilterId = Number(this.filters.specId) || 0;
    const search = this.filters.searchText.trim().toLowerCase();

    // Get the manufacturer name if filtering by manufacturer
    const selectedManufacturer = manufacturerFilterId
      ? this.manufacturers.find((m) => m.manufacturerId === manufacturerFilterId)
      : null;

    // Get the specification if filtering by spec
    const selectedSpec = specFilterId
      ? this.specifications.find((s) => s.specId === specFilterId)
      : null;

    // Debug: log filter state
    if (specFilterId && selectedSpec) {
      console.log('Filtering by spec:', selectedSpec);
    }

    this.filteredSmartphones = this.smartphones.filter((phone) => {
      // Match manufacturer: try by ID first, then by name as fallback
      let matchesManufacturer = true;
      if (manufacturerFilterId && selectedManufacturer) {
        // Try matching by ID if available
        if (phone.manufacturerId !== undefined && phone.manufacturerId !== null) {
          matchesManufacturer = phone.manufacturerId === manufacturerFilterId;
        } else {
          // Fallback to name matching
          matchesManufacturer =
            phone.manufacturerName === selectedManufacturer.manufacturerName;
        }
      }

      // Match spec: try by ID first, then by specification details
      let matchesSpec = true;
      if (specFilterId && selectedSpec) {
        // Try matching by ID if available (check if specId exists and is not 0)
        const phoneSpecId = phone.specId;
        if (phoneSpecId !== undefined && phoneSpecId !== null && phoneSpecId !== 0) {
          matchesSpec = phoneSpecId === specFilterId;
          if (!matchesSpec && specFilterId) {
            console.log('Spec ID mismatch:', phoneSpecId, 'vs', specFilterId, 'for phone:', phone.name);
          }
        } else {
          // Fallback: match by specification details or specName
          const phoneAny = phone as any;
          
          // First try matching by specName if available
          if (phone.specName) {
            const specDisplayName = `${selectedSpec.processor} / ${selectedSpec.ram} / ${selectedSpec.storage}`;
            matchesSpec = phone.specName === specDisplayName || phone.specName.includes(selectedSpec.processor);
          } else {
            // Try matching by individual specification properties
            // Check multiple possible property names from API response
            const phoneProcessor = phoneAny.processor || phoneAny.specifications1 || phoneAny.Processor || phoneAny.specName;
            const phoneRAM = phoneAny.ram || phoneAny.specification3 || phoneAny.RAM;
            const phoneStorage = phoneAny.storage || phoneAny.specification4 || phoneAny.Storage;
            const phoneOS = phoneAny.os || phoneAny.specifications2 || phoneAny.OS;

            // Compare with selected spec
            if (phoneProcessor && phoneRAM && phoneStorage) {
              matchesSpec =
                phoneProcessor.toLowerCase().includes(selectedSpec.processor.toLowerCase()) &&
                phoneRAM.toLowerCase() === selectedSpec.ram.toLowerCase() &&
                phoneStorage.toLowerCase() === selectedSpec.storage.toLowerCase();
              // OS is optional for matching
              if (phoneOS && selectedSpec.os) {
                matchesSpec = matchesSpec && phoneOS.toLowerCase() === selectedSpec.os.toLowerCase();
              }
            } else {
              // If we can't determine spec details, log for debugging but don't exclude
              console.warn('Cannot match spec for phone:', phone.name, 'Phone data:', phoneAny);
              matchesSpec = false;
            }
          }
        }
      }

      // Match search text
      const matchesSearch =
        !search ||
        phone.name.toLowerCase().includes(search) ||
        phone.description.toLowerCase().includes(search);

      return matchesManufacturer && matchesSpec && matchesSearch;
    });
  }

  private openFormForAdd(): void {
    this.formMode = 'add';
    this.formModel = this.getEmptyFormModel();
    this.editingId = null;
    this.showForm = true;
  }

  private openFormForEdit(phone: ISmartphoneRead): void {
    // Handle both 'id' and 'smartphoneId' property names from API
    const phoneId = (phone as any).smartphoneId ?? phone.id;
    if (!phone || !phoneId) {
      console.error('Cannot open edit form: phone or phone.id is missing', phone);
      this.errorMessage = 'Unable to open edit form: smartphone data is invalid.';
      return;
    }
    this.formMode = 'edit';
    this.editingId = phoneId;
    this.formModel = {
      id: phoneId,
      name: phone.name,
      description: phone.description,
      manufacturerId: phone.manufacturerId,
      specId: phone.specId,
    };
    this.showForm = true;
  }

  private closeForm(): void {
    this.showForm = false;
    this.isSaving = false;
    this.formModel = this.getEmptyFormModel();
    this.editingId = null;
  }

  private invokeProtectedAction(
    action: PendingSmartphoneAction,
    onReady: () => void
  ): void {
    if (this.loginService.isLoggedIn()) {
      onReady();
      return;
    }

    sessionStorage.setItem(this.pendingActionKey, JSON.stringify(action));
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: '/smartphones' },
    });
  }

  private restorePendingAction(): void {
    const actionFromQuery = this.route.snapshot.queryParamMap.get('action');
    if (actionFromQuery === 'add' && this.loginService.isLoggedIn()) {
      this.openFormForAdd();
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { action: null },
        queryParamsHandling: 'merge',
      });
    }

    const raw = sessionStorage.getItem(this.pendingActionKey);
    if (!raw || !this.loginService.isLoggedIn()) {
      sessionStorage.removeItem(this.pendingActionKey);
      return;
    }

    sessionStorage.removeItem(this.pendingActionKey);
    try {
      const pending = JSON.parse(raw) as PendingSmartphoneAction;
      if (pending.type === 'add') {
        this.openFormForAdd();
      } else if (pending.type === 'edit') {
        const phone = this.smartphones.find(
          (p) => ((p as any).smartphoneId ?? p.id) === pending.payload.id
        );
        if (phone) {
          this.openFormForEdit(phone);
        }
      }
    } catch {
      // Ignore malformed payloads
    }
  }

  private getEmptyFormModel(): IAddSmartPhone {
    return {
      name: '',
      description: '',
      manufacturerId: 0,
      specId: 0,
    };
  }

  get isLoggedIn(): boolean {
    return this.loginService.isLoggedIn();
  }
}