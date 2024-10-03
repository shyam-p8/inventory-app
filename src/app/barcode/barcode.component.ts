import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../services/inventory.service';


@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.css']
})
export class BarcodeComponent implements AfterViewInit {
  searchForm: FormGroup;
  errorMessage!: string;
  item: any;
  serialNumber:string | undefined;

  @ViewChild('barcodeInput') barcodeInput!: ElementRef;

  constructor(private fb: FormBuilder, private inventoryService: InventoryService) { 
    this.searchForm = this.fb.group({
      serialNumber: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    // Automatically focus the input field when the component is initialized
    this.barcodeInput.nativeElement.focus();
  }

  searchInventory(): void {
    this.errorMessage = '';
  this.serialNumber = this.searchForm.value.serialNumber;
    
    console.log(this.serialNumber )

    if (this.serialNumber?.trim()) {
      this.inventoryService.getInventoryBySerialNumber(this.serialNumber).subscribe({
        next: (result: any) => {
          if (result && result.length > 0) {
            if (result[0].status === 'ISSUED') {
              alert("This item is already issued. You cannot issue it.");
              this.searchForm.reset();
              this.barcodeInput.nativeElement.focus();
              return;
            }
            this.item = JSON.stringify(result[0]);
          } else {
            this.errorMessage = 'No inventory item found with this serial number.';
          }
        },
        error: (error) => {
          this.errorMessage = error.message;
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid serial number.';
    }

    // Reset the form after searching and focus back on the input field
    this.searchForm.reset();
    this.barcodeInput.nativeElement.focus();
  }
}

