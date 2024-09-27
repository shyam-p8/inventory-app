export interface signUp{
    id:string
    role:string,
    username:string,
    password:string,
    mobile:number,
    name:string,
    designation:string

}

export interface login{
    username:string,
    password:string
}

export interface inventoryItem{
    make: string,
    model: string,
    category: string,
    order_id: number, //This is PO number id of po table
    receipt_date: string,
    warranty_expiration: string,
    serial_number: string, // Updated form control for multiple serial numbers
    status: string,
    assignment_id:number,
    notes: string,
    sub_category:string,
    condition:string,
    equipment_id:number,
    price:number
}

export interface issueInventory{
    assignee_id:number,
    assigned_type:string,
    assigned_condition:string,
    assigned_date:string,
    equipment_id:number,
    notes:string
   
}

export interface Order {
    id: number;
    po_number: string;
    po_type: string;
    project_id: string;
    project_name: string;
    supplier_id: string;
    supplier_name: string;
    purchase_date: string;
    created_by: string;
    created_on: string;
    updated_by?: string | null;
    updated_on?: string | null;
  }
  
  export interface Assignment {
    id: number;
    equipment: number;
    assigned_to: number;
    assigned_to_details:string
    assigned_type: string;
    assigned_date: string;
    letter_for_issue?: string | null;
    return_date?: string | null;
    assigned_condition: string;
    issue_person_name?: string | null;
    issue_person_code?: string | null;
    returned_condition?: string | null;
    letter_for_return?: string | null;
    return_person_name?: string | null;
    return_person_code?: string | null;
    notes?: string | null;
    created_by: string;
    created_on: string;
    updated_by?: string | null;
    updated_on?: string | null;
  }
  
  export interface InventoryReport {
    id: number;
    order: Order;
    category: string;
    sub_category: string;
    make: string;
    model: string;
    serial_number: string;
    price: string;
    receipt_date: string;
    warranty_expiration: string;
    status: string;
    condition: string;
    assignment_id?: number | null;
    notes: string;
    created_by: string;
    created_on: string;
    updated_by?: string | null;
    updated_on?: string | null;
    assignment?: Assignment | null;
  }
  
  export interface EmployeeRetirement {
    assigned_condition: string;
    assigned_date: string;
    assigned_to: number;
    assigned_type: string;
    category: string;
    date_of_birth: string;
    designation: string;
    email_address: string;
    employee_name: string;
    employee_number: number;
    equipment_id: number;
    id: number;
    is_retired: boolean;
    issue_person_code: string;
    issue_person_name: string;
    letter_for_issue: string | null;
    make: string;
    model: string;
    notes: string;
    office: string;
    oic_name: string;
    oic_no: number;
    original_date_of_hire: string;
    phone_no: string;
    retire_in_month: number;
    return_date: string | null;
    serial_number: string;
    sub_category: string;
    user_person_type: string;
    work_location: string;
  }
 