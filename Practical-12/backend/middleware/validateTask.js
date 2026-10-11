const allowedFields = new Set(["title", "description", "priority", "completed"]);

const validateTask = (partial = false) => (req, res, next) => {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return res.status(400).json({ message: "Request body must be a JSON object" });
    }

    const fields = Object.keys(body);
    if (fields.some((field) => !allowedFields.has(field))) {
        return res.status(400).json({ message: "Request contains unsupported task fields" });
    }
    if ((!partial && !fields.includes("title")) || (partial && fields.length === 0)) {
        return res.status(400).json({ message: partial ? "Provide at least one task field to update" : "Title is required" });
    }
    if ("title" in body && (typeof body.title !== "string" || body.title.trim().length < 2 || body.title.trim().length > 120)) {
        return res.status(400).json({ message: "Title must contain 2 to 120 characters" });
    }
    if ("description" in body && typeof body.description !== "string") {
        return res.status(400).json({ message: "Description must be a string" });
    }
    if ("priority" in body && !["low", "medium", "high"].includes(body.priority)) {
        return res.status(400).json({ message: "Priority must be low, medium, or high" });
    }
    if ("completed" in body && typeof body.completed !== "boolean") {
        return res.status(400).json({ message: "Completed must be a boolean" });
    }

    return next();
};

module.exports = validateTask;