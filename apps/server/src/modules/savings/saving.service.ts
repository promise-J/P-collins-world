import { SavingsPlanModel } from "./saving-plan.model";
import { SavingsGroupModel } from "./saving-group.model";
import { WalletService } from "../wallet/wallet.service";
import { serviceResponse } from "@/utils/apiResponse";
import { UserModel } from "../users/user.model";
import { NotificationService } from "../notifications/notification.service";

export class SavingsService {
  private wallet = new WalletService();
  private notification = new NotificationService();

  async createPlan(userId: string, data: any) {
    await SavingsPlanModel.create({
      userId,
      ...data
    });
    return serviceResponse(true, 'Plan created successfully')
  }

  async contributeToPlan(
    userId: string,
    planId: string,
    amount: number,
    reference: string
  ) {
    const plan = await SavingsPlanModel.findById(planId);

    if (!plan) return serviceResponse(false, "Plan not found");

    await this.wallet.debit(userId, amount, reference);

    plan.currentAmount += amount;

    if (plan.currentAmount >= (plan.targetAmount ?? 0)) {
        plan.isCompleted = true;
    }

    await plan.save();

    return serviceResponse(true, 'Contribution successful');
  }

  async createGroup(userId: string, data: any) {
    // Check if user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return serviceResponse(false, "User not found");
    }

    // Validate target amount
    if (data.targetAmount < 1000) {
      return serviceResponse(false, "Target amount must be at least ₦1,000");
    }

    // Validate contribution amount
    if (data.contributionAmount < 100) {
      return serviceResponse(false, "Contribution amount must be at least ₦100");
    }

    if (data.contributionAmount > data.targetAmount) {
      return serviceResponse(false, "Contribution amount cannot exceed target amount");
    }

    const group = await SavingsGroupModel.create({
      name: data.name,
      ownerId: userId,
      members: [
        {
          userId: userId,
          role: "OWNER",
        },
      ],
      targetAmount: data.targetAmount,
      contributionAmount: data.contributionAmount,
      lockPeriodDays: data.lockPeriodDays || 30,
      goal: {
        title: data.goal?.title || data.name,
        description: data.goal?.description || "",
        targetAmount: data.targetAmount,
        category: data.goal?.category || "OTHER",
      },
      currentAmount: 0,
      penaltiesEnabled: data.penaltiesEnabled !== false,
    });

