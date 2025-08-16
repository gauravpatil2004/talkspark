import express from 'express';
import Thread from "../models/Thread.js";
import getGeminiAPIResponse from "../utils/Gem.js";

const router = express.Router();

router.post("/test", async(req, res) => {
    try {
        const thread = new Thread({
            threadId: "test-thread2",
            title: "Test Thread123"
        });
        await thread.save();
        res.status(201).json({ message: "Thread created successfully", thread });
    } catch (error) {
        console.error("Error creating thread:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/threads", async (req, res) => {
    try {
        const threads = await Thread.find().sort({ updatedAt: -1 });
        res.json(threads);
    } catch(err) {
        console.error("Error fetching threads:", err);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/threads/:threadId", async(req, res) => {
    const {threadId} = req.params;

    try {
        const thread = await Thread.findOne({ threadId });

        if(!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.json(thread.messages);
    } catch(err) {
        console.error("Error fetching thread:", err);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.delete("/threads/:threadId", async(req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOneAndDelete({ threadId }); 
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        res.json({ message: "Thread deleted successfully" });
    } catch (err) {
        console.error("Error deleting thread:", err);
        res.status(500).json({ error: "Internal server error" });
    }   
})

router.post("/chat", async(req, res) => {
    const {threadId, message} = req.body;

    if(!threadId || ! message) {
        return res.status(400).json({ error: "Thread ID and message are required" });
    }

    try {
        let thread = await Thread.findOne({threadId});

        if(!thread) {
            thread = new Thread({
                threadId,
                title: message,
                messages: [{role: "user", content: message}]
            });
        }
        else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantResponse = await getGeminiAPIResponse(message);

        thread.messages.push({ role: "assistant", content: assistantResponse });
        thread.updatedAt = Date.now();

        await thread.save();
        res.json({reply: assistantResponse});

    } catch(err) {
        console.error("Error processing chat message:", err);
        res.status(500).json({ error: "Internal server error" });
    }
})

export default router;