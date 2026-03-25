export const showAd = (onComplete) => {
  const bridge = window.vkBridge;
  if (!bridge) {
    onComplete();
    return;
  }

  bridge
    .send("VKWebAppShowNativeAds", { ad_format: "interstitial" })
    .then((data) => {
      if (data.result) {
        onComplete();
      } else {
        onComplete();
      }
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
