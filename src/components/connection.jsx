import Button from "@mui/material/Button";
import serialConnection from "../utils/serialConnection"
import { useState } from "react";

function Connect() {
    const [response, setResponse] = useState("")
    async function handleConnection(){
        console.log("button is clicked ")
        try {
            const res = await serialConnection()
            setResponse(res)
            console.log(response)
        } catch (error) {
            console.log("error aaya")
        }
    }
	return (
		<>
			<div>
				<Button variant='contained' onClick={handleConnection} >Contained</Button>
			</div>
            <div style={{"color":"red", "fontSize": "30px", "margin" : "20px", "textShadow": "0 0 10px red"}}> 
                Device response is : {response}
            </div>
		</>
	);
}

export default Connect