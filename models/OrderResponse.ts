import { ItemResponse } from "./ItemResponse";

export class OrderResponse{
    orderId:string;
    orderDetails:string;
    orderDate:string;
    quantity:number;
    item:ItemResponse;
    totalHarga:number;
    confirmed:string;
    constructor(orderId:string, orderDetails:string, orderDate:string, quantity:number, totalHarga:number,confirmed:string, item:ItemResponse){
        this.orderId = orderId;
        this.orderDetails = orderDetails;
        this.orderDate = orderDate;
        this.quantity = quantity;
        this.totalHarga = totalHarga
        this.confirmed = confirmed
        this.item = item
    }
}