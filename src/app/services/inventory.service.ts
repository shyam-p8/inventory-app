import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { invntoryItem } from '../data-type';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  
  private baseUrl = 'http://10.98.7.218:8000';

  constructor(private http: HttpClient, private authService:AuthService) { }


  submitInventory(itemList: invntoryItem[]): Observable<any> {
    // Prepare the request body
    const body = {
      items: itemList // Assuming you want to send the item list in the request body
    };

    // Get the access token (you should retrieve this from your authentication service)
    const accessToken = this.authService.getAccessToken(); // Replace with the actual access token

    // Prepare the headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });


    // Make the HTTP POST request
    return this.http.post(this.baseUrl+'/equipment/create_equipment_list/', itemList, { headers });
  }


  getInventoryBySerialNumber(serialNumber: string): Observable<any> {
    const accessToken = this.authService.getAccessToken(); // Replace with the actual access token

    // Prepare the headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    return this.http.get(`${this.baseUrl}/equipment/get_equipment_list/?serial_number=${serialNumber}`, { headers } );
  }

  updateInventory(inventoryId:number,inventoryItem: invntoryItem): Observable<any> {
    const accessToken = this.authService.getAccessToken(); // Replace with the actual access token
    // Prepare the headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    console.warn(`${this.baseUrl}/equipment/update_equipment/${inventoryId}/`);
    return this.http.put(`${this.baseUrl}/equipment/update_equipment/${inventoryId}/`, inventoryItem, { headers } );
  }
}
