import { Request, Response } from "express";
import { OrderService } from "../market/orders/order.service";
import { WalletService } from "../wallet/wallet.service";
import crypto from "crypto";

export class PaystackWebhook {
  private orderService = new OrderService();
  private walletService = new WalletService();

  handleWebhook = async (req: Request, res: Response) => {
    try {
      const signature = req.headers['x-paystack-signature'] as string;
      const payload = JSON.stringify(req.body);

      // Verify webhook signature
      const hash = crypto
        .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
        .update(payload)
        .digest('hex');

      if (hash !== signature) {
        return res.status(401).json({ message: 'Invalid signature' });
      }

      const event = req.body;

      if (event.event === 'charge.success') {
        const { reference, metadata } = event.data;

        // Update order status
        const order = await this.orderService.markAsPaid(metadata.orderId, reference);
        
        // Credit vendor wallets if needed
        // await this.walletService.creditVendors(order);

        return res.status(200).json({ success: true });
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Webhook error:', error);
      return res.status(500).json({ success: false });
    }
  };
}