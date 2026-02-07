import { XMLParser } from "fast-xml-parser";

export class ArtifactProcessor{
    public currentArtifact: string; //current.. indicates what is left i the procedure
    private onFileContent: (filePath:string,fileContent:string)=> void;
    private onShellCommand:(shellComaand:string)=>void;
    private readonly parser:XMLParser;
    constructor(currentArtifact:string,onFileContent:(filePath:string,fileContent:string)=>void,onShellCommand:(shellCommand:string)=>void){
        this.currentArtifact=currentArtifact;
        this.onFileContent=onFileContent;
        this.onShellCommand=onShellCommand;
        this.parser = new XMLParser({ ignoreAttributes: false });
    }
    append(artifact:string){
        this.currentArtifact+=artifact;
    }




parse() {
  if (!this.currentArtifact.includes("</boltAction>")) return;

  try {
    const data = this.parser.parse(this.currentArtifact);

    const action = data?.boltArtifact?.boltAction;
    if (!action) return;

    const type = action["@_type"];

    if (type === "shell") {
      const cmd = action["#text"]?.trim();
      if (cmd) this.onShellCommand(cmd);
    }

    if (type === "file") {
      const filePath = action["@_filePath"];
      const content = action["#text"] ?? "";
      if (filePath) this.onFileContent(filePath, content);
    }

    this.currentArtifact = "";
  } catch (e) {
    // ignore partial or invalid XML
  }
}


}