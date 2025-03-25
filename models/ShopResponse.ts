export class ShopResponse{
    address:string;
    createdAt: string;
    description: string;
    ownerId: string;
    rating:number;
    shopId:string;
    shopName:string;
    constructor(address:string, createdAt:string, description:string, ownerId:string, rating:number, shopId:string, shopName:string){
        this.address = address;
        this.createdAt = createdAt;
        this.description = description;
        this.ownerId = ownerId;
        this.rating = rating;
        this.shopId = shopId;
        this.shopName = shopName;
    }
}