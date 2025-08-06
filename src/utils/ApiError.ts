class ApiError extends Error{
    constructor(public statusCode:number,public message:string,public errors?:any,public stack?:null | any,public success?:false)
    {
        super(message)
        this.success=false
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(stack);
        }
    }
}

export {ApiError}