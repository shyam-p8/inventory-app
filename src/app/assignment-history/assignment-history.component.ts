import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';


@Component({
  selector: 'app-assignment-history',
  templateUrl: './assignment-history.component.html',
  styleUrls: ['./assignment-history.component.css']
})
export class AssignmentHistoryComponent implements OnInit {
  assignmentHistory: any[] = [];
  errorMessage: string | null = null; // Variable to store the error message
  searchForm: FormGroup;
  constructor(private inventoryService:InventoryService, private fb: FormBuilder, private dialog: MatDialog){
    this.searchForm = this.fb.group({ serialNumber: ['', Validators.required], })
  }

  ngOnInit(): void {
    }
  
   getAssignmentHistory(){
    this.inventoryService.getAssignmentHistory(this.searchForm.value.serialNumber).subscribe({
      next: (result) => {
        this.assignmentHistory = result;
        console.log('Inventory item fetched successfully:', result);
        this.errorMessage = null; // Clear any previous error
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching Assignment data for this item:', error);
       // Check if the error has a specific error message
        if(error.status === 404) {
          this.errorMessage = error.error.message; // Capture the error message from the API
        }else if(error.status === 400){
          this.errorMessage = error.error.message; // Capture the error message from the API
        }else{
          this.errorMessage = 'An unexpected error occurred.'+error.error; // Generic error message
         
        }
      }
    });;
   }

    // Method to fetch and display the letter (image/pdf) in a popup
    viewLetter(fileUrl: string): void {
      this.inventoryService.getImageApi(fileUrl).subscribe({
        next: (fileBlob: Blob) => {
          const fileType = fileBlob.type;
    
          // Check if the file is an image
          if (fileType.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
              const imageUrl = reader.result as string;
              this.openDialog(imageUrl, 'image');  // Display the image in a dialog
            };
            reader.readAsDataURL(fileBlob);
          }
          // Check if the file is a PDF
          else if (fileType === 'application/pdf') {
            const pdfUrl = URL.createObjectURL(fileBlob);
            this.openDialog(pdfUrl, 'pdf');  // Display the PDF in a dialog
          } else {
            console.error('Unsupported file type:', fileType);
          }
        },
        error: (error) => {
          console.error('Error fetching the file:', error);
        }
      });
    }
    openDialog(fileUrl: string, fileType: string): void {
        const dialogConfig = {
          data: { fileUrl, fileType },
          width: fileType === 'pdf' ? '90vw' : 'auto',  // Adjust width for PDF
          height: fileType === 'pdf' ? '90vh' : 'auto',  // Adjust height for PDF
          maxWidth: '90vw',       // Set maximum width to 90% of the viewport width for both types
          maxHeight: '90vh',      // Set maximum height to 90% of the viewport height for both types
          panelClass: 'custom-dialog-container'
        };
      
        const dialogRef = this.dialog.open(ImageDialogComponent, dialogConfig);
      
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      }
 
}
