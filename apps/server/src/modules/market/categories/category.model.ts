import { autoConvertObjectIdsAsync } from "@/utils/mongoose-plugins";
import mongoose from "mongoose";

// Suggested Category Model
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    parentId: { type: mongoose.Types.ObjectId, ref: "Category" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.plugin(autoConvertObjectIdsAsync(['parentId']))


export const CategoryModel = mongoose.model("Category", categorySchema);
