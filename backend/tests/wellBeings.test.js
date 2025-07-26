const request = require("supertest");
const express = require("express");
const wellBeingRoutes = require("../routes/wellBeings");
const User = require("../models/User");
const WellBeing = require("../models/WellBeing");

const app = express();
app.use(express.json());
app.use("/api/wellbeings", wellBeingRoutes);

describe("WellBeing Routes", () => {
  let token, userId;
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

    await new WellBeing({
      userId,
      name: "General",
      accentColor: "#3F48CC",
      isRemovable: false,
    }).save();
  });

  describe("GET /api/wellbeings", () => {
    it("should return user’s well-beings", async () => {
      const res = await request(app)
        .get("/api/wellbeings")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].name).toBe("General");
    });

    it("should return 401 without token", async () => {
      const res = await request(app).get("/api/wellbeings");
      expect(res.status).toBe(401);
      expect(res.body.error.message).toBe("No token provided");
    });
  });

  describe("POST /api/wellbeings", () => {
    it("should create a new well-being", async () => {
      const res = await request(app)
        .post("/api/wellbeings")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Spiritual" });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Spiritual");
      expect(res.body.accentColor).toBe("#915941");
      expect(res.body.isRemovable).toBe(true);
    });

    it("should return 400 for invalid input", async () => {
      const res = await request(app)
        .post("/api/wellbeings")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "" });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe("Validation failed");
    });
  });

  describe("DELETE /api/wellbeings/:id", () => {
    it("should delete a removable well-being", async () => {
      const wellBeing = await new WellBeing({
        userId,
        name: "Spiritual",
        accentColor: "#915941",
        isRemovable: true,
      }).save();

      const res = await request(app)
        .delete(`/api/wellbeings/${wellBeing._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Well-being removed successfully");
    });

    it("should return 400 for non-removable well-being", async () => {
      const wellBeing = await WellBeing.findOne({ name: "General" });
      const res = await request(app)
        .delete(`/api/wellbeings/${wellBeing._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe("This well-being cannot be removed");
    });

    it("should return 404 for non-existent well-being", async () => {
      const res = await request(app)
        .delete("/api/wellbeings/123456789012345678901234")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.error.message).toBe("Well-being not found");
    });
  });
});
