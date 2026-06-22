import { serviceResponse } from "@/utils/apiResponse";
import { CartModel } from "./cart.model";
import { ProductModel } from "../products/product.model";
import { Types } from "mongoose";
import { toMongooseObjectId } from "@/utils/helper";

export class CartService {
  async addToCart(
    userId: string,
    productId: string,
    quantity: number,
    price: number
  ) {
    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = await CartModel.create({
        userId,
        items: []
      });
    }

    const existing = cart.items.find(
      (i) => (i.productId ?? "").toString() === productId
    );

    if (existing) {
       existing.quantity ??= 0;
       existing.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price
      });
    }

    await cart.save();

    return serviceResponse(true, 'Item added to cart', cart);
  }

  async getCart(userId: string) {
    try {
      const cartItems = await CartModel.findOne({ userId }).populate('items.productId');
      return serviceResponse(true, 'Cart fetched', cartItems)
    } catch (error) {
      console.log({error})
    }
  }

  async clearCart(userId: string) {
    await CartModel.findOneAndDelete({ userId });
    return serviceResponse(true, 'Cart cleared')
  }

  async getCartCount(userId: string) {
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      return serviceResponse(true, 'Cart count', 0);
    }
    return serviceResponse(true, 'Cart count', cart.items.reduce((total, item) => total + (item?.quantity ?? 0), 0));
  }

  async updateQuantity(userId: string, productId: string, quantity: number) {
    try {
      const cart = await CartModel.findOne({ userId: toMongooseObjectId(userId) });
      if (!cart) {
        return serviceResponse(false, "Cart not found");
      }

  
      // Check if product exists
      const product = await ProductModel.findById(productId);
      if (!product) {
        return serviceResponse(false, "Product not found");
      }
  
      if (quantity > product.stock) {
        return serviceResponse(false, `Only ${product.stock} items available in stock`);
      }
  
      const itemIndex = cart.items.findIndex(
        (item) => item?.productId?.toString() === productId
      );
  
      if (itemIndex === -1) {
        return serviceResponse(false, "Item not found in cart");
      }
  
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = quantity;
      }
  
      await cart.save();
      await cart.populate("items.productId");
  
      return serviceResponse(true, 'Cart updated', cart);
    } catch (error) {
      console.log(error)
      return serviceResponse(false, 'Something went wrong')
    }
  }

  async removeItem(userId: string, productId: string) {
    const cart = await CartModel.findOne({ userId });
    if (!cart) {
      return serviceResponse(false, "Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      (item) => item?.productId?.toString() === productId
    );

    if (itemIndex === -1) {
      return serviceResponse(false, "Item not found in cart");
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    await cart.populate("items.productId");

    return serviceResponse(true, 'Item removed', cart);
  }
}



