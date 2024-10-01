import { NgModule,NO_ERRORS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { ItemDetailDialogComponent } from './item-detail-dialog/item-detail-dialog.component';
import { SerialNumberDetailsComponent } from './serial-number-details/serial-number-details.component';
import { AddInventory2Component } from './add-inventory2/add-inventory2.component';
import { EditInventory2Component } from './edit-inventory2/edit-inventory2.component';
import { IssueInventory2Component } from './issue-inventory2/issue-inventory2.component';
import { ReceiveInventory2Component } from './receive-inventory2/receive-inventory2.component';
import { AssignmentHistoryComponent } from './assignment-history/assignment-history.component';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { UpcomingRetirementsComponent } from './upcoming-retirements/upcoming-retirements.component';
import { BarcodeComponent } from './barcode/barcode.component';





@NgModule({
  declarations:[
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarComponent,  
    InventoryReportComponent,  
    ItemDetailDialogComponent,
    SerialNumberDetailsComponent,
    AddInventory2Component,
    EditInventory2Component,
    IssueInventory2Component,
    ReceiveInventory2Component,
    AssignmentHistoryComponent,
    ImageDialogComponent,
    UpcomingRetirementsComponent,
    BarcodeComponent,      
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDialogModule,
    
    ],
   // schemas: [NO_ERRORS_SCHEMA], // Add this line
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
