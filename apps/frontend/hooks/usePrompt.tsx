import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";
import { headers } from "next/headers";

interface Prompt{
    id: string;
    content: string;
    type:"USER|SYSTEM";
    createdAt: Date;
}

export function usePrompts(projectId:string) {
    const [prompts, setPrompts] = useState<string[]>([]);
    const {getToken} =  useAuth();

   useEffect (()=>{
    function getPrompts(){
        axios.get(`${BACKEND_URL}/prompts/${projectId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }).then((response)=>{
            setPrompts(response.data.prompts);
        })

    }
    getPrompts();
    let interval=setInterval(getPrompts,1000);
    return ()=>{
        clearInterval(interval);
    }
    },[])
    return {
        prompts,

    };
}
