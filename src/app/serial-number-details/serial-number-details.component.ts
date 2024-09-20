import { Component, Inject } from '@angular/core';
import { InventoryReport } from '../data-type';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-serial-number-details',
  templateUrl: './serial-number-details.component.html',
  styleUrls: ['./serial-number-details.component.css']
})
export class SerialNumberDetailsComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: InventoryReport) { }
}
