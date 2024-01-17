import paginationDto from "./paginationDto";

export default class userFilterDto extends paginationDto{
   name!: string |null
   email!: string | null
   
   constructor(obj: Partial  <userFilterDto> ){
    super();
    Object.assign(this, obj);
    this.setTakeAndSkip(this.take, this.skip);
   }
}