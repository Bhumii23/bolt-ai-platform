"use client";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL, WORKER_API_URL } from "@/config";
import  { useRouter } from "next/navigation";

export function Prompt() {
    const [prompt, setPrompt] = useState("");
    const { getToken } = useAuth();
    const Router=useRouter();
    return (

        <div>
            <Textarea placeholder="Create a chess app" value={prompt} onChange={(e) => setPrompt(e.target.value)}></Textarea>
            <div className="flex justify-end ">
                < Button onClick={async () => {
                    const token = await getToken();
                    const response = await axios.post(`${BACKEND_URL}/project`, {
                        prompt: prompt,
                    }, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        }
                    })
                   await axios.post(`${WORKER_API_URL}/prompt`,
                    {projectId: response.data.projectId,
                    prompt:prompt,
                    });
                    Router.push(`/project/${response.data.projectId}`);
                }}>
                    <Send />
                </Button>
            </div>
        </div>
    );
}
