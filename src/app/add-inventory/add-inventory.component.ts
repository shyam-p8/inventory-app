
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { invntoryItem } from '../data-type';
import { DatePipe } from '@angular/common';  // Import DatePipe
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
  categories = [
    {
      name: 'Laptop',
      subcategories: ['Ultrabook', 'Gaming Laptop', 'Business Laptop', 'Convertible (2-in-1)', 'Netbook']
    },
    {
      name: 'Desktop',
      subcategories: ['Tower PC', 'All-in-One PC', 'Gaming PC', 'Workstation', 'Mini PC']
    },
    {
      name: 'Monitor',
      subcategories: ['LED Monitor', 'Gaming Monitor', '4K Monitor', 'Ultrawide Monitor', 'Curved Monitor']
    },
    {
      name: 'Printer',
      subcategories: ['Laser Printer', 'Inkjet Printer', 'All-in-One Printer', '3D Printer', 'Dot Matrix Printer']
    },
    {
      name: 'Other',
      subcategories: ['External Hard Drive', 'Keyboard', 'Mouse', 'Scanner', 'Network Switch', 'UPS']
    }
  ];
  assignedTypes = ['Employee', 'Department', 'Project', 'Other'];
  subcategories: string[] = [];
  constructor(private fb: FormBuilder,private datePipe: DatePipe, private http:HttpClient, private inventoryService:InventoryService) { }

  ngOnInit(): void {
    this.inventoryForm = this.fb.group({
      name: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      category: ['', Validators.required],
      subcategory: ['', Validators.required], 
      // assignedType: ['', Validators.required],
      // assignedId: ['', Validators.required],
      order_id: ['', Validators.required],
      // purchaseDate: ['', Validators.required],
      receiptDate: ['', Validators.required],
      warrantyEndDate: ['', Validators.required],
      serialNumbers: ['', Validators.required], // Updated form control for multiple serial numbers
      location: ['', Validators.required],
      status: ['', Validators.required],
      notes: ['']
    });
  }

  onCategoryChange(categoryName: string): void {
    const selectedCategory = this.categories.find(category => category.name === categoryName);
    this.subcategories = selectedCategory ? selectedCategory.subcategories : [];
    // Reset subcategory selection when category changes
    this.inventoryForm.get('subcategory')!.setValue('');
  }
  onSubmit(): void {
    if (this.inventoryForm.valid){
       
       // Split the serial numbers input into an array by new lines, commas, or spaces
       const serialNumbersArray = this.inventoryForm.value.serialNumbers
       .split(/[\n,\t ]+/)
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
          order_id: this.inventoryForm.value.order_id,
          receipt_date: receiptDate,
          warranty_expiration: warrantyEndDate,
          serial_number: serialNumber,
          status: this.inventoryForm.value.status,
          notes: this.inventoryForm.value.notes,
          location:this.inventoryForm.value.location,
          sub_category: this.inventoryForm.value.subcategory,
          assigned_to:'na',
        };
      });
      
      console.log('ItemList Prepared', itemList);
        // Add your submission logic here (e.g., HTTP request to backend)
        
        // Send the itemList to the backend     
        this.inventoryService.submitInventory(itemList).subscribe({
          next: (result: any) => {
           // console.log('Inventory items successfully submitted', result);
            if (result.status === 'success') {
              alert(result.message);
            }
          },
          error: (error) => {
            // Checking if error has a response body with a message
            if (error.error && error.error.message) {
            //  console.error('Error submitting inventory:', error.error.message);
              alert(error.error.message);
            } else {
              console.error('Error submitting inventory:', error);
              alert('An unexpected error occurred.');
            }
          }
        });
    }      
  }
 
}
