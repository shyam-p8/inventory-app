import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { EditInventoryComponent } from './edit-inventory/edit-inventory.component';
import { IssueInventoryComponent } from './issue-inventory/issue-inventory.component';
import { ReceiveInventoryComponent } from './receive-inventory/receive-inventory.component';
import { AuthGuard } from './services/auth.guard';
import { InventoryReportComponent } from './inventory-report/inventory-report.component';
import { Report1Component } from './report1/report1.component';
import { AddInventory2Component } from './add-inventory2/add-inventory2.component';
import { EditInventory2Component } from './edit-inventory2/edit-inventory2.component';
import { IssueInventory2Component } from './issue-inventory2/issue-inventory2.component';

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
      { path: 'add-inventory', component: AddInventoryComponent },
      { path: 'edit-inventory', component: EditInventoryComponent },
      {path:'issue-inventory', component:IssueInventoryComponent},
      {path:'receive-inventory', component:ReceiveInventoryComponent}, 
      {path:'inventory-report',component:InventoryReportComponent},
      {path:'report1',component:Report1Component},
      // redesign form route
      { path: 'add-inventory2', component: AddInventory2Component },
      { path: 'edit-inventory2', component: EditInventory2Component },
      {path:'issue-inventory2', component:IssueInventory2Component},
      // { path: '', redirectTo: 'issue-inventory', pathMatch: 'full' },
      // { path: '**', redirectTo: 'issue-inventory' }
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
