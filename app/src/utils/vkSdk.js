const CLOUD_PROGRESS_KEY = "gameState";

function getVkBridge() {
  return window.vkBridge ?? null;
}

export async function initVkSdk() {
  const bridge = getVkBridge();
  if (!bridge) {
    console.error("VK Bridge not found");
    return null;
  }

  try {
    const data = await bridge.send("VKWebAppInit");
    if (data.result) {
      return bridge;
    }
    return null;
  } catch (error) {
    console.error("VK Bridge init error:", error);
    return null;
  }
}

export function subscribeToConfigUpdates(callback) {
  const bridge = getVkBridge();
  if (!bridge) return;

  bridge.subscribe((e) => {
    if (e.detail.type === "VKWebAppUpdateConfig") {
      callback(e.detail.data);
    }
  });
}

export function enableFullscreen() {
  const bridge = getVkBridge();
  if (!bridge) return Promise.resolve();

  return bridge
    .send("VKWebAppSetViewSettings", {
      status_bar_style: "light",
      fullscreen: true,
    })
    .catch((error) => {
      console.error("Fullscreen error:", error);
      // Fallback to standard Fullscreen API for desktop browsers
      document.documentElement.requestFullscreen?.().catch(() => {});
    });
}

export function disableFullscreen() {
  const bridge = getVkBridge();
  if (!bridge) return Promise.resolve();

  return bridge
    .send("VKWebAppSetViewSettings", {
      status_bar_style: "dark",
      fullscreen: false,
    })
    .catch((error) => {
      console.error("Exit fullscreen error:", error);
      document.exitFullscreen?.().catch(() => {});
    });
}

export function isOdnoklassniki() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("vk_client") === "ok";
}

export function showOrderBox(itemId) {
  const bridge = getVkBridge();
  if (!bridge) return Promise.reject(new Error("VK Bridge not available"));

  return bridge.send("VKWebAppShowOrderBox", {
    type: "item",
    item: itemId,
  });
}

export async function loadCloudProgress() {
  const bridge = getVkBridge();
  if (!bridge) return null;

  try {
    const data = await bridge.send("VKWebAppStorageGet", {
      keys: [CLOUD_PROGRESS_KEY],
    });

    const stateStr = data.keys?.find((k) => k.key === CLOUD_PROGRESS_KEY)?.value;
    if (!stateStr) return null;

    const progressObj = JSON.parse(stateStr);
    const value = Number.parseInt(progressObj.progress, 10);
    return Number.isFinite(value) ? value : null;
  } catch (error) {
    console.error("Cloud progress load error:", error);
    return null;
  }
}

export async function saveCloudProgress(progress) {
  const bridge = getVkBridge();
  if (!bridge) return;

  try {
    const progressString = JSON.stringify({ progress: String(progress) });
    await bridge.send("VKWebAppStorageSet", {
      key: CLOUD_PROGRESS_KEY,
      value: progressString,
    });
  } catch (error) {
    console.error("Cloud progress save error:", error);
  }
}
