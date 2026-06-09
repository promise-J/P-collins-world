import axios from "axios";

export class PaystackService {
  private base = "https://api.paystack.co";

  async initializePayment(email: string, amount: number) {
    const res = await axios.post(
      `${this.base}/transaction/initialize`,
      {
        email,
        amount: amount * 100
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
      }
    );

    return res.data;
  }
}