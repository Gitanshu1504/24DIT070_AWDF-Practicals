const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Task = require("../Task");
const User = require("../models/User");

const email = `ci-${process.pid}@example.com`;
const password = "Practical12TestPassword123!";
let token;
let userId;

beforeAll(async () => {
    await mongoose.connect(
        process.env.MONGO_URI || "mongodb://127.0.0.1:27017/task_management_practical12_test"
    );

    const registration = await request(app)
        .post("/auth/register")
        .send({ email, password });

    if (registration.status !== 201) {
        throw new Error(`Test account registration failed: ${registration.status} ${JSON.stringify(registration.body)}`);
    }

    userId = registration.body.user.id;

    const login = await request(app)
        .post("/auth/login")
        .send({ email, password });

    if (login.status !== 200) {
        throw new Error(`Test account login failed: ${login.status} ${JSON.stringify(login.body)}`);
    }

    token = login.body.token;
});

afterAll(async () => {
    if (userId) {
        await Task.deleteMany({ user: userId });
        await User.deleteOne({ _id: userId });
    }
    await mongoose.disconnect();
});

test("GET /tasks returns the authenticated user's tasks", async () => {
    const createdTask = await request(app)
        .post("/tasks")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "CI task", description: "Created by the automated test" });

    expect(createdTask.status).toBe(201);

    const response = await request(app)
        .get("/tasks")
        .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                _id: createdTask.body._id,
                title: "CI task"
            })
        ])
    );
});
