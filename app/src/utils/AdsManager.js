let lastAdShownAt = 0;
const AD_COOLDOWN_MS = 30_000;

function canShowAd() {
  return Date.now() - lastAdShownAt >= AD_COOLDOWN_MS;
}

function markAdShown() {
  lastAdShownAt = Date.now();
}

export const showAd = (onComplete) => {
  if (!canShowAd()) {
    onComplete();
    return;
  }

  const bridge = window.vkBridge;
  if (!bridge) {
    onComplete();
    return;
  }

  bridge
    .send("VKWebAppShowNativeAds", { ad_format: "interstitial" })
    .then((data) => {
      if (data.result) {
        markAdShown();
      }
      onComplete();
    })
    .catch((error) => {
      console.log("Ad not shown:", error);
      onComplete();
    });
};

export const showRewardedAd = (onRewarded, onSkipped) => {
  const bridge = window.vkBridge;
  if (!bridge) {
    onSkipped?.();
    return;
  }

  bridge
    .send("VKWebAppShowNativeAds", { ad_format: "reward" })
    .then((data) => {
      if (data.result) {
        markAdShown();
        onRewarded();
      } else {
        onSkipped?.();
      }
    })
    .catch((error) => {
      console.log("Rewarded ad not shown:", error);
      onSkipped?.();
    });
};
