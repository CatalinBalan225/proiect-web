import paginationDto from "./paginationDto";

export default class requestsFilterDto extends paginationDto{
   title!: string |null
   status!: string | null
   
   constructor(obj: Partial  <requestsFilterDto> ){
    super();
    Object.assign(this, obj);
    this.setTakeAndSkip(this.take, this.skip);
   }
}