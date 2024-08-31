import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { login } from '../data-type';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  constructor(private userService : UserService){

  }

  onLogin(data:login){
    console.warn("login data = ",data.username,data.password);
    this.userService.userLogin(data);
  }

}
