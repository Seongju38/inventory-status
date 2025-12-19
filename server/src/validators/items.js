const { z } = require("zod");

const createItemSchema = z.object({
  name: z.string().trim().min(1, "name is required").max(100),
  quantity: z.number().int().min(0).default(0),
  location: z.string().trim().max(100).optional().nullable(),
  note: z.string().trim().max(500).optional().nullable(),
});

const updateItemSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  quantity: z.number().int().min(0).optional(),
  location: z.string().trim().max(100).optional().nullable(),
  note: z.string().trim().max(500).optional().nullable(),
});

module.exports = { createItemSchema, updateItemSchema };
