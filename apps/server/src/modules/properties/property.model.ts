import { autoConvertObjectIdsAsync } from "@/utils/mongoose-plugins";
import mongoose from "mongoose";

export enum PropertyStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  OCCUPIED = "OCCUPIED",
  MAINTENANCE = "MAINTENANCE",
  EXPIRED = "EXPIRED"
}

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true
    },

    description: String,

    price: {
      type: Number,
      required: true,
      index: true
    },

    location: {
      address: String,
      city: { type: String, index: true },
      state: { type: String, index: true },
      country: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    },

    type: {
      type: String,
      enum: ["APARTMENT", "HOUSE", "LAND", "COMMERCIAL"],
      index: true
    },

    status: {
      type: String,
      enum: Object.values(PropertyStatus),
      default: PropertyStatus.AVAILABLE,
      index: true
    },

    landlordId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true
    },

    agentId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      index: true
    },
    media:[
      {
       url:String,
       publicId:String,
       _id: false,
       type:{
        type:String,
        enum:[
          "image",
          "video",
          "document"
        ]
       }
      }
     ],
    features: {
      bedrooms: Number,
      bathrooms: Number,
      toilets: Number,
      furnished: Boolean
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },

    views: {
      type: Number,
      default: 0
    },
    approvalStatus: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected"
      ],
      default: "pending"
    },
     isRemoved:{
      type:Boolean,
      default:false
     },
     rejectionReason:String
  },
  { timestamps: true }
);

// Index for search performance
propertySchema.index({
  title: "text",
  description: "text",
  "location.city": "text",
  "location.state": "text"
});

propertySchema.plugin(autoConvertObjectIdsAsync(['landlordId','agentId']))


export const PropertyModel = mongoose.model("Property", propertySchema);