class ApiResponse{
    constructor(public statusCode:number=200,public data:any | null,public message:string="OK",public success?:boolean){
        this.success=statusCode<400
    }
}

export {ApiResponse}