    return serviceResponse(true, "Savings group created successfully", group);
  }

  async getGroupDetails(groupId: string, userId: string) {
    const group = await SavingsGroupModel.findById(groupId)
      .populate("ownerId", "firstName lastName email avatar")
      .populate("members.userId", "firstName lastName email avatar");

    if (!group) {
      return serviceResponse(false, "Group not found");
    }

    // Check if user is a member
    const isMember = group.members.some(
      (m) => (m.userId as any)._id.toString() === userId
    );

    return serviceResponse(true, "Group details fetched", {
      ...group.toObject(),
      isMember,
    });
  }

  async getUserGroups(userId: string) {
    const groups = await SavingsGroupModel.find({
      "members.userId": userId,
    })
      .populate("ownerId", "firstName lastName email avatar")
      .populate("members.userId", "firstName lastName email avatar")
      .sort({ createdAt: -1 });

    return serviceResponse(true, "Groups fetched", groups);
  }

  async getAllPublicGroups(userId: string) {
    const groups = await SavingsGroupModel.find({
    })
      .populate("ownerId", "firstName lastName email avatar")
      .populate("members.userId", "firstName lastName email avatar")
      .sort({ createdAt: -1 });

    // Mark which groups the user is a member of
    const groupsWithMembership = groups.map((group) => {
      const isMember = group.members.some(
        (m) => (m.userId as any)._id.toString() === userId
      );
      return {
        ...group.toObject(),
        isMember,
      };
    });

    return serviceResponse(true, "Groups fetched", groupsWithMembership);
  }

  async joinGroup(groupId: string, userId: string) {
    const group = await SavingsGroupModel.findById(groupId);
    if (!group) {
      return serviceResponse(false, "Group not found");
    }

    const isMember = group.members.some(
      (m) =>(m?.userId?.toString() ?? "")=== userId
    );
    if (isMember) {
      return serviceResponse(false, "You are already a member of this group");
    }

    // Check if group is locked
    if (group.isLocked) {
      return serviceResponse(false, "This group is locked and cannot accept new members");
    }

    // Add user as member
    group.members.push({
      userId: userId as any,
      role: "MEMBER",
    });
    await group.save();

    // Send notification to owner
    const user = await UserModel.findById(userId);
    await this.notification.create({
      userId: group?.ownerId?.toString() ?? "",
      title: "New Group Member",
      message: `${user?.firstName} ${user?.lastName} has joined your group "${group.name}"`
  });

    return serviceResponse(true, "Successfully joined the group");
  }

  async leaveGroup(groupId: string, userId: string) {
    const group = await SavingsGroupModel.findById(groupId);
    if (!group) {
      return serviceResponse(false, "Group not found");
    }

    // Check if user is a member
    const memberIndex = group.members.findIndex(
      (m) => (m?.userId?.toString() ?? "") === userId
    );
    if (memberIndex === -1) {
      return serviceResponse(false, "You are not a member of this group");
    }

    // Check if user is the owner
    if (group?.ownerId?.toString() === userId) {
      return serviceResponse(false, "Owner cannot leave the group. Transfer ownership first or delete the group.");
    }

    // Remove member
    group.members.splice(memberIndex, 1);
    await group.save();

    return serviceResponse(true, "Successfully left the group");
  }

  async contributeToGroup(userId: string, groupId: string, amount: number, reference: string) {
    const group = await SavingsGroupModel.findById(groupId);
    if (!group) {
      return serviceResponse(false, "Group not found");
    }

    // Check if user is a member
    const isMember = group.members.some(
      (m) => m?.userId?.toString() === userId
    );
    if (!isMember) {
      return serviceResponse(false, "You are not a member of this group");
    }

    // Check if group is locked
    if (group.isLocked) {
      return serviceResponse(false, "This group is locked and contributions are not allowed");
    }

    // Validate amount
    if (amount < 100) {
      return serviceResponse(false, "Minimum contribution is ₦100");
    }

    // Check remaining target
    const remaining = (group?.targetAmount ?? 0) - group.currentAmount;
    if (amount > remaining) {
      return serviceResponse(false, `Amount exceeds remaining target of ₦${remaining.toLocaleString()}`);
    }

    // Debit wallet
    await this.wallet.debit(userId, amount, reference);

    // Update group balance
    group.currentAmount += amount;
    await group.save();

    // Send notification to owner
    const user = await UserModel.findById(userId);
    await this.notification.create({
      userId: group?.ownerId?.toString() ?? "",
      title: "Group Contribution",
      message: `${user?.firstName} ${user?.lastName} contributed ₦${amount.toLocaleString()} to "${group.name}"`
  });

    // Check if target is reached
    if ((group?.currentAmount ?? 0) >= (group?.targetAmount ?? 0)) {
      await this.notification.create({
        userId: group?.ownerId?.toString() ?? "",
        title: "Group Target Reached!",
        message: `Congratulations! "${group.name}" has reached its target of ₦${group?.targetAmount?.toLocaleString()}!`
    });
      // Notify all members
      for (const member of group.members) {
        if (member?.userId?.toString() !== group?.ownerId?.toString()) {
          await this.notification.create({
            userId: member?.userId?.toString() ?? "",
            title: "Group Target Reached!",
            message: `Congratulations! "${group.name}" has reached its target of ₦${group?.targetAmount?.toLocaleString()}!`
        });
        }
      }
    }

    return serviceResponse(true, "Contribution successful", group);
  }

  async breakGroupSavings(userId: string, groupId: string) {
    const group = await SavingsGroupModel.findById(groupId);
    if (!group) {
      return serviceResponse(false, "Group not found");
    }

    // Check if user is the owner
    if ((group?.ownerId?.toString() ?? "") !== userId) {
      return serviceResponse(false, "Only the group owner can break the savings");
    }

    // Check if group is already locked or completed
    if (group.isLocked) {
      return serviceResponse(false, "This group is already locked");
    }

    // Calculate penalty
    const penaltyPercentage = group.penaltiesEnabled ? 10 : 0;
    const penalty = group.currentAmount * (penaltyPercentage / 100);
    const distributable = group.currentAmount - penalty;

    // Distribute to members
    const perMember = distributable / group.members.length;

    for (const member of group.members) {
      await this.wallet.credit(
        member?.userId?.toString() ?? "",
        perMember,
        `GROUP_BREAK_PAYOUT_${groupId}`
      );
    }

    // Lock the group
    group.isLocked = true;
    await group.save();

    // Notify members
    for (const member of group.members) {
      await this.notification.create({
       userId: member?.userId?.toString() ?? "",
        title: "Group Savings Broken",
        message: `The group "${group.name}" has been broken. ₦${perMember.toLocaleString()} has been credited to your wallet.`
    });
    }

    return serviceResponse(true, "Group savings broken successfully", {
      totalSaved: group.currentAmount,
      penalty,
      perMember,
      membersCount: group.members.length,
    });
  }

  async deleteGroup(groupId: string, userId: string) {
    const group = await SavingsGroupModel.findById(groupId);
    if (!group) {
      return serviceResponse(false, "Group not found");
    }

    // Check if user is the owner
    if (group?.ownerId?.toString() !== userId) {
      return serviceResponse(false, "Only the group owner can delete this group");
    }

    // Check if group has funds
    if (group.currentAmount > 0) {
      return serviceResponse(false, "Cannot delete group with funds. Please break the savings first.");
    }

    await group.deleteOne();

    return serviceResponse(true, "Group deleted successfully");
  }

  async updateGroup(groupId: string, userId: string, data: any) {
    const group = await SavingsGroupModel.findById(groupId);
    if (!group) {
      return serviceResponse(false, "Group not found");
    }

    // Check if user is the owner
    if ((group?.ownerId?.toString() ?? "") !== userId) {
      return serviceResponse(false, "Only the group owner can update this group");
    }

    // Prevent updates if group has started
    if (group.currentAmount > 0) {
      return serviceResponse(false, "Cannot update group after contributions have been made");
    }

    // Update fields
    if (data.name) group.name = data.name;
    if (data.targetAmount) group.targetAmount = data.targetAmount;
    if (data.contributionAmount) group.contributionAmount = data.contributionAmount;
    if (data.lockPeriodDays) group.lockPeriodDays = data.lockPeriodDays;
    if (data.goal) {
      group.goal = {
        ...group.goal,
        ...data.goal,
      };
    }
    if (data.penaltiesEnabled !== undefined) {
      group.penaltiesEnabled = data.penaltiesEnabled;
    }

    await group.save();

    return serviceResponse(true, "Group updated successfully", group);
  }

  async breakSavingsPlan(
    userId: string,
    planId: string
  ) {
    const plan = await SavingsPlanModel.findById(planId);
  
    if (!plan) return serviceResponse(false, "Plan not found");
  
    if ((plan.userId ?? "").toString() !== userId) {
      return serviceResponse(false, "Unauthorized");
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
  
    return serviceResponse(true, 'Savings has been broken successfully',{
      totalSaved: plan.currentAmount,
      penalty,
      payout
    });
  }
  async getUserPlans(userId: string) {
    const savings = await SavingsPlanModel.find({ userId });
    return serviceResponse(true, 'Savings fetched', savings)
  }
}