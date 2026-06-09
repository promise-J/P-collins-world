
import { SavingsPlanModel } from "../savings/saving-plan.model";
import { WalletService } from "../wallet/wallet.service";

export const runContributions = async () => {
  const plans = await SavingsPlanModel.find({
    autoDebit: true,
    isCompleted: false
  });

  const wallet = new WalletService();

  for (const plan of plans) {
    const amount = 1000; // calculated based on frequency

    await wallet.debit(
      plan?.userId?.toString() ?? "",
      amount,
      `AUTO-${Date.now()}`
    );

    plan.currentAmount += amount;

    await plan.save();
  }
};