import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-item-detail-dialog',
  templateUrl: './item-detail-dialog.component.html',
  styleUrls: ['./item-detail-dialog.component.css']
})
export class ItemDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}
