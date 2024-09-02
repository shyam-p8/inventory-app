
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { invntoryItem } from '../data-type';
import { DatePipe } from '@angular/common';  // Import DatePipe
import { HttpClient } from '@angular/common/http';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.css'],
  providers: [DatePipe] // Provide DatePipe in the component
})

// You can also format the date directly in the template if needed: html ,
//  <p>{{ inventoryForm.value.receiptDate | date: 'yyyy-MM-dd' }}</p>


export class AddInventoryComponent implements OnInit{

  inventoryForm!: FormGroup;
  categories = ['Laptop', 'Desktop', 'Monitor', 'Printer', 'Other'];
  assignedTypes = ['Employee', 'Department', 'Project', 'Other'];
 
  constructor(private fb: FormBuilder,private datePipe: DatePipe, private http:HttpClient, private inventoryService:InventoryService) { }

  ngOnInit(): void {
    this.inventoryForm = this.fb.group({
      name: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      category: ['', Validators.required],
      // assignedType: ['', Validators.required],
      // assignedId: ['', Validators.required],
      poNumber: ['', Validators.required],
      supplierId: ['', Validators.required],
      purchaseDate: ['', Validators.required],
      receiptDate: ['', Validators.required],
      warrantyEndDate: ['', Validators.required],
      serialNumbers: ['', Validators.required], // Updated form control for multiple serial numbers
      projectName: ['', Validators.required],
      status: ['', Validators.required],
      notes: ['']
    });
  }

  onSubmit(): void {
    if (this.inventoryForm.valid) {
       
       // Split the serial numbers input into an array by new lines, commas, or spaces
       const serialNumbersArray = this.inventoryForm.value.serialNumbers
       .split(/[\n, ]+/)
       .filter((serial: string)=>serial.trim()!=='');
       const purchaseDate = this.datePipe.transform(this.inventoryForm.value.purchaseDate, 'yyyy-MM-dd');
       const receiptDate = this.datePipe.transform(this.inventoryForm.value.receiptDate, 'yyyy-MM-dd');
       const warrantyEndDate = this.datePipe.transform(this.inventoryForm.value.warrantyEndDate, 'yyyy-MM-dd');
           
       const itemList: invntoryItem[] = serialNumbersArray.map((serialNumber: any) => {
        return {
          name: this.inventoryForm.value.name,
          make: this.inventoryForm.value.make,
          model: this.inventoryForm.value.model,
          category: this.inventoryForm.value.category,
          poNumber: this.inventoryForm.value.poNumber,
          receipt_date: receiptDate,
          warranty_expiration: warrantyEndDate,
          serial_number: serialNumber,
          status: this.inventoryForm.value.status,
          notes: this.inventoryForm.value.notes,
          location:'wahehouse',
          sub_category:'na',
          assigned_to:'na',
        };
      });

      console.log('ItemList Prepared', itemList);
        // Add your submission logic here (e.g., HTTP request to backend)
        // Send the itemList to the backend     
        
        this.inventoryService.submitInventory(itemList).subscribe(
          response => {
            console.log('Inventory items successfully submitted', response);
          },
          error => {
            console.error('Error submitting inventory items', error);
          }
        );
    }    
  }

 
}
