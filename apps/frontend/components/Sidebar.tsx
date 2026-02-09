"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { MessageSquare, Plus, Layout, History } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/config";

interface Project {
    id: string;
    description: string;
    createdAt: string;
}

export function Sidebar() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = await getToken();
                const response = await axios.get(`${BACKEND_URL}/projects`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                setProjects(response.data.projects);
            } catch (error) {
                console.error("Failed to fetch projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [getToken]);

    return (
        <div className="h-screen w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex flex-col pt-4">
            <div className="px-4 mb-6">
                <div className="flex items-center gap-2 font-bold text-xl mb-6 text-primary">
                    <div className="bg-primary/20 p-2 rounded-lg">
                        <Layout className="w-6 h-6 text-primary" />
                    </div>
                    Bolty
                </div>
                <Link href="/">
                    <Button className="w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                        <Plus className="w-4 h-4" />
                        New Project
                    </Button>
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
                <div className="px-2 mb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
                    Recent Projects
                </div>
                {loading ? (
                    <div className="px-4 py-2 text-sm text-muted-foreground animate-pulse">
                        Loading history...
                    </div>
                ) : projects.length === 0 ? (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                        No projects yet.
                    </div>
                ) : (
                    <div className="space-y-1">
                        {projects.map((project) => (
                            <Link key={project.id} href={`/project/${project.id}`}>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-2 h-auto py-3 px-3 font-normal text-muted-foreground hover:text-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 border border-transparent hover:border-sidebar-border"
                                >
                                    <MessageSquare className="w-4 h-4 shrink-0" />
                                    <div className="truncate text-sm text-left w-full">
                                        {project.description || "Untitled Project"}
                                    </div>
                                </Button>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="p-4 border-t border-sidebar-border">
               <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <History className="w-3 h-3"/>
                    <span>History provided by Bolty</span>
               </div>
            </div>
        </div>
    );
}
