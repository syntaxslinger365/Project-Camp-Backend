import {ApiResponse} from "../utils/API_response.js";

import { asyncHandler } from "../utils/async-handeler.js";

// we have made a function  for this called asyncHandler
/*
const healthCheck = async(req,res,next)=>{
    try {
        const user = await getUserFronDB();
        res
            .status(200)
            .json(new ApiResponse(200,{message:"Server is running"}));
        
    } catch (error) {
        next(err)
        
    }
}
    */

const healthCheck = asyncHandler(async(req ,res)=>{
    res
    .status(200)
    .json(new ApiResponse(200,{message:"Server is running"}))
})

export {healthCheck}