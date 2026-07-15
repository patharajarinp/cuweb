import React, {memo} from "react";

 const TextareaComment = memo(props=>{
   console.log('object',props.id)
    return (
       <textarea {...props}/>
    )}) 
export default TextareaComment