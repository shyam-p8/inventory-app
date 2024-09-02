import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { login } from '../data-type';
import {jwtDecode} from 'jwt-decode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  constructor(private userService : UserService, private router :Router){

  }
 

  onLogin(data: login) {

    this.userService.userLogin(data).subscribe({
      next: (result: any) => {
        //console.warn(result.accessToken);
        if (result && result.access) {
          // Decode the JWT token to get role and expiration time
          const decodedToken: any = jwtDecode(result.access);
  
          console.warn(decodedToken);
          // Extract role and expiration time (exp) from the token
          const role = decodedToken.role;
          const sessionEnd = decodedToken.exp * 1000; // Convert to milliseconds
  
          // Store the token, role, and username in session storage
          sessionStorage.setItem('token', result.access);
          sessionStorage.setItem('role', role);
          sessionStorage.setItem('username', decodedToken.username); // Assuming username is stored in 'sub'
          sessionStorage.setItem('session_end', sessionEnd.toString());
  
          console.log('Login successful');
          // Perform any additional logic on successful login
          this.router.navigate(['home']);
          
        } else {
          // Handle case where login response is not as expected
          console.error('Unexpected login response format');
        }
      },
      error: (error) => {
        console.error('Login failed', error);
        if (error.status === 400 || error.status === 401) {
          // Handle invalid username or password
          alert('Invalid username or password. Please try again.');
        } else {
          // Handle other errors
          alert('An error occurred during login. Please try again later.');
        }
      }
    });
  }
  

}
