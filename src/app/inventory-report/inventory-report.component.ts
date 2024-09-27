import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { InventoryService } from '../services/inventory.service';
import { InventoryReport } from '../data-type';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material/dialog';
import { ItemDetailDialogComponent } from '../item-detail-dialog/item-detail-dialog.component';
import { SerialNumberDetailsComponent } from '../serial-number-details/serial-number-details.component';


@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.css']
})
export class InventoryReportComponent implements OnInit {
  displayedColumns: string[] = ['id', 'category', 'make','model','serial_number','condition','status', 'receipt_date','assignment_type','assigned_to'];
  dataSource = new MatTableDataSource();
  searchFilter:string='';
  categoryFilter: string = '';
  conditionFilter: string = '';

   // Variables for date range filtering
   issueStartDate: Date | null = null;
   issueEndDate: Date | null = null;
   receiveStartDate: Date | null = null;
   receiveEndDate: Date | null = null;
   inventoryReports: InventoryReport[] = [];

  
   @ViewChild(MatPaginator) paginator!: MatPaginator;
   @ViewChild(MatSort) sort!: MatSort;

   constructor(private inventoryService:InventoryService,private dialog: MatDialog){

   }
    ngOnInit() {
     this.getInventoryReport();
     this.dataSource.data=this.inventoryReports;

     this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      //const item = data as inventoryReport; // Cast data to inventoryReport
      const [categoryFilter, conditionFilter, issueStartDate, issueEndDate] = filter.split('$');
      const matchesCategory = categoryFilter ? data.category.toLowerCase().includes(categoryFilter) : true;
      // Match condition filter (case-insensitive)
     //const matchesCondition = conditionFilter ? data.condition.toLowerCase().includes(conditionFilter) : true;
     const matchesCondition = conditionFilter ? (data.condition ? data.condition.toLowerCase().includes(conditionFilter) : false) : true;

      const matchesDate = this.checkDateInRange(new Date(data.receipt_date), issueStartDate ? new Date(issueStartDate) : null, issueEndDate ? new Date(issueEndDate) : null);
      const matchesSearch = this.searchFilter?(data.category.toLowerCase().includes(this.searchFilter) || data.condition.toLowerCase().includes(this.searchFilter) || data.id.toString().includes(this.searchFilter)) : true;
      return matchesCategory && matchesCondition && matchesDate && matchesSearch;
     
    };

    }

   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Paginator initialization
    this.dataSource.sort = this.sort;
  }
    getInventoryReport(){
      this.inventoryService.getInventoryReport().subscribe({next:
        (response: InventoryReport[]) => {
          this.inventoryReports = response; // Assign API response to the class property
          console.warn("Inventory list =", this.inventoryReports); 
          this.dataSource.data = this.inventoryReports;
        },
        error: (error) => {
          alert(error.message);
         } 
        }); 
    }

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement?.value?.trim().toLowerCase() || ''; // Fallback to empty string if null
    this.dataSource.filter = filterValue;
  } 

  applyFilter1(event: Event, filterField: string) {
    const filterValue = (event.target as HTMLInputElement)?.value?.trim().toLowerCase() || '';
    if (filterField === 'category') {
      this.categoryFilter = filterValue;
    } else if (filterField === 'condition') {
      this.conditionFilter = filterValue;
    }
    this.applyCombinedFilter();
  }

  applyDateRangeFilter() {
    this.applyCombinedFilter();
  }

  applyCombinedFilter() {
    const filterString = `${this.categoryFilter}$${this.conditionFilter}$${this.issueStartDate ? this.issueStartDate.toISOString() : ''}$${this.issueEndDate ? this.issueEndDate.toISOString() : ''}`;
    this.dataSource.filter = filterString; // Trigger filtering
  }

  checkDateInRange(date: Date, startDate: Date | null, endDate: Date | null): boolean {
    if (!startDate && !endDate) return true;
    if (startDate && !endDate) return date >= startDate;
    if (!startDate && endDate) return date <= endDate;
    if (startDate && endDate) return date >= startDate && date <= endDate;
    return false;
  }

  clearFilters() {
    this.searchFilter='';
    this.categoryFilter = '';
    this.conditionFilter = '';
    this.issueStartDate = null;
    this.issueEndDate = null;
    this.dataSource.filter = ''; // Reset filters
  }
//Create a method to generate and download the table data in Excel file:
  exportAsExcel() {
    const filteredData = this.dataSource.filteredData;
   
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory Report');
  
  // Generate Excel file and trigger download
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'Inventory_Report');
  }
  
  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
  }
  openItemDetails(element: any): void {
    if (element.assignment) {
      this.dialog.open(ItemDetailDialogComponent, {
        width: '400px',
        data: {
          assignment: element.assignment  // Pass the assignment details to the dialog
        }
      });
    }
  }

  openSerialNumberDetails(inventory: InventoryReport): void {
    const dialogRef = this.dialog.open(SerialNumberDetailsComponent, {
      width: '500px',
      data: inventory
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog was closed');
    });
  }
   
}
