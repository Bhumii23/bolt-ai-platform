"use client";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { BACKEND_URL, WORKER_API_URL } from "@/config";
import { useRouter } from "next/navigation";

export function Prompt() {
    const [prompt, setPrompt] = useState("");
    const { getToken } = useAuth();
    const Router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="relative bg-background/40 backdrop-blur-sm rounded-xl border border-primary/10 shadow-2xl p-2 group focus-within:ring-2 ring-primary/20 transition-all duration-300">
            <Textarea
                placeholder="Describe your dream app..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="resize-none border-none focus-visible:ring-0 bg-transparent min-h-[120px] text-lg p-4 placeholder:text-muted-foreground/50"
            />
            <div className="flex justify-between items-center px-4 pb-2">
                <div className="text-xs text-muted-foreground">
                    Use clear and detailed instructions
                </div>
                <Button
                    disabled={isLoading || !prompt.trim()}
                    onClick={async () => {
                        setIsLoading(true);
                        try {
                            const token = await getToken();
                            const response = await axios.post(`${BACKEND_URL}/project`, {
                                prompt: prompt,
                            }, {
                                headers: {
                                    "Authorization": `Bearer ${token}`,
                                }
                            });
                            await axios.post(`${WORKER_API_URL}/prompt`, {
                                projectId: response.data.projectId,
                                prompt: prompt,
                            });
                            Router.push(`/project/${response.data.projectId}`);
                        } catch (e) {
                            console.error(e);
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                    className="rounded-full w-10 h-10 p-0 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
                </Button>
            </div>
        </div>
    );
}
