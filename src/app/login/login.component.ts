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


const token = 'eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJBTVJDRUxMIiwidXNlciI6IkFNUkNFTEwiLCJyb2xlIjoiQU1SQ0VMTCIsInN0YXR1cyI6ImFjdGl2ZSIsImlhdCI6MTcyNTEwODI0OCwiZXhwIjoxNzI1MTExODQ4fQ.mws7XOFFmRVbmFDoLHOJ-H4FL8NWM6yMlora4GsaYaGkCkehFssiNFqH8MuGDVto';

try {
  const decodedToken = jwtDecode(token);
  console.log('Decoded Token:', decodedToken);
} catch (error) {
  console.error('Error decoding token:', error);
}

    this.userService.userLogin(data).subscribe({
      next: (result: any) => {
        //console.warn(result.accessToken);
        if (result && result.accessToken) {
          // Decode the JWT token to get role and expiration time
          const decodedToken: any = jwtDecode(result.accessToken);
  
          // Extract role and expiration time (exp) from the token
          const role = decodedToken.role;
          const sessionEnd = decodedToken.exp * 1000; // Convert to milliseconds
  
          // Store the token, role, and username in session storage
          sessionStorage.setItem('token', result.accessToken);
          sessionStorage.setItem('role', role);
          sessionStorage.setItem('username', decodedToken.sub); // Assuming username is stored in 'sub'
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
