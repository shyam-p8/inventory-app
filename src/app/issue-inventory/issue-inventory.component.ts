import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../services/inventory.service';
import { Router } from '@angular/router';
import { invntoryItem } from '../data-type';

@Component({
  selector: 'app-issue-inventory',
  templateUrl: './issue-inventory.component.html',
  styleUrls: ['./issue-inventory.component.css']
})
export class IssueInventoryComponent implements OnInit {

  searchForm: FormGroup;
  issueInventoryForm!: FormGroup;
  inventoryItemData!: invntoryItem;
  errorMessage!: string;
  assignedTypes = ['Employee', 'Location', 'Other'];
  assignedCondition = ['New', 'Working', 'Repaired'];
  constructor(
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private route: Router ) { this.searchForm=this.fb.group({serial_number: ['', Validators.required],})}

  ngOnInit(): void {
    this.issueInventoryForm = this.fb.group({
      category: [''],
      sub_category: [''],
      name: [''],
      make: [''],
      model: [''],
      order_id: [''],
      receipt_date: [''],
      warranty_expiration: [''],
      location: [''],
      status: [''],
      serial_number: [''],
      notes: [''],
      assigned_type: [''],
      assignee_id: [''],
      assigned_date: [''],
      assigned_name: [''],
      assigned_condition:['']
    });

      // Listen for changes in the assignee_id field
  // this.issueInventoryForm.get('assignee_id')?.valueChanges.subscribe(assigneeId => {
  //   const assignedType = this.issueInventoryForm.get('assigned_type')?.value;
  //   if (assigneeId && assignedType) {
  //     this.fetchAssigneeDetails(assignedType, assigneeId);
  //   }
  // });
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

onSubmit() {
  this.inventoryService.getInventoryBySerialNumber(this.searchForm.value.serial_number).subscribe({
    next: (result: any) => {
      if (result) {
        this.inventoryItemData = result[0];
        console.warn(result[0]);
        //this.inventoryId=result[0].id;
       // this.editInventoryForm.patchValue(result[0]);
       this.issueInventoryForm.patchValue(result[0]);
        this.errorMessage = '';
      } else {
        this.errorMessage = 'No inventory item found with this serial number.';
        }
    },
    error: (error) => {
      console.error('Error fetching inventory item:', error);
      this.errorMessage = 'An error occurred while searching for the inventory item.';
    }
  });
}

}
