import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../services/inventory.service';
import { Router } from '@angular/router';
import { invntoryItem, issueInventory } from '../data-type';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-issue-inventory',
  templateUrl: './issue-inventory.component.html',
  styleUrls: ['./issue-inventory.component.css']
})
export class IssueInventoryComponent implements OnInit {

  selectedFile: File | null = null;
  searchForm: FormGroup;
  issueInventoryForm!: FormGroup;
  inventoryItemData!: invntoryItem;
  issueInventoryApiJson : issueInventory ={ assignee_id:0,
    assigned_type:'',
    assigned_condition:'',
    assigned_date:'',
    equipment_id:0,
    notes:''};
  errorMessage!: string;
  assignedTypes = ['Employee', 'Location', 'Other'];
  assignedCondition = ['New', 'Working', 'Repaired'];
  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService, private datePipe:DatePipe,
    private route: Router ) { this.searchForm=this.fb.group({serial_number: ['', Validators.required],})}

  ngOnInit(): void {
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
      status: [''],
      serial_number: [''],
      notes: [''],
      assigned_type: ['', Validators.required],
      assignee_id: ['', Validators.required],
      assigned_date: ['', Validators.required],
      assigned_name: [''],
      assigned_condition:['',Validators.required],
      remark:['']
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
      if (file.size <= 10 * 1024 * 1024) { // Check if file size is less than 10 MB
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
        if(result && result.employee_name){
        // You can now set these details in your form or display them
        this.issueInventoryForm.patchValue({
          // Update other fields with employee/location details
          assigned_name : result.employee_name+" # "+ result.designation+" # "+result.work_location 
        });
       }else if(result && result.location_name){
        this.issueInventoryForm.patchValue({ assigned_name : result.location_name });
       }
      },
      error:(error) => {
        console.error('Error fetching assignee details:', error);
        this.issueInventoryForm.patchValue({assigned_name : ""});
  }
  });
}
}

onSearch() {
  this.inventoryService.getInventoryBySerialNumber(this.searchForm.value.serial_number).subscribe({
    next: (result: any) => {
      if (result) {
        this.inventoryItemData = result[0];
        console.warn(result[0]);
        this.issueInventoryForm.patchValue(result[0]);
        this.errorMessage = '';
      } else {
        this.errorMessage = 'No inventory item found with this serial number.';      
    }},
    error: (error) => {
      console.error('Error fetching inventory item:', error);
      this.errorMessage = 'An error occurred while searching for the inventory item.';      
    }
  });
}

onSubmit(){


  const formData: FormData = new FormData();

    // // Append form values
if(this.issueInventoryForm.valid){
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
    if(this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

 this.inventoryService.issuetInventory(formData).subscribe({
  next: (result: any) => {
   // console.log('Inventory items successfully submitted', result);
    if (result.status === 'success') {
      alert(result.message);
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

}

