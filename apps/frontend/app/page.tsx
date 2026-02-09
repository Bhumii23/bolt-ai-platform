
import { Prompt } from "@/components/Prompt";
import { Appbar } from "@/components/Appbar";
import TemplateButtons from "@/components/TemplateButton";


export default function Home() {
  return (
    <div className="flex flex-col min-h-full">
      <Appbar />
      <div className="flex-1 flex flex-col justify-center items-center p-4 max-w-4xl mx-auto w-full space-y-12 pb-32">

        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            What do you want to build?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Prompt, click generate, and watch your app come to life.
          </p>
        </div>

        <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <Prompt />
          <TemplateButtons />
        </div>

      </div>
    </div>
  );
}