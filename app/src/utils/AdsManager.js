import { startGameplay, stopGameplay } from "./yandexSdk";

export const showAd = (onComplete) => {
  if (!window.ysdk) {
    onComplete();
    return;
  }

  stopGameplay();

  window.ysdk.adv.showFullscreenAdv({
    callbacks: {
      onClose: function () {
        startGameplay();
        onComplete();
      },
      onError: function (error) {
        console.error("Ad error:", error);
        startGameplay();
        onComplete();
      },
    },
  });
};
