const express = require("express");
const router = express.Router();
const { prisma } = require("../db");
const { createItemSchema, updateItemSchema } = require("../validators/items");
const { requireAdminToken } = require("../middleware/auth");

// 목록 조회 (토큰 없이도 가능하게 하고 싶으면 requireAdminToken 제거 가능)
router.get("/", requireAdminToken, async (req, res, next) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: [{ name: "asc" }, { createdAt: "desc" }],
    });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

router.post("/", requireAdminToken, async (req, res, next) => {
  try {
    const parsed = createItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }
    const item = await prisma.item.create({ data: parsed.data });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", requireAdminToken, async (req, res, next) => {
  try {
    const parsed = updateItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0].message });
    }
    const item = await prisma.item.update({
      where: { id: req.params.id },
      data: parsed.data,
    });
    res.json(item);
  } catch (e) {
    // Prisma: 레코드 없으면 에러 → 404로 변환해주면 더 친절
    if (String(e.code) === "P2025") {
      return res.status(404).json({ message: "Item not found" });
    }
    next(e);
  }
});

router.delete("/:id", requireAdminToken, async (req, res, next) => {
  try {
    await prisma.item.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (e) {
    if (String(e.code) === "P2025") {
      return res.status(404).json({ message: "Item not found" });
    }
    next(e);
  }
});

module.exports = router;
