import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-dialog',
 
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.css']
})
export class ImageDialogComponent {
  public sanitizedPdfUrl: SafeResourceUrl | undefined;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { fileUrl: string, fileType: string },
    private sanitizer: DomSanitizer  // Inject DomSanitizer
  ) {
    // Sanitize the PDF URL
    if (data.fileType === 'pdf') {
      this.sanitizedPdfUrl = this.sanitizeUrl(data.fileUrl);
    }
  }

  // Sanitize the URL to mark it as safe
  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
