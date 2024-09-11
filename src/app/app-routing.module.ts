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
      { path: '', redirectTo: 'issue-inventory', pathMatch: 'full' },
      { path: '**', redirectTo: 'issue-inventory' }
    ]     
  },
  {    path:'navbar', component:NavbarComponent },
  { path: 'login', component: LoginComponent },  // Allow login page without guard
  { path: '', redirectTo: '/home', pathMatch: 'full' },  // Default route
  { path: '**', redirectTo: '/login' },  // Wildcard route for non-authenticated routes
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
