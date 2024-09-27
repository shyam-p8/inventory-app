import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../services/inventory.service';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-receive-inventory2',
  templateUrl: './receive-inventory2.component.html',
  styleUrls: ['./receive-inventory2.component.css']
})

export class ReceiveInventory2Component implements OnInit {
  selectedFile: File | null = null;
  searchForm: FormGroup;
  assignment_id!: number;
  assignmentCondition: string[] = [];
  receiveInventoryForm!: FormGroup;
  errorMessage!: string;
  assignedTypes = ['Employee', 'Location', 'Other'];
  itemCondition: string[] = [];
  printReceipt: boolean = false
  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService, private datePipe: DatePipe,
    ) { this.searchForm = this.fb.group({ serialNumber: ['', Validators.required], }) }

  ngOnInit(): void {
    this.getLov();
    this.receiveInventoryForm = this.fb.group({
      // category: [''],
      // sub_category: [''],
      make: [''],
      model: [''],
      id: [''],
      receipt_date: [''],
      warranty_expiration: [''],
      status: [''],
      serial_number: [''],
      notes: [''],
      issue_person_code_name:[''],
      assigned_type: [''],
      assigned_to: [''],
      assigned_date: [''],
      assigned_to_details: [''],
      assigned_condition: [''],
      issue_remark: [''],
      return_date: ['', Validators.required],
      return_condition: ['', Validators.required],
      return_remark: [''],
      return_person_name:[''],
      return_person_code:[''],
      category_subCategory:[''],
      make_model:['']

    });
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
        this.errorMessage=error.message;
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
  
 searchInventory() {
    this.printReceipt = false
    this.receiveInventoryForm.reset();
    this.inventoryService.getInventoryBySerialNumber(this.searchForm.value.serialNumber).subscribe({
      next: (result: any) => {
        if (result) {
          this.assignment_id = result[0].assignment_id;
          if (this.assignment_id == null) {
            alert("This item has not been issued. You cannot receive it.");
            return;
          } else {
            this.searchForm.reset();
            this.inventoryService.getInventoryAssignmentDetail(this.assignment_id).subscribe({
              next: (res: any) => {
                if (res) {
                  this.receiveInventoryForm.patchValue(res[0]);
                 this.receiveInventoryForm.patchValue({ issue_remark: res[0].notes });
                 this.receiveInventoryForm.controls['assigned_date'].patchValue(this.datePipe.transform(res[0].assigned_date, 'dd-MM-yyyy'));
                 this.receiveInventoryForm.controls['issue_person_code_name'].patchValue(res[0].issue_person_code+"  |  "+res[0].issue_person_name);
                 
                } else {
                  this.errorMessage = 'No assignment detail found with this assignment_id=' + this.assignment_id;
                }
              },
              error: (error) => {
                console.error('Error fetching assignment detail :', error);
                this.errorMessage = 'An error occurred while searching for the assignment detail.';
              }
            });
          }
          this.receiveInventoryForm.patchValue(result[0]);
          this.receiveInventoryForm.controls['warranty_expiration'].patchValue(this.datePipe.transform(result[0].warranty_expiration, 'dd-MM-yyyy'));
          this.receiveInventoryForm.controls['category_subCategory'].patchValue(result[0].category+"  |  "+result[0].sub_category);
          this.receiveInventoryForm.controls['make_model'].patchValue(result[0].make+"  |  "+result[0].model);
          this.errorMessage = '';
        } else {
          this.errorMessage = 'No inventory item found with this serial number.';
        }
      },
      error: (error) => {
        this.errorMessage=error.message;
       }     
    });
  }

  onSubmit() {
    const formData: FormData = new FormData();
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
        error: (error) => {
          this.errorMessage=error.message;
          alert(error.message);
         }     
      });
    }   
    
  }
  onCancel(): void {
    this.receiveInventoryForm.reset(); // Reset the form
  this.assignment_id = 0; // Clear the assignment_id
  this.errorMessage = ''; // Optionally clear any error message
  return;
  }

  onPrintReceipt() {
    this.inventoryService.getReceiptTemplate('receive', this.assignment_id).subscribe({
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
          }
        } else {
          alert('Error: Could not retrieve receipt template.');
        }
      },
      error: (error) => {
        this.errorMessage=error.message;
       }     
    });
  }


}
