import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'inventory-app';

  constructor(private authService:AuthService){

  }

  ngOnInit(): void {
    this.authService.checkSession();
    
    // Check every minute
    setInterval(() => {
      this.authService.checkSession();
    }, 60000); // 60000 milliseconds = 1 minute
  }
}
