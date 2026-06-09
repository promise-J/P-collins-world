import mongoose from "mongoose";

const mediaSchema =
new mongoose.Schema(
{
  ownerId:{
    type:mongoose.Types.ObjectId,
    ref:"User",
    index:true
  },

  publicId:String,

  url:String,

  mimeType:String,

  size:Number,

  folder:String,

  resourceType:{
    type:String,
    enum:[
      "image",
      "video",
      "raw"
    ]
  }
},
{
 timestamps:true
}
);

export const MediaModel =
mongoose.model(
 "Media",
 mediaSchema
);