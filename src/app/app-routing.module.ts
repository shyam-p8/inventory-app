import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddInventoryComponent } from './add-inventory/add-inventory.component';
import { EditInventoryComponent } from './edit-inventory/edit-inventory.component';
import { IssueInventoryComponent } from './issue-inventory/issue-inventory.component';

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
    children: [
      { path: 'add-inventory', component: AddInventoryComponent },
      { path: 'edit-inventory', component: EditInventoryComponent },
      {path:'issue-inventory', component:IssueInventoryComponent}      
    ]
  },
  {
    path:'navbar',
    component:NavbarComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
