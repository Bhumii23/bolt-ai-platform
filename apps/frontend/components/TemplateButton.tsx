"use client";
import { Button } from "@/components/ui/button";

export default function TemplateButtons() {
    const templates = [
        { label: "Tic Tac Toe", prompt: "Build a Tic Tac Toe game" },
        { label: "Chess App", prompt: "Build a Chess game" },
        { label: "To-Do List", prompt: "Build a Todo list app" },
        { label: "Weather App", prompt: "Build a Weather app" },
        { label: "Calculator", prompt: "Build a Calculator" },
    ];

    return (
        <div className="flex flex-wrap justify-center gap-4 p-4">
            {templates.map((template, index) => (
                <Button
                    key={index}
                    variant="outline"
                    className="rounded-full px-6 py-2 bg-background/50 hover:bg-background/80 hover:text-primary transition-all duration-300 border-primary/20 hover:border-primary/50"
                    onClick={() => {
                        // Logic to populate prompt would go here, but for now just a visual improvement
                        console.log("Selected template:", template.prompt);
                    }}
                >
                    {template.label}
                </Button>
            ))}
        </div>
    );
}

