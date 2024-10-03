import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthGuard } from './services/auth.guard';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { AddInventory2Component } from './add-inventory2/add-inventory2.component';
import { EditInventory2Component } from './edit-inventory2/edit-inventory2.component';
import { IssueInventory2Component } from './issue-inventory2/issue-inventory2.component';
import { ReceiveInventory2Component } from './receive-inventory2/receive-inventory2.component';
import { AssignmentHistoryComponent } from './assignment-history/assignment-history.component';
import { UpcomingRetirementsComponent } from './upcoming-retirements/upcoming-retirements.component';
import { BarcodeComponent } from './barcode/barcode.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'login',
    pathMatch:'full'
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'home',
    component:HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'add-inventory2', component:AddInventory2Component },
      { path: 'edit-inventory2', component:EditInventory2Component },
      {path:'issue-inventory2', component:IssueInventory2Component},
      {path:'receive-inventory2', component:ReceiveInventory2Component},
      {path:'assignment-history',component:AssignmentHistoryComponent},
      {path:'inventory-report',component:InventoryReportComponent},
      {path:'upcoming-retirements',component:UpcomingRetirementsComponent},
      {path:'barcode',component:BarcodeComponent},
      
    ]     
  },
  { path:'navbar', component:NavbarComponent },
  { path: 'login', component: LoginComponent },  // Allow login page without guard
  { path: '**', redirectTo: '/login' },  // Wildcard route for non-authenticated routes
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
