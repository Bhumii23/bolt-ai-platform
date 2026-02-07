// import cors from 'cors';
// import express, { text } from 'express';
// import {prismaClient} from 'db/client';
// import { systemPrompt } from './systemPrompt';
// import {GoogleGenAI} from "@google/genai";

// const app = express();
// app.use(express.json());
// app.use(cors());

// app.post("/prompt", async (req, res) => {
//     const {prompt,projectId} = req.body;
//         const client = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY
// });
//     await prismaClient.prompt.create({
//         data: {
//             content: prompt,
//             projectId,
//             type:"USER", //type of my message is user
//         },
//     })


// const allprompt=await prismaClient.prompt.findMany({
//     orderBy:{
//         createdAt:"asc",
//     },
// })

// let artifactProcessor = new ArtifactProcessor("",onFileUpdate,onShellCommand);
// let artifact ="";

// //chat history like llm cant recogenise long text o the below code is for chat history 
// let response= clearInterval.messages.stream({
//     messages: allprompt.map((p:any)=>({
//          role: p.type==="USER"?"user":"assistant", 

//          content: p.content
  
// })),
//    system:systemPrompt, //measssages user gave but what is supposed to do with that message is system prompt
//   model: "gemini-1.5-pro",
//   max_tokens: 1024,

// }).on("text", (text) => {
//     artifactProcessor.append(text);
//     artifactProcessor.parse();
//     artifact += text;
// }).on("finalMessage",async(message)=>{
//     console.log("done");
//     await prismaClient.prompt.create({
//         data: {
//             content: artifact,
//             projectId,
//             type:"SYSTEM", //type of genai message is system
//         },
//     })

// })
// .on("error", (err) => {
//     console.error("Error:", err);
// });
//    res.json({response});

// });
// app.listen(9091, () => {
//     console.log('Worker service is running on port 9091');
// });


import cors from "cors";
import express from "express";
import { prismaClient } from 'db/client';
import { systemPrompt } from "./systemPrompt";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ArtifactProcessor } from "./parser";
import { onFileUpdate, onShellCommand } from "./os";

// IMPORTANT: ensure API key exists
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
app.use(express.json());
app.use(cors());

app.post("/prompt", async (req, res) => {
  try {
    const { prompt, projectId } = req.body;

    if (!prompt || !projectId) {
      return res.status(400).json({ error: "Missing prompt or projectId" });
    }

    // Save USER prompt
    await prismaClient.prompt.create({
      data: {
        content: prompt,
        projectId,
        type: "USER",
      },
    });

    // Load chat history for THIS project
    const allPrompts = await prismaClient.prompt.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });

    // Prepare messages for Gemini
    const messages = [
      {
        role: "system",
        parts: [{ text: systemPrompt }],
      },
      ...allPrompts.map((p: any) => ({
        role: p.type === "USER" ? "user" : "model",
        parts: [{ text: p.content }],
      })),
    ];

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    });

    // Streaming response
    const result = await model.generateContentStream({
      contents: messages,
    });
    let artifactProcessor=new ArtifactProcessor("",onFileUpdate,onShellCommand);
    let artifact = "";

    for await (const chunk of result.stream) {
      const text = chunk.text();
      

      // If you have ArtifactProcessor
      artifactProcessor.append(text);
      artifactProcessor.parse();
      artifact += text;
    }

    // Save AI response
    await prismaClient.prompt.create({
      data: {
        content: artifact,
        projectId,
        type: "SYSTEM",
      },
    });

    res.json({ response: artifact });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(9091, () => {
  console.log("Worker service is running on port 9091");
});
