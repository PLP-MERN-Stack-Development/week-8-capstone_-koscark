const request = require("supertest");
const express = require("express");
const userRoutes = require("../routes/users");
const User = require("../models/User");
const WellBeing = require("../models/WellBeing");

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

describe("User Routes", () => {
  describe("POST /api/users/signup", () => {
    it("should create a new user with default well-beings", async () => {
      const res = await request(app).post("/api/users/signup").send({
        fullName: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.user).toHaveProperty("_id");
      expect(res.body.user.fullName).toBe("Test User");
      expect(res.body.user.email).toBe("test@example.com");
      expect(res.body).toHaveProperty("token");

      const wellBeings = await WellBeing.find({ userId: res.body.user._id });
      expect(wellBeings.length).toBe(5);
      expect(wellBeings[0].name).toBe("General");
    });

    it("should return 400 if email already exists", async () => {
      await new User({
        fullName: "Existing User",
        email: "test@example.com",
        password: "hashed",
      }).save();

      const res = await request(app).post("/api/users/signup").send({
        fullName: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe("Email already exists");
    });

    it("should return 400 for invalid input", async () => {
      const res = await request(app).post("/api/users/signup").send({
        fullName: "",
        email: "invalid",
        password: "123",
      });

      expect(res.status).toBe(400);
      expect(res.body.error.data).toHaveLength(3);
    });
  });

  describe("POST /api/users/login", () => {
    beforeEach(async () => {
      const hashedPassword = await require("bcryptjs").hash("password123", 10);
      await new User({
        fullName: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      }).save();
    });

    it("should login user with correct credentials", async () => {
      const res = await request(app).post("/api/users/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty("_id");
      expect(res.body).toHaveProperty("token");
    });

    it("should return 401 for invalid credentials", async () => {
      const res = await request(app).post("/api/users/login").send({
        email: "test@example.com",
        password: "wrong",
      });

      expect(res.status).toBe(401);
      expect(res.body.error.message).toBe("Invalid credentials");
    });
  });

  describe("POST /api/users/forgot-password", () => {
    beforeEach(async () => {
      const hashedPassword = await require("bcryptjs").hash("password123", 10);
      await new User({
        fullName: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      }).save();
    });

    it("should update password with valid input", async () => {
      const res = await request(app).post("/api/users/forgot-password").send({
        email: "test@example.com",
        oldPassword: "password123",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Password updated successfully");
    });

    it("should return 401 for invalid old password", async () => {
      const res = await request(app).post("/api/users/forgot-password").send({
        email: "test@example.com",
        oldPassword: "wrong",
        newPassword: "newpassword123",
        confirmPassword: "newpassword123",
      });

      expect(res.status).toBe(401);
      expect(res.body.error.message).toBe("Invalid old password");
    });
  });

  describe("GET /api/users/profile", () => {
    let token;
    beforeEach(async () => {
      const hashedPassword = await require("bcryptjs").hash("password123", 10);
      const user = await new User({
        fullName: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      }).save();

      token = require("jsonwebtoken").sign(
        { userId: user._id },
        process.env.JWT_SECRET || "your_jwt_secret",
        { expiresIn: "1h" }
      );
    });

    it("should return user profile with valid token", async () => {
      const res = await request(app)
        .get("/api/users/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.fullName).toBe("Test User");
      expect(res.body.email).toBe("test@example.com");
    });

    it("should return 401 without token", async () => {
      const res = await request(app).get("/api/users/profile");
      expect(res.status).toBe(401);
      expect(res.body.error.message).toBe("No token provided");
    });
  });

  describe("PUT /api/users/profile", () => {
    let token;
    beforeEach(async () => {
      const hashedPassword = await require("bcryptjs").hash("password123", 10);
      const user = await new User({
        fullName: "Test User",
        email: "test@example.com",
        password: hashedPassword,
      }).save();

      token = require("jsonwebtoken").sign(
        { userId: user._id },
        process.env.JWT_SECRET || "your_jwt_secret",
        { expiresIn: "1h" }
      );
    });

    it("should update user profile", async () => {
      const res = await request(app)
        .put("/api/users/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          fullName: "Updated User",
          oldPassword: "password123",
          newPassword: "newpassword123",
          confirmPassword: "newpassword123",
        });

      expect(res.status).toBe(200);
      expect(res.body.fullName).toBe("Updated User");
    });

    it("should return 401 for invalid old password", async () => {
      const res = await request(app)
        .put("/api/users/profile")
        .set("Authorization", `Bearer ${token}`)
        .send({
          oldPassword: "wrong",
          newPassword: "newpassword123",
          confirmPassword: "newpassword123",
        });

      expect(res.status).toBe(401);
      expect(res.body.error.message).toBe("Invalid old password");
    });
  });
});
