import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../services/inventory.service';
import { Router } from '@angular/router';
import {  issueInventory } from '../data-type';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-issue-inventory',
  templateUrl: './issue-inventory.component.html',
  styleUrls: ['./issue-inventory.component.css']
})
export class IssueInventoryComponent implements OnInit {
  issueForm: boolean = false
  selectedFile: File | null = null;
  searchForm: FormGroup;
  assignment_id!:number;
  receiptType:string='issue';
  assignmentCondition :string[]=[];
  issueInventoryForm!: FormGroup;
  issueInventoryApiJson: issueInventory = {
    assignee_id: 0,
    assigned_type: '',
    assigned_condition: '',
    assigned_date: '',
    equipment_id: 0,
    notes: ''
  };
  errorMessage!: string;
  assignedTypes = ['Employee', 'Location', 'Other'];
  itemCondition : string[]=[];
  printReceipt:boolean=false
  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService, private datePipe: DatePipe,
    private route: Router) { this.searchForm = this.fb.group({ serial_number: ['', Validators.required], }) }

  ngOnInit(): void {
    this.getLov();
    this.issueInventoryForm = this.fb.group({
      category: [''],
      sub_category: [''],
      name: [''],
      make: [''],
      model: [''],
      id: [''],
      receipt_date: [''],
      warranty_expiration: [''],
      location: [''],
      condition:[''],
      status: [''],
      serial_number: [''],
      notes: [''],
      assigned_type: ['', Validators.required],
      assignee_id: ['', Validators.required],
      assigned_date: ['', Validators.required],
      assigned_name: [''],
      assigned_condition: ['', Validators.required],
      remark: ['']
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
  onAssigneeIdChange() {
    const assignee_id = this.issueInventoryForm.get('assignee_id')?.value;
    const assigned_type = this.issueInventoryForm.get('assigned_type')?.value;
    if (assignee_id && assigned_type) {
      this.inventoryService.getAssigneeDetails(assigned_type, assignee_id).subscribe({
        next: (result: any) => {
          console.log('Assignee details:', result);
          if (result && result.employee_name) {
            // You can now set these details in your form or display them
            this.issueInventoryForm.patchValue({
              // Update other fields with employee/location details
              assigned_name: result.employee_name + " # " + result.designation + " # " + result.work_location
            });
          } else if (result && result.location_name) {
            this.issueInventoryForm.patchValue({ assigned_name: result.location_name });
          }
        },
        error: (error) => {
          console.error('Error fetching assignee details:', error);
          this.issueInventoryForm.patchValue({ assigned_name: "" });
        }
      });
    }
  }

  onSearch() {
    this.inventoryService.getInventoryBySerialNumber(this.searchForm.value.serial_number).subscribe({
      next: (result: any) => {
        if (result) {
          this.issueInventoryForm.patchValue(result[0]);
          this.issueForm = true;
          this.errorMessage = '';
        } else {
          this.issueForm = false;
          this.errorMessage = 'No inventory item found with this serial number.';
        }
      },
      error: (error) => {
        console.error('Error fetching inventory item:', error);
        this.issueForm = false;
        this.errorMessage = 'An error occurred while searching for the inventory item.';
      }
    });
  }

  onSubmit() {
    const formData: FormData = new FormData();
    // // Append form values
    if (this.issueInventoryForm.valid) {
      // Append form values to FormData
      formData.append('assigned_condition', this.issueInventoryForm.value.assigned_condition);
      formData.append('assigned_type', this.issueInventoryForm.value.assigned_type);
      formData.append('assignee_id', this.issueInventoryForm.value.assignee_id);
      formData.append('notes', this.issueInventoryForm.value.remark);
      formData.append('equipment_id', this.issueInventoryForm.value.id);

      // Safely transform the assigned_date, and handle null/undefined values
      const assignedDateValue = this.issueInventoryForm.value?.assigned_date;
      const formattedDate = assignedDateValue ? this.datePipe.transform(assignedDateValue, 'yyyy-MM-dd') : '';
      formData.append('assigned_date', formattedDate || '');

      // Append file if selected
      if (this.selectedFile) {
        formData.append('file', this.selectedFile);
      }

      this.inventoryService.issueInventory(formData).subscribe({
        next: (result: any) => {
          // console.log('Inventory items successfully submitted', result);
          if (result.status === 'success') {
            this.assignment_id=result.assignment_id;
            this.printReceipt=true;
            alert(result.message);
          // this.issueInventoryForm.reset();
          }
        },
        error: (error: { error: { message: any; }; }) => {
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
   onCancel(): void {
    this.issueForm=false;
    this.printReceipt=false;
    this.route.navigate(['/home/issue-inventory']);
   }

   onPrintReceipt(){
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
        } 
      }else {
          alert('Error: Could not retrieve receipt template.');
        }
      },
      error: (err: any) => {
        console.error('Error retrieving receipt template:', err);
      }
    });
   }

}

