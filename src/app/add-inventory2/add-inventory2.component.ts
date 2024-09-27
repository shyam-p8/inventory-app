import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { inventoryItem, Order } from '../data-type';
import { DatePipe } from '@angular/common';  // Import DatePipe
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { InventoryService } from '../services/inventory.service';

@Component({
  selector: 'app-add-inventory2',
  templateUrl: './add-inventory2.component.html',
  styleUrls: ['./add-inventory2.component.css'],
  providers: [DatePipe] // Provide DatePipe in the component
})

// You can also format the date directly in the template if needed: html ,
//  <p>{{ inventoryForm.value.receiptDate | date: 'yyyy-MM-dd' }}</p>

export class AddInventory2Component implements OnInit{
  inventoryForm!: FormGroup;
  categories:string[]=[];
  itemCondition:string[]=[];// = ['NEW & WORKING', 'OLD & WORKING', 'NEW & NOT-WORKING'];
  assignedTypes = ['Employee', 'Department', 'Project', 'Other'];
  statusLov:string[]=[];
  subcategories: string[]=[];
  //categoryLov: string[]=[];
 // subcategoryLov: string[]=[];
  poNumberList :string[]=[];
  orderList:Order[]=[];
  selectedOrderId:number | undefined;
  errorMessage:string='';
  constructor(private fb: FormBuilder,private datePipe: DatePipe, private http:HttpClient, private inventoryService:InventoryService) { }

  ngOnInit(): void {
    this.getLov();
    this.inventoryForm = this.fb.group({
      category: ['', Validators.required],
      subcategory: ['', Validators.required],
      make: ['', Validators.required],
      model: ['', Validators.required],
      po_number: ['', Validators.required],
      price: [null, [Validators.min(0)]],
      receiptDate: ['', Validators.required],
      warrantyEndDate: ['', Validators.required],
      item_condition: ['', Validators.required],
      status: ['', Validators.required],
      serialNumbers: [''],
      notes: ['']
    });
   
   }

  getLov(){
    this.inventoryService.getItemConditionLov().subscribe({
      next: (result: any) => {
        if (result) {
         this.itemCondition=result.condition_list;
         console.warn("condition lov=",this.itemCondition);
        }
      },
      error: (error) => {
       this.errorMessage=error.message;
      }     
    });
    this.inventoryService.getStatusLov().subscribe({
      next: (result: any) => {
        if (result) {
         this.statusLov=result.status_list;
         console.warn("status lov=",this.statusLov);
           // Set the first value of statusLov as the default value for 'status'
           if (this.statusLov.length > 0) {
            this.inventoryForm.patchValue({
              status: this.statusLov[0]  // Set the first item as the default value
            });
          }
        }
      },error: (error) => {
        this.errorMessage=error.message;
       }          
    });
    //to get PO list for PO Number LOV
    this.inventoryService.getOrderList().subscribe({
      next: (result: Order[]) => {
       this.orderList = result; // Assign API response to the class property
        this.poNumberList = this.orderList.map(order => order.po_number);
      },
      error: (error) => {
        this.errorMessage=error.message;
       }     
    }); 

    this.inventoryService.getCategoryLov().subscribe({
      next: (result:any) => {
        this.categories=result.category_list;        
        console.warn("category lov: ",this.categories);      
      },
      error: (error) => {
        this.errorMessage=error.message;
       }     
    }); 
  }
  getSubcategoryLov(category:string){
    this.inventoryService.getSubCategoryLov(category).subscribe({
      next: (result: any) => {
        this.subcategories=result.subcategory_list
        console.warn("subcategory lov: ",this.subcategories);
      },
      error: (error) => {
        this.errorMessage=error.message;
       }     
    });
  }

  onCategoryChange(event: Event) {
    const selectedCategory = (event.target as HTMLSelectElement).value;
    
    // Find the category object based on the selected value
   // const category = this.categories.find(cat => cat.name === selectedCategory);
      
    // If a valid category is selected, update subcategories
    if (selectedCategory) {
      this.getSubcategoryLov(selectedCategory);
      this.inventoryForm.get('subcategory')?.reset();  // Reset the subcategory form control when category changes
    } else {
      this.subcategories = [];
    }
    
  }
  onSubmit(): void {
    if(this.inventoryForm.valid){  

      console.log('Form Submitted:', this.inventoryForm.value);
       // Split the serial numbers input into an array by new lines, commas, or spaces

       const selectedPoNumber = this.inventoryForm.get('po_number')?.value;
       const selectedOrder = this.orderList.find(order => order.po_number === selectedPoNumber);
       this.selectedOrderId = selectedOrder?.id; 
               
       const serialNumbersArray = this.inventoryForm.value.serialNumbers
       .split(/[\n,\t ]+/)
       .filter((serial: string)=>serial.trim()!=='');
       const receiptDate = this.datePipe.transform(this.inventoryForm.value.receiptDate, 'yyyy-MM-dd');
       const warrantyEndDate = this.datePipe.transform(this.inventoryForm.value.warrantyEndDate, 'yyyy-MM-dd');
         
       const itemList: inventoryItem[] = serialNumbersArray.map((serialNumber: any) => {
        return {
          make: this.inventoryForm.value.make,
          model: this.inventoryForm.value.model,
          category: this.inventoryForm.value.category,
          //order_id: this.inventoryForm.value.order_id,
          order_id:this.selectedOrderId,
          receipt_date: receiptDate,
          warranty_expiration: warrantyEndDate,
          serial_number: serialNumber,
          status: this.inventoryForm.value.status,
          notes: this.inventoryForm.value.notes,
          sub_category: this.inventoryForm.value.subcategory,
          assignment_id:null,
          condition:this.inventoryForm.value.item_condition,
          price:this.inventoryForm.value.price
        };
      });
      
      console.log('ItemList Prepared', itemList);
          
        this.inventoryService.submitInventory(itemList).subscribe({
          next: (result: any) => {
           // console.log('Inventory items successfully submitted', result);
            if (result.status === 'success') {
              alert(result.message);
           // Reset the form after successful submission
              this.inventoryForm.reset();
            }
          },
          error: (error) => {
            this.errorMessage=error.message;
            alert(error.message);
           }     
        });
    }      
  }
 
}
