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
    name:string,
    make: string,
    model: string,
    category: string,
    order_id: number, //This is PO number id of po table
    receipt_date: string,
    warranty_expiration: string,
    serial_number: string, // Updated form control for multiple serial numbers
    status: string,
    location:string,
    assignment_id:number,
    notes: string,
    sub_category:string,
    condition:string,
    equipment_id:number,
}

export interface issueInventory{
    assignee_id:number,
    assigned_type:string,
    assigned_condition:string,
    assigned_date:string,
    equipment_id:number,
    notes:string
   
}
// export interface product{
//     id:string
//     name:string,
//     price:number,
//     color:string,
//     description:string,
//     image:string,
//     category:string,
//     quantity:undefined|number,
//     productId:undefined|string
// }

// export interface cart{
//     id:string | undefined,
//     name:string,
//     price:number,
//     color:string,
//     description:string,
//     image:string,
//     category:string,
//     quantity:undefined|number,
//     productId:string,
//     userId:string
// }

// export interface priceSummary{
//     price:number,
//     discount:number,
//     tax:number,
//     delivery:number,
//     total:number
// }

// export interface orderData{
// id:string,
// address : string,
// email:string,
// contact:number,
// totalPrice:number,
// orderType:string,
// userId:string
// }