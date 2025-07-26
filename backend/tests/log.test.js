const request = require("supertest");
const express = require("express");
const logRoutes = require("../routes/logs");
const User = require("../models/User");
const WellBeing = require("../models/WellBeing");
const Log = require("../models/Log");

const app = express();
app.use(express.json());
app.use("/api/logs", logRoutes);

describe("Log Routes", () => {
  let token, userId, wellBeingId;
  beforeEach(async () => {
    const hashedPassword = await require("bcryptjs").hash("password123", 10);
    const user = await new User({
      fullName: "Test User",
      email: "test@example.com",
      password: hashedPassword,
    }).save();
    userId = user._id;
    token = require("jsonwebtoken").sign(
      { userId },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    const wellBeing = await new WellBeing({
      userId,
      name: "Mental",
      accentColor: "#764986",
      isRemovable: true,
    }).save();
    wellBeingId = wellBeing._id;
  });

  describe("GET /api/logs/:date", () => {
    it("should return logs for a specific date", async () => {
      await new Log({
        userId,
        wellBeingId,
        date: new Date("2025-07-24"),
        state: "Good",
        note: "Feeling great",
      }).save();

      const res = await request(app)
        .get("/api/logs/2025-07-24")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].state).toBe("Good");
    });

    it("should return 400 for invalid date", async () => {
      const res = await request(app)
        .get("/api/logs/invalid-date")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe("Validation failed");
    });
  });

  describe("POST /api/logs", () => {
    it("should create a new log", async () => {
      const res = await request(app)
        .post("/api/logs")
        .set("Authorization", `Bearer ${token}`)
        .send({
          wellBeingId,
          date: "2025-07-24",
          state: "Good",
          note: "Feeling great",
        });

      expect(res.status).toBe(201);
      expect(res.body.state).toBe("Good");
      expect(res.body.note).toBe("Feeling great");
    });

    it("should update existing log (overwrite)", async () => {
      await new Log({
        userId,
        wellBeingId,
        date: new Date("2025-07-24"),
        state: "Bad",
        note: "Feeling bad",
      }).save();

      const res = await request(app)
        .post("/api/logs")
        .set("Authorization", `Bearer ${token}`)
        .send({
          wellBeingId,
          date: "2025-07-24",
          state: "Good",
          note: "Feeling better",
        });

      expect(res.status).toBe(200);
      expect(res.body.state).toBe("Good");
      expect(res.body.note).toBe("Feeling better");
    });

    it("should return 404 for invalid wellBeingId", async () => {
      const res = await request(app)
        .post("/api/logs")
        .set("Authorization", `Bearer ${token}`)
        .send({
          wellBeingId: "123456789012345678901234",
          date: "2025-07-24",
          state: "Good",
          note: "Feeling great",
        });

      expect(res.status).toBe(404);
      expect(res.body.error.message).toBe("Well-being not found");
    });
  });

  describe("DELETE /api/logs/:id", () => {
    it("should delete a log", async () => {
      const log = await new Log({
        userId,
        wellBeingId,
        date: new Date("2025-07-24"),
        state: "Good",
        note: "Feeling great",
      }).save();

      const res = await request(app)
        .delete(`/api/logs/${log._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Log removed successfully");
    });

    it("should return 404 for non-existent log", async () => {
      const res = await request(app)
        .delete("/api/logs/123456789012345678901234")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.error.message).toBe("Log not found");
    });
  });
});
