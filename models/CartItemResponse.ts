import { ItemResponse } from "./ItemResponse";

export class CartItemResponse{
    cartItemId:string;
    cartId:string;
    item: ItemResponse;
    quantity:number;
    constructor(cartItemId:string, cartId:string, item:ItemResponse, quantity:number){
        this.cartItemId = cartItemId;
        this.cartId = cartId;
        this.item = item;
        this.quantity = quantity;
    }
}