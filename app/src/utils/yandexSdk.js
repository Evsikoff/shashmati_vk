const CLOUD_PROGRESS_KEY = "progress";

export function getYsdk() {
  return window.ysdk ?? null;
}

export async function initYandexSdk() {
  if (!window.YaGames) {
    return null;
  }

  try {
    const ysdk = await window.YaGames.init();
    window.ysdk = ysdk;
    return ysdk;
  } catch (error) {
    console.error("Yandex SDK init error:", error);
    return null;
  }
}

export function setDocumentLanguage(ysdk) {
  const lang = ysdk?.environment?.i18n?.lang || "ru";
  document.documentElement.lang = lang;
}

export function notifyLoadingReady(ysdk) {
  ysdk?.features?.LoadingAPI?.ready?.();
}

export function startGameplay(ysdk = getYsdk()) {
  ysdk?.features?.GameplayAPI?.start?.();
}

export function stopGameplay(ysdk = getYsdk()) {
  ysdk?.features?.GameplayAPI?.stop?.();
}

async function getPlayer() {
  const ysdk = getYsdk();
  if (!ysdk?.getPlayer) {
    return null;
  }

  try {
    return await ysdk.getPlayer();
  } catch (error) {
    console.error("Yandex player access error:", error);
    return null;
  }
}

export async function loadCloudProgress() {
  const player = await getPlayer();
  if (!player?.getData) {
    return null;
  }

  try {
    const data = await player.getData([CLOUD_PROGRESS_KEY]);
    const value = Number.parseInt(data?.[CLOUD_PROGRESS_KEY], 10);
    return Number.isFinite(value) ? value : null;
  } catch (error) {
    console.error("Cloud progress load error:", error);
    return null;
  }
}

export async function saveCloudProgress(progress) {
  const player = await getPlayer();
  if (!player?.setData) {
    return;
  }

  try {
    await player.setData({ [CLOUD_PROGRESS_KEY]: String(progress) });
  } catch (error) {
    console.error("Cloud progress save error:", error);
  }
}
