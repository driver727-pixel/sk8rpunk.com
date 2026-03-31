import type { RewardResult, RewardType } from "./types";

export interface RewardedAdsService {
  showRewardedAd(rewardType: RewardType): Promise<RewardResult>;
}

class BrowserRewardedAdsService implements RewardedAdsService {
  async showRewardedAd(rewardType: RewardType): Promise<RewardResult> {
    await new Promise((resolve) => window.setTimeout(resolve, 900));

    if (rewardType === "instant-recharge") {
      return {
        granted: true,
        rewardName: "Full Battery Pulse",
        detail:
          "Browser reward completed. On Android, replace this adapter with a Google AdMob rewarded video callback and grant the recharge there.",
      };
    }

    return {
      granted: true,
      rewardName: "Emergency Tune-Up",
      detail:
        "Browser reward completed. This secondary placement can map to a lower-value AdMob reward, such as a partial battery repair.",
    };
  }
}

export const createAdService = (): RewardedAdsService => new BrowserRewardedAdsService();
