import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../services/inventory.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-inventory',
  templateUrl: './edit-inventory.component.html',
  styleUrls: ['./edit-inventory.component.css']
})
export class EditInventoryComponent implements OnInit {
  editForm : boolean=false
  inventoryId:number=0;
  serialNumber: string = '';
  inventoryItem: any = null;
  errorMessage: string = '';
  editInventoryForm: FormGroup;
  searchForm : FormGroup
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
  subcategories: string[] = [];
  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private route: Router
  ) {
    this.searchForm=this.fb.group({serialNumber: ['', Validators.required],})
    
    this.editInventoryForm = this.fb.group({
      category: ['', Validators.required],
      sub_category: ['', Validators.required],
      name: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      order_id: ['', Validators.required],
      receipt_date: ['', Validators.required],
      warranty_expiration: ['', Validators.required],
      location: ['', Validators.required],
      status: ['', Validators.required],
      serial_number: ['', Validators.required],
      notes: ['']
    });
  }

  ngOnInit(): void {}

  searchInventory(): void {
    this.inventoryService.getInventoryBySerialNumber(this.searchForm.value.serialNumber).subscribe({
      next: (result: any) => {
        if (result) {
          this.inventoryItem = result[0];
          this.editForm=true
          console.warn(result);
          this.inventoryId=result[0].id;
          this.editInventoryForm.patchValue(result[0]);
          this.errorMessage = '';
        } else {
          this.errorMessage = 'No inventory item found with this serial number.';
          this.inventoryItem = null;
        }
      },
      error: (error) => {
        console.error('Error fetching inventory item:', error);
        this.errorMessage = 'An error occurred while searching for the inventory item.';
      }
    });
  }

  onCategoryChange(categoryName: string): void {
    const selectedCategory = this.categories.find(category => category.name === categoryName);
    this.subcategories = selectedCategory ? selectedCategory.subcategories : [];
    // Reset subcategory selection when category changes
    this.editInventoryForm.get('sub_category')!.setValue('');
  }
 

  onSubmit(): void {
    if (this.editInventoryForm.valid) {
      this.inventoryService.updateInventory(this.inventoryId, this.editInventoryForm.value).subscribe({
        next: (result: any) => {
          if (result.status === 'success') {
            alert('Inventory item successfully updated.');
            this.inventoryItem='';
            this.route.navigate(['/home/edit-inventory']);
          }
        },
        error: (error) => {
          console.error('Error updating inventory:', error);
          alert('Failed to update inventory item.');
        }
      });
    }
  }

  onCancle(): void {
   this.editForm=false;
   this.inventoryItem='';
   this.route.navigate(['/home/edit-inventory']);
  }

  // onSubmit(): void {
  //   if (this.inventoryForm.valid) {
  //     const updatedItem = this.inventoryForm.getRawValue();
  //     this.inventoryService.updateInventory(updatedItem).subscribe({
  //       next: (result: any) => {
  //         alert('Inventory item updated successfully!');
  //       },
  //       error: (error) => {
  //         console.error('Error updating inventory item:', error);
  //         this.errorMessage = 'An error occurred while updating the inventory item.';
  //       }
  //     });
  //   }
  // }
}
