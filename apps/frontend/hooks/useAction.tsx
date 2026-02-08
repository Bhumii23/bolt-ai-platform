import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { useAuth } from "@clerk/nextjs";

interface Prompt{
    id: string;
    content: string;
    type:"USER|SYSTEM";
    createdAt: Date;
}

export function useActions(projectId:string) {
    const [actions, setActions] = useState<string[]>([]);
    const {getToken} =  useAuth();

   useEffect (()=>{
    function getActions(){
        axios.get(`${BACKEND_URL}/actions/${projectId}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }).then((response)=>{
            setActions(response.data.actions);
        })

    }
    getActions();
    let interval=setInterval(getActions,1000);
    return ()=>{
        clearInterval(interval);
    }
    },[])
    return {
        actions,

    };
}
