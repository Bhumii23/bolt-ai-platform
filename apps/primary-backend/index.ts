import "dotenv/config";
import { prismaClient } from 'db/client';
import express from 'express';
import cors from 'cors';
import { authMiddleware } from './middleware';



declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

const app = express();
app.use(express.json());
app.use(cors());

app.post("/project", authMiddleware, async (req, res) => {
    const { prompt } = req.body;
    console.log(req.userId)
    const userId = req.userId!;
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    //add logic to get useful name from prompt
    const description = prompt.split("\n")[0];
    const project = await prismaClient.project.create({
        data: {
            description,
            userId: req.userId!,

        }
    });
    res.json({ projectId: project.id });

});

app.get("/projects", authMiddleware, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    const projects = await prismaClient.project.findMany({
        where: { userId }
    });
    res.json({ projects });
});

app.get("/prompts/:projectId", authMiddleware, async (req, res) => {
    const userId = req.userId!;
    const projectId = req.params.projectId as string;
    const prompts = await prismaClient.prompt.findMany({
        where: { projectId },
    });
    res.json({ prompts });
});

app.get("/actions/:projectId", authMiddleware, async (req, res) => {
    const userId = req.userId!;
    const projectId = req.params.projectId as string;
    const actions = await prismaClient.action.findMany({
        where: { projectId },
    });
    res.json({ actions });
});

app.listen(9090, () => {
    console.log("Server is running on port 9090");
});