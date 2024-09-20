import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inventoryItem, InventoryReport, issueInventory } from '../data-type';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { API_BASE_URL } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
   
 // private baseUrl = 'http://10.98.7.218:8000';
    private baseUrl=`${API_BASE_URL}`
  
  constructor(private http: HttpClient, private authService:AuthService) { }
  submitInventory(itemList: inventoryItem[]): Observable<any> {
    // Prepare the request body
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

  updateInventory(inventoryId:number,inventoryItem: inventoryItem): Observable<any> {
    const accessToken = this.authService.getAccessToken(); // Replace with the actual access token
    // Prepare the headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    console.warn(`${this.baseUrl}/equipment/update_equipment/${inventoryId}/`);
    return this.http.put(`${this.baseUrl}/equipment/update_equipment/${inventoryId}/`, inventoryItem, { headers } );
  }

  getAssigneeDetails(assignedType: string, assigneeId: number) {
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}/assignee/${assignedType}/${assigneeId}/`, { headers } );
  }

  getHeaders(){
    //get token from session storage
    const accessToken = this.authService.getAccessToken(); 
    // Prepare the headers
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${accessToken}`});
    return headers;
  }

  issueInventory(formData: FormData): Observable<any>{
   const headers = this.getHeaders();
   return this.http.post(`${this.baseUrl}/assignment/issue_equipment/`, formData,{ headers } );
  }

  returnInventory(assigned_id:number,formData: FormData): Observable<any>{
    const headers = this.getHeaders();
    return this.http.put(`${this.baseUrl}/assignment/receive_equipment/${assigned_id}/`, formData,{ headers } );
  }
  getStatusLov(){
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}/misc/status/`,{ headers});
  }
  getItemConditionLov(){
    const headers = this.getHeaders();
    return this.http.get(`${this.baseUrl}/misc/condition/`,{ headers});
  }

  getInventoryAssignmentDetail(assignment_id:number){
    const headers = this.getHeaders();
   return this.http.get(`${this.baseUrl}/assignment/get_assignment_list/${assignment_id}`,{ headers});
  }
  getReceiptTemplate(receiptType:string,assignment_id:number){
    const headers = this.getHeaders();   
    const url = receiptType === 'receive' ? `${this.baseUrl}/assignment/get_return_slip/${assignment_id}`:`${this.baseUrl}/assignment/get_issue_slip/${assignment_id}`;
    return this.http.get(url, { headers, responseType: 'text' });
  }
  getInventoryReport(){
    const headers = this.getHeaders();  
    return this.http.get<InventoryReport[]>(`${this.baseUrl}/equipment/get_equipment_list_with_serializer/`,{ headers})
    }

}
