const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require("./Task");
const authRoutes = require("./routes/authRoutes");
const authenticateToken = require("./middleware/auth");
const validateTask = require("./middleware/validateTask");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use("/auth", authRoutes);

const validateTaskId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: "Invalid task ID" });
    }

    return next();
};

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/tasks", authenticateToken);

app.get("/tasks", async (req, res, next) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        return res.json(tasks);
    } catch (error) {
        return next(error);
    }
});

app.post("/tasks", validateTask(), async (req, res, next) => {
    try {
        const task = await Task.create({
            user: req.user.id,
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            completed: req.body.completed
        });
        return res.status(201).json(task);
    } catch (error) {
        return next(error);
    }
});

app.put("/tasks/:id", validateTask(true), validateTaskId, async (req, res, next) => {
    try {
        const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, req.body, {
            new: true,
            runValidators: true
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.json(task);
    } catch (error) {
        return next(error);
    }
});

app.delete("/tasks/:id", validateTaskId, async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.json({ message: "Task deleted successfully", task });
    } catch (error) {
        return next(error);
    }
});

app.use((error, req, res, next) => {
    console.error(error);
    const status = ["ValidationError", "CastError"].includes(error.name) ? 400 : 500;
    return res.status(status).json({
        message: status === 500 ? "Server error" : error.message
    });
});

module.exports = app;
