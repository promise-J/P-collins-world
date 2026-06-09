import { SavingsPlanModel } from "./saving-plan.model";
import { SavingsGroupModel } from "./saving-group.model";
import { WalletService } from "../wallet/wallet.service";

export class SavingsService {
  private wallet = new WalletService();

  async createPlan(userId: string, data: any) {
    return SavingsPlanModel.create({
      userId,
      ...data
    });
  }

  async contributeToPlan(
    userId: string,
    planId: string,
    amount: number,
    reference: string
  ) {
    const plan = await SavingsPlanModel.findById(planId);

    if (!plan) throw new Error("Plan not found");

    await this.wallet.debit(userId, amount, reference);

    plan.currentAmount += amount;

    if (plan.currentAmount >= (plan.targetAmount ?? 0)) {
        plan.isCompleted = true;
    }

    await plan.save();

    return plan;
  }

  async createGroup(userId: string, data: any) {
    return SavingsGroupModel.create({
      ownerId: userId,
      members: [
        {
          userId,
          role: "OWNER"
        }
      ],
      ...data
    });
  }
  async contributeToGroup(
    userId: string,
    groupId: string,
    amount: number,
    reference: string
  ) {
    const group = await SavingsGroupModel.findById(groupId);
  
    if (!group) throw new Error("Group not found");
  
    const isMember = group.members.some(
      (m) => (m.userId ?? "").toString() === userId
    );
  
    if (!isMember) {
      throw new Error("Not a group member");
    }
  
    // debit wallet first
    await this.wallet.debit(userId, amount, reference);
  
    group.currentAmount += amount;
  
    await group.save();
  
    return group;
  }
  async breakSavingsPlan(
    userId: string,
    planId: string
  ) {
    const plan = await SavingsPlanModel.findById(planId);
  
    if (!plan) throw new Error("Plan not found");
  
    if ((plan.userId ?? "").toString() !== userId) {
      throw new Error("Unauthorized");
    }
  
    const penalty = plan.currentAmount * 0.1;
  
    const payout = plan.currentAmount - penalty;
  
    // credit user wallet (90%)
    await this.wallet.credit(
      userId,
      payout,
      `BREAK_PLAN_PAYOUT`
    );
  
    // system keeps penalty (you could route to revenue account)
    await plan.deleteOne();
  
    return {
      totalSaved: plan.currentAmount,
      penalty,
      payout
    };
  }
  async breakGroupSavings(
    userId: string,
    groupId: string
  ) {
    const group = await SavingsGroupModel.findById(groupId);
  
    if (!group) throw new Error("Group not found");
  
    const isOwner =
      (group.ownerId ?? "").toString() === userId;
  
    if (!isOwner) {
      throw new Error("Only owner can break group");
    }
  
    const penalty = group.currentAmount * 0.1;
  
    const distributable =
      group.currentAmount - penalty;
  
    const perMember =
      distributable / group.members.length;
  
    for (const member of group.members) {
      await this.wallet.credit(
        (member.userId ?? "").toString(),
        perMember,
        `GROUP_BREAK_PAYOUT`
      );
    }
  
    await group.deleteOne();
  
    return {
      total: group.currentAmount,
      penalty,
      perMember
    };
  }
  async getUserPlans(userId: string) {
    return SavingsPlanModel.find({ userId });
  }
  
  async getUserGroups(userId: string) {
    return SavingsGroupModel.find({
      "members.userId": userId
    });
  }
}