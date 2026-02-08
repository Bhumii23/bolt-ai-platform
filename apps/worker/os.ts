import { prismaClient } from "db/client";

const BASE_WORKER_DIR=process.env.BASE_WORKER_DIR || "/tmp/bolty-worker";
if(!Bun.file(BASE_WORKER_DIR).exists()){
    Bun.write(BASE_WORKER_DIR,"");
}

export async function onFileUpdate(filePath: string, fileContent: string,projectId:string){
    await Bun.write(`${BASE_WORKER_DIR}/${filePath}`,fileContent);
    await prismaClient.action.create({
        data: {
            projectId: projectId,
            content: `File updated: ${filePath}`,
            
        }
    });
}
export async function onShellCommand(shellCommand:string,projectId:string){
    //npm run build && npm run start
    const commands = shellCommand.split("&&");
    for (const command of commands) {
        console.log(`Running command: ${command}`);
        const result=Bun.spawnSync({cmd:command.split(" "),cwd:BASE_WORKER_DIR});
        await prismaClient.action.create({
            data: {
                projectId: projectId,
                content:`Run Command: ${command}`,
            }   
        });
        
        console.log(result.stdout);
        console.log(result.stderr.toString()); //error

    }

}
//spawnSync:run commands synchronously and split npm,run,dev,cwd runs command inside generated project directory