import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../services/inventory.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-receive-inventory',
  templateUrl: './receive-inventory.component.html',
  styleUrls: ['./receive-inventory.component.css']
})
export class ReceiveInventoryComponent implements OnInit {
  receiveForm: boolean = false;
  printReceipt:boolean=false;
  selectedFile: File | null = null;
  searchForm: FormGroup;
  receiveInventoryForm!: FormGroup;
  assignment_id!: number;
  receiptType:string='receive';
  errorMessage!: string;
  itemCondition : string[]=[];
    constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService, private datePipe: DatePipe,
    private route: Router) { this.searchForm = this.fb.group({ serial_number: ['', Validators.required], }) }

  ngOnInit(): void {
    this.getLov();
    this.receiveInventoryForm = this.fb.group({
      category: [''],
      sub_category: [''],
      make: [''],
      model: [''],
      id: [''],
      receipt_date: [''],
      warranty_expiration: [''],
      status: [''],
      serial_number: [''],
      notes: [''],
      assigned_type: [''],
      assigned_to: [''],
      assigned_date: [''],
      assigned_name: [''],
      assigned_condition: [''],
      issue_remark: [''],
      return_date: ['', Validators.required],
      return_condition: ['', Validators.required],
      return_remark: [''],
      return_person_name:[''],
      return_person_code:['']

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
        if (error.error && error.error.message) {
         console.warn("error in getting item condition list "+error.error.message);
        } else {
          console.error('Error getting status LOV:', error);
          }
         }
    });
   
  }
  onFileSelected(event: Event) {
    if (!event) {
      console.error('File input event is undefined');
      return;
    }
    const input = event.target as HTMLInputElement;  // Cast to HTMLInputElement

    if (input?.files && input.files.length > 0) {   // Check if files exist
      const file: File = input.files[0];
      if (file.size <= 1 * 1024 * 1024) { // Check if file size is less than 10 MB
        this.selectedFile = file;
      } else {
        alert('File size exceeds 10 MB. Please select a smaller file.');
        input.value = '';
        return;
      }
      // Check file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please select a PDF or image file.');
        input.value = '';
        return; // Exit if file type is not allowed
      }
    }


  }
  getAndSetAssignedName(assignee_id:number,assigned_type:string) {
    
    if (assignee_id && assigned_type) {
      this.inventoryService.getAssigneeDetails(assigned_type, assignee_id).subscribe({
        next: (result: any) => {
          console.log('Assignee details:', result);
          if (result && result.employee_name) {
            // You can now set these details in your form or display them
            this.receiveInventoryForm.patchValue({
              // Update other fields with employee/location details
              assigned_name: result.employee_name + " # " + result.designation + " # " + result.work_location
              });
          } else if (result && result.location_name) {
            this.receiveInventoryForm.patchValue({ assigned_name: result.location_name });
          }
        },
        error: (error) => {
          console.error('Error fetching assignee details:', error);
          this.receiveInventoryForm.patchValue({ assigned_name: "" });
        }
      });
    }
  }

  onSearch() {
    this.inventoryService.getInventoryBySerialNumber(this.searchForm.value.serial_number).subscribe({
      next: (result: any) => {
        if (result) {
          this.assignment_id=result[0].assignment_id;
          if(this.assignment_id==null){
            alert("This item has not been issued. You cannot receive it.");
            this.receiveForm=false
            return;
          }else{
            this.inventoryService.getInventoryAssignmentDetail(this.assignment_id).subscribe({next:(res:any)=>{
              if(res){
                this.receiveInventoryForm.patchValue(res[0]);
                this.getAndSetAssignedName(res[0].assigned_to,res[0].assigned_type);
                this.receiveInventoryForm.patchValue({issue_remark: res[0].notes});
              }else {
                this.receiveForm = false;
                this.errorMessage = 'No assignment detail found with this assignment_id='+this.assignment_id;              }
            },
            error: (error) => {
              console.error('Error fetching assignment detail :', error);
              this.receiveForm = false;
              this.errorMessage = 'An error occurred while searching for the assignment detail.';
            } });
          }
          this.receiveInventoryForm.patchValue(result[0]);
          this.receiveForm = true;
          this.errorMessage = '';
        } else {
          this.receiveForm = false;
          this.errorMessage = 'No inventory item found with this serial number.';
        }
      },
      error: (error) => {
        console.error('Error fetching inventory item:', error);
        this.receiveForm = false;
        this.errorMessage = 'An error occurred while searching for the inventory item.';
      }
    });
  }

  onSubmit() {
    const formData: FormData = new FormData();
    // // Append form values
    if (this.receiveInventoryForm.valid) {
      // Append form values to FormData
      formData.append('returned_condition', this.receiveInventoryForm.value.return_condition);
      formData.append('notes', this.receiveInventoryForm.value.return_remark);
      formData.append('return_person_code', this.receiveInventoryForm.value.return_person_code);
      formData.append('return_person_name', this.receiveInventoryForm.value.return_person_name);

      
      // Safely transform the assigned_date, and handle null/undefined values
      const returnedDateValue = this.receiveInventoryForm.value?.return_date;
      const formattedDate = returnedDateValue ? this.datePipe.transform(returnedDateValue, 'yyyy-MM-dd') : '';
      formData.append('return_date', formattedDate || '');

      // Append file if selected
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this.inventoryService.returnInventory(this.assignment_id,formData).subscribe({
        next: (result: any) => {
          if (result.status === 'success') {
            this.printReceipt=true;
            alert(result.message);            
          }
        },
        error: (error: { error: { message: any; }; }) => {
          if (error.error && error.error.message) {
            alert(error.error.message);
          } else {
            console.error('Error submitting inventory:', error);
            alert('An unexpected error occurred.');
          }
        }
      });
    }
  }
   onCancel(): void {
    this.receiveForm=false;
    this.route.navigate(['/home/receive-inventory']);
   }

   onPrintReceipt(){
    if(this.receiptType){
    this.inventoryService.getReceiptTemplate(this.receiptType,this.assignment_id).subscribe({
      next: (htmlTemplate: string) => {
        if (htmlTemplate) {
          // Open a new window or tab
          const printWindow = window.open('', '_blank', 'width=800,height=600');
          if (printWindow) {
          // Write the HTML template to the new window
          printWindow.document.open();
          printWindow.document.write(htmlTemplate);
          printWindow.document.close();
  
          // Focus and trigger the print
          printWindow.focus();
          printWindow.print();
        } }else {
          alert('Error: Could not retrieve receipt template.');
        }
      },
      error: (err: any) => {
        console.error('Error retrieving receipt template:', err);
      }
    });
   }
  }

}

