const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authorization = req.get("authorization") || "";
    const [scheme, token, ...extra] = authorization.split(/\s+/);

    if (scheme !== "Bearer" || !token || extra.length > 0) {
        return res.status(401).json({ message: "A valid Bearer token is required" });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        return next();
    } catch {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }
};

module.exports = authenticateToken;