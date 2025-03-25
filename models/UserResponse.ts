export class UserResponse{
    birthDate:string;
    gender:string;
    userAddress:string;
    userBalance:number;
    userEmail:string;
    userId:string;
    userName:string;
    userPhoneNumber:string;
    userProfile:string;
    constructor(birthDate:string, gender:string, userAddress:string, userBalance:number, userEmail:string, userId:string, userName:string, userPhoneNumber:string, userProfile:string){
        this.birthDate = birthDate
        this.gender = gender
        this.userAddress = userAddress
        this.userBalance = userBalance
        this.userEmail = userEmail
        this.userId = userId
        this.userName = userName
        this.userPhoneNumber = userPhoneNumber
        this.userProfile = userProfile

    }
}