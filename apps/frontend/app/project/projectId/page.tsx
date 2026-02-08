"use client"; //this line tells next js that file must run in browser not on server
import { WORKER_API_URL, WORKER_URL } from "@/config";
import { Appbar } from "@/components/Appbar";
import { Prompt } from "next/dist/compiled/@next/font/dist/google";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { usePrompts } from "@/hooks/usePrompt";
import { useActions } from "@/hooks/useAction";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";


export default function ProjectPage({ params }: { params: { projectId: string } }) {
  const {prompts} =usePrompts(params.projectId);
  const {actions} =useActions(params.projectId);
  const [prompt,setPrompt]=useState("");
  const {getToken}=useAuth();
  return (
    <><div>
    
    <div className="flex h-screen">
        <div className="w-1/4 h-screen flex flex-col justify-between p-4 ">
          <div>
            Chat History
            {prompts.filter(prompt => prompt.type === "USER").map((prompt, index)=>(
              <div key={prompt.id} >

                {typeof prompt === 'string' ? prompt : prompt.content}
              </div>
            ))}
            {actions.map
            ((action, index)=>(
              <div key={index} >

                {typeof action === 'string' ? action : action.content}
              </div>
            ))}
            <div className="flex gap-2">
              <Input />
              <Button onClick={async ()=>{
                const token=await getToken();
                axios.post(`${WORKER_API_URL}/prompt`,{
                  projectId:params.projectId,
                  prompt:prompt,
                },{
                  headers:{
                    "Authorization":`Bearer ${token}`
                  }
                })
              }}>
                <Send />
              </Button>
            </div>
          </div>
          
        </div>
        <div className="w-3/4 p-8">
          <iframe src={`${WORKER_URL}/`} width={"100%"} height={"100%"}></iframe>
        </div>
        </div>
      </div></>
    );
}
