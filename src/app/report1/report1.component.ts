import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface ItemData {
  id: number;
  name: string;
  price: number;
  issue_date: Date;
  receive_date: Date;
}

const ELEMENT_DATA: ItemData[] = [
  { id: 1, name: 'computer', price: 100, issue_date: new Date('2023-01-01'), receive_date: new Date('2023-02-05') },
  { id: 2, name: 'laptop', price: 200, issue_date: new Date('2023-02-15'), receive_date: new Date('2023-02-20') },
  { id: 3, name: 'computer', price: 1000, issue_date: new Date('2023-03-01'), receive_date: new Date('2023-04-05') },
  { id: 4, name: 'laptop', price: 2000, issue_date: new Date('2023-03-15'), receive_date: new Date('2023-05-20') },
  { id: 5, name: 'desktop', price: 10010, issue_date: new Date('2023-04-01'), receive_date: new Date('2023-06-05') },
  { id: 6, name: 'workstation', price: 20200, issue_date: new Date('2023-05-15'), receive_date: new Date('2023-07-20') },
  { id: 7, name: 'computer', price: 5824, issue_date: new Date('2023-06-01'), receive_date: new Date('2023-08-05') },
  { id: 8, name: 'laptop', price: 2548, issue_date: new Date('2023-02-28'), receive_date: new Date('2023-09-20') }
];


@Component({
  selector: 'app-report1',
  templateUrl: './report1.component.html',
  styleUrls: ['./report1.component.css']
})
export class Report1Component implements OnInit,AfterViewInit  {
  displayedColumns: string[] = ['id', 'name', 'price', 'issue_date', 'receive_date'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  nameFilter: string = '';
  priceFilter: string = '';
  searchFilter:string='';

  // Variables for date range filtering
  issueStartDate: Date | null = null;
  issueEndDate: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    //this.dataSource.paginator = this.paginator;
   // this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data: ItemData, filter: string): boolean => {
      const [nameFilter, priceFilter, issueStartDate, issueEndDate] = filter.split('$');

      const matchesName = nameFilter ? data.name.toLowerCase().includes(nameFilter) : true;
      const matchesPrice = priceFilter ? data.price.toString().includes(priceFilter) : true;
      const matchesDate = this.checkDateInRange(new Date(data.issue_date), issueStartDate ? new Date(issueStartDate) : null, issueEndDate ? new Date(issueEndDate) : null);
      const matchesSearch = this.searchFilter?(data.name.toLowerCase().includes(this.searchFilter) || data.price.toString().includes(this.searchFilter) || data.id.toString().includes(this.searchFilter)) : true;

      return matchesName && matchesPrice && matchesDate && matchesSearch;
     
    };
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Paginator initialization
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement?.value?.trim().toLowerCase() || ''; // Fallback to empty string if null
    this.dataSource.filter = filterValue;
  } 

  applyFilter1(event: Event, filterField: string) {
    const filterValue = (event.target as HTMLInputElement)?.value?.trim().toLowerCase() || '';
    if (filterField === 'name') {
      this.nameFilter = filterValue;
    } else if (filterField === 'price') {
      this.priceFilter = filterValue;
    }
    this.applyCombinedFilter();
  }

  applyDateRangeFilter() {
    this.applyCombinedFilter();
  }

  applyCombinedFilter() {
    const filterString = `${this.nameFilter}$${this.priceFilter}$${this.issueStartDate ? this.issueStartDate.toISOString() : ''}$${this.issueEndDate ? this.issueEndDate.toISOString() : ''}`;
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
    this.nameFilter = '';
    this.priceFilter = '';
    this.issueStartDate = null;
    this.issueEndDate = null;
    this.dataSource.filter = ''; // Reset filters
  }
}

/*
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface ItemData {
  id: number;
  name: string;
  price: number;
  issue_date: Date;
  receive_date: Date;
}

const ELEMENT_DATA: ItemData[] = [
  { id: 1, name: 'computer', price: 100, issue_date: new Date('2023-01-01'), receive_date: new Date('2023-02-05') },
  { id: 2, name: 'laptop', price: 200, issue_date: new Date('2023-02-15'), receive_date: new Date('2023-02-20') },
  { id: 3, name: 'computer', price: 1000, issue_date: new Date('2023-03-01'), receive_date: new Date('2023-04-05') },
  { id: 4, name: 'laptop', price: 2000, issue_date: new Date('2023-03-15'), receive_date: new Date('2023-05-20') },
  { id: 5, name: 'desktop', price: 10010, issue_date: new Date('2023-04-01'), receive_date: new Date('2023-06-05') },
  { id: 6, name: 'workstation', price: 20200, issue_date: new Date('2023-05-15'), receive_date: new Date('2023-07-20') },
  { id: 7, name: 'computer', price: 5824, issue_date: new Date('2023-06-01'), receive_date: new Date('2023-08-05') },
  { id: 8, name: 'laptop', price: 2548, issue_date: new Date('2023-02-28'), receive_date: new Date('2023-09-20') }
];

@Component({
  selector: 'app-report1',
  templateUrl: './report1.component.html',
  styleUrls: ['./report1.component.css']
})
export class Report1Component implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'price', 'issue_date', 'receive_date'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  nameFilter: string = '';
  priceFilter: string = '';
  searchFilter: string = ''; // New search filter

  // Variables for date range filtering
  issueStartDate: Date | null = null;
  issueEndDate: Date | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Set custom filterPredicate
    this.dataSource.filterPredicate = (data: ItemData, filter: string): boolean => {
      return this.applyCombinedFilter(data);
    };
  }

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement?.value?.trim().toLowerCase() || '';
    this.searchFilter = filterValue;
    this.dataSource.filter = ''; // Trigger filter update
  }

  applyFilter1(event: Event, filterField: string) {
    const filterValue = (event.target as HTMLInputElement)?.value?.trim().toLowerCase() || '';

    if (filterField === 'name') {
      this.nameFilter = filterValue;
    } else if (filterField === 'price') {
      this.priceFilter = filterValue;
    }

    this.dataSource.filter = ''; // Trigger filter update
  }

  applyDateRangeFilter() {
    this.dataSource.filter = ''; // Trigger filter update
  }

  applyCombinedFilter(data: ItemData): boolean {
    const matchesName = this.nameFilter ? data.name.toLowerCase().includes(this.nameFilter) : true;
    const matchesPrice = this.priceFilter ? data.price.toString().includes(this.priceFilter) : true;
    const matchesDate = this.checkDateInRange(new Date(data.issue_date), this.issueStartDate, this.issueEndDate);
    const matchesSearch = this.searchFilter?(data.name.toLowerCase().includes(this.searchFilter) || data.price.toString().includes(this.searchFilter) || data.id.toString().includes(this.searchFilter)) : true;

    return matchesName && matchesPrice && matchesDate && matchesSearch;
  }

  checkDateInRange(date: Date, startDate: Date | null, endDate: Date | null): boolean {
    if (!startDate && !endDate) {
      return true; // No date range filter applied
    }
    if (startDate && !endDate) {
      return date >= startDate;
    }
    if (!startDate && endDate) {
      return date <= endDate;
    }
    if (startDate && endDate) {
      return date >= startDate && date <= endDate;
    }
    return false;
  }

  clearFilters() {
    this.nameFilter = '';
    this.priceFilter = '';
    this.searchFilter = '';
    this.issueStartDate = null;
    this.issueEndDate = null;
    this.dataSource.filter = ''; // Reset filter
  }
}
*/