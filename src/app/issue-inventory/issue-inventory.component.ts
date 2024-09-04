import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-issue-inventory',
  templateUrl: './issue-inventory.component.html',
  styleUrls: ['./issue-inventory.component.css']
})
export class IssueInventoryComponent {
searchForm!: FormGroup<any>;
onSubmit() {
throw new Error('Method not implemented.');
}

}
