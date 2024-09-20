
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../services/inventory.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-inventory2',
  templateUrl: './edit-inventory2.component.html',
  styleUrls: ['./edit-inventory2.component.css'],
  providers: [DatePipe]
})

export class EditInventory2Component implements OnInit {
  editForm: boolean = false
  inventoryId: number = 0;
  serialNumber: string = '';
  errorMessage: string = '';
  editInventoryForm: FormGroup;
  searchForm: FormGroup
  categories = [
    {
      name: 'Laptop',
      subcategories: ['Notebook', 'Consumer Laptop', 'Business Laptop', 'Compbook', 'Tablet', 'Other']
    },
    {
      name: 'Desktop',
      subcategories: ['All-in-One', 'Workstation', 'PC (With CPU)', 'Mini PC', 'Other']
    },
    {
      name: 'Monitor',
      subcategories: ['LED Monitor', 'LCD Monitor', '4K Monitor', 'Other']
    },
    {
      name: 'Printer',
      subcategories: ['Laserjet Normal Printer', 'Laserjet MFP Priter', 'MFP Printer', 'Inkjet Printer', 'Line Black & White Printer', 'Line Colour Printer', 'Barcode Printer',
        'Scanner', '3D Printer', 'Dot Matrix Printer', 'QR Code Printer', 'Other']
    },
    {
      name: 'Other',
      subcategories: ['Keyboard', 'Mouse', 'External Harddisk', 'RAM', 'Scanner', 'USB', 'UPS', 'Switch',
        'Router', 'Projector', 'Toner', 'Power Cable', 'Charger']
    }
  ];
  subcategories: string[] = [];
  itemCondition: string[] = [];
  statusLov: string[] = [];
  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private route: Router,
    private datePipe: DatePipe
  ) {
    this.searchForm = this.fb.group({ serialNumber: ['', Validators.required], })

    this.editInventoryForm = this.fb.group({
      category: ['', Validators.required],
      sub_category: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      order_id: ['', Validators.required],
      receipt_date: ['', Validators.required],
      warranty_expiration: ['', Validators.required],
      status: ['', Validators.required],
      serial_number: ['', Validators.required],
      condition: ['', Validators.required],
      price: [''],
      notes: ['']

    });
  }

  ngOnInit(): void {
    this.getLov();
  }
  getLov() {
    this.inventoryService.getItemConditionLov().subscribe({
      next: (result: any) => {
        if (result) {
          this.itemCondition = result.condition_list;
          console.warn("condition lov=", this.itemCondition);
        }
      },
      error: (error) => {
        if (error.error && error.error.message) {
          console.warn("error in getting item condition list " + error.error.message);
        } else {
          console.error('Error getting status LOV:', error);
        }
      }
    });
    this.inventoryService.getStatusLov().subscribe({
      next: (result: any) => {
        if (result) {
          this.statusLov = result.status_list;
          console.warn("status lov=", this.statusLov);
        }
      },
      error: (error) => {
        if (error.error && error.error.message) {
          console.warn("error in getting status list " + error.error.message);
        } else {
          console.error('Error getting status LOV:', error);
        }
      }
    });

  }
  searchInventory(): void {
    this.inventoryService.getInventoryBySerialNumber(this.searchForm.value.serialNumber).subscribe({
      next: (result: any) => {
        if (result) {
          //this.inventoryItem = result[0];
          this.editForm = true
          console.warn("search result =", result);
          this.inventoryId = result[0].id;
          this.editInventoryForm.patchValue(result[0]);
          // Patch category and trigger onCategoryChange
          this.editInventoryForm.controls['category'].patchValue(result[0].category);
          const simulatedEvent = { target: { value: result[0].category } } as unknown as Event;
          this.onCategoryChange(simulatedEvent);
          // Patch sub_category only after subcategories are updated
          setTimeout(() => {
            this.editInventoryForm.controls['sub_category'].patchValue(result[0].sub_category);
          }, 100);


          // Handle receipt_date and warranty_expiration patching (extract only the date)
          const warranty_expiration = result[0].warranty_expiration.split('T')[0]; // Extract 'yyyy-MM-dd'
          const receipt_date = this.datePipe.transform(result[0].receipt_date, 'yyyy-MM-dd')

          // Patch the date values into the form controls
          this.editInventoryForm.controls['receipt_date'].patchValue(receipt_date);
          this.editInventoryForm.controls['warranty_expiration'].patchValue(warranty_expiration);


          console.log("Subcategories loaded:", this.subcategories);

          this.errorMessage = '';
        } else {
          this.errorMessage = 'No inventory item found with this serial number.';
          this.editForm = false;
          // this.inventoryItem = null;
        }
      },
      error: (error) => {
        console.error('Error fetching inventory item:', error);
        this.errorMessage = 'An error occurred while searching for the inventory item.';
        this.editForm = false;
      }
    });
  }
  onCategoryChange(event: Event) {
    const categoryName = (event.target as HTMLSelectElement).value;
    const selectedCategory = this.categories.find(category => category.name === categoryName);

    // Update the subcategories array based on the selected category
    this.subcategories = selectedCategory ? selectedCategory.subcategories : [];

    // Reset the sub_category field after updating subcategories
    this.editInventoryForm.get('sub_category')!.setValue('');
  }



  onSubmit(): void {
    if (this.editInventoryForm.valid) {
      this.inventoryService.updateInventory(this.inventoryId, this.editInventoryForm.value).subscribe({
        next: (result: any) => {
          if (result.status === 'success') {
            alert('Inventory item successfully updated.');
            this.editForm = false;
            //  this.inventoryItem='';
            this.route.navigate(['/home/edit-inventory2']);
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
    this.editForm = false;
    //  this.inventoryItem='';
    this.route.navigate(['/home/edit-inventory']);
  }


}
