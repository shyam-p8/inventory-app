import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private authService : AuthService){ }
  sessionTime: string = '';

 

  ngOnInit(): void {
    this.authService.sessionTime$.subscribe((remainingTime) => {
      this.sessionTime = this.formatTime(remainingTime);
    });
  }

  // Method to format time in MM:SS format
  private formatTime(milliseconds: number): string {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  private padZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  logout(){

    this.authService.logout();

  }

}
