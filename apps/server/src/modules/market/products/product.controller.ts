import { Response } from "express";
import { ProductService } from "./product.service";
import { apiResponse } from "../../../utils/apiResponse";
import { UploadService } from "@/modules/uploads/upload.service";

export class ProductController {
  private service = new ProductService();
  private uploadService = new UploadService()

  create = async (req: any, res: Response) => {
    try {

      const uploadedImages = [];
      
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            const result = await this.uploadService.uploadFile(file, "products");
            uploadedImages.push({
              url: result.secure_url,
              publicId: result.public_id,
            });
          } catch (uploadError) {
            console.error('❌ Error uploading image to Cloudinary:', uploadError);
          }
        }
      }

      const productData = {
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
        categoryId: req.body.categoryId,
        stock: parseInt(req.body.stock),
        status: req.body.status || "ACTIVE",
        images: uploadedImages,
        createdBy: req.user._id,
        updatedBy: req.user._id,
      };

      const result = await this.service.createProduct(productData);
      
      // If product creation fails, delete uploaded images from Cloudinary
      if (!result.success) {
        for (const img of uploadedImages) {
          try {
            await this.uploadService.deleteFile(img.publicId);
          } catch (deleteError) {
            console.error('❌ Error deleting image from Cloudinary:', deleteError);
          }
        }
      }

      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      console.error('❌ Error creating product:', error);
      return apiResponse(res, false, error.message || "Failed to create product");
    }
  };

  update = async (req: any, res: Response) => {
    try {
      const productId = req.params.id;
      const existingProduct = await this.service.getProduct(productId);
      
      if (!existingProduct) {
        return apiResponse(res, false, "Product not found");
      }

      // Upload new images to Cloudinary
      const uploadedImages = [];
      
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          try {
            const result = await this.uploadService.uploadFile(file, "products");
            uploadedImages.push({
              url: result.secure_url,
              publicId: result.public_id,
            });
          } catch (uploadError) {
            console.error('❌ Error uploading image to Cloudinary:', uploadError);
          }
        }
      }

      const imageUrls = uploadedImages.map(img => img.url);

      // Merge existing images with new ones if specified
      let finalImages = imageUrls;
      if (req.body.keepExistingImages === 'true' && existingProduct.images) {
        finalImages = [...existingProduct.images, ...imageUrls];
      }

      const updateData = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price ? parseFloat(req.body.price) : undefined,
        categoryId: req.body.categoryId,
        stock: req.body.stock ? parseInt(req.body.stock) : undefined,
        status: req.body.status,
        images: finalImages,
        updatedBy: req.user._id,
      };

      // Remove undefined values
      Object.keys(updateData).forEach(key => 
        updateData[key as keyof typeof updateData] === undefined && 
        delete updateData[key as keyof typeof updateData]
      );

      const result = await this.service.updateProduct(productId, updateData);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      console.error('❌ Error updating product:', error);
      return apiResponse(res, false, error.message || "Failed to update product");
    }
  };

  delete = async (req: any, res: Response) => {
    try {
      const productId = req.params.id;
      const product = await this.service.getProduct(productId);
      
      if (!product) {
        return apiResponse(res, false, "Product not found");
      }

      // Delete images from Cloudinary
      if (product.images && product.images.length > 0) {
        // You need to store publicIds in your database to delete properly
        // For now, we'll just log it
        console.log('📸 Deleting images for product:', productId);
        // If you have publicIds stored, you can delete them:
        // for (const img of product.images) {
        //   await uploadService.deleteFile(img.publicId);
        // }
      }

      const result = await this.service.deleteProduct(productId);
      return apiResponse(res, result.success, result.message, result.data);
    } catch (error: any) {
      console.error('❌ Error deleting product:', error);
      return apiResponse(res, false, error.message || "Failed to delete product");
    }
  };

  list = async (req: any, res: Response) => {
    const result = await this.service.listProducts(req.query);
    return apiResponse(res, result.success, result.message, result.data);
  };

  search = async (req: any, res: Response) => {
    const result = await this.service.searchProducts(req.query.q as string);
    return apiResponse(res, result.success, result.message, result.data);
  };

  getOne = async (req: any, res: Response) => {
    const result = await this.service.getProduct(req.params.id);
    return apiResponse(res, result.success, result.message, result.data);
  };
}