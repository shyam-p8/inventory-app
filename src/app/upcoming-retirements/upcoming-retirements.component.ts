import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../services/inventory.service';
import { EmployeeRetirement } from '../data-type';

@Component({
  selector: 'app-upcoming-retirements',
  templateUrl: './upcoming-retirements.component.html',
  styleUrls: ['./upcoming-retirements.component.css']
})
export class UpcomingRetirementsComponent implements OnInit{  
  employeeList: EmployeeRetirement[] = [];
  paginatedList: EmployeeRetirement[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 50;
  totalPages: number = 0;
  constructor(private inventoryService:InventoryService){}
  
  ngOnInit() {
    this.getEmployeeRetirementData();
  }

  getEmployeeRetirementData(){
    this.inventoryService.getEmployeeRetirementList().subscribe({next:(result:EmployeeRetirement[])=>{
    console.log(result);
    this.employeeList = result;
    this.totalPages = Math.ceil(this.employeeList.length / this.itemsPerPage);
    this.paginateList();
    },
    error:(error)=>{
     // this.errorMessage=error.message;
     console.warn(error.message);
    }    
  });
  }
  getRetirementDate(dateOfBirth: string): string {
    const birthDate = new Date(dateOfBirth);
    const retirementDate = new Date(birthDate.setFullYear(birthDate.getFullYear() + 62));
    return retirementDate.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
  }
  

  search() {
    const filteredList = this.employeeList.filter(employee => 
      employee.employee_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      employee.designation.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      employee.work_location.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.totalPages = Math.ceil(filteredList.length / this.itemsPerPage);
    this.paginatedList = filteredList.slice(0, this.itemsPerPage);
  }

  paginateList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedList = this.employeeList.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateList();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateList();
    }
  }



}
