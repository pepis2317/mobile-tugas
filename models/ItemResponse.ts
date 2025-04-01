export class ItemResponse {
    itemId: string;
    shopId: string;
    itemName: string;
    itemDesc: string;
    quantity: number;
    hargaPerItem: number;
    thumbnail?: string | null;
    constructor(itemId:string, shopId:string, itemName: string, itemDesc:string, quantity:number, hargaPerItem:number, thumbnail:string){
        this.itemId = itemId;
        this.shopId = shopId;
        this.itemName = itemName;
        this.itemDesc = itemDesc;
        this.quantity = quantity;
        this.hargaPerItem = hargaPerItem;
        this.thumbnail = thumbnail;
    }
}