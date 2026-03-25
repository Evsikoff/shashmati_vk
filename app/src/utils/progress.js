import { loadCloudProgress, saveCloudProgress } from "./yandexSdk";

const STORAGE_KEY = "shashmaty_progress";

function getLocalProgress() {
  const val = localStorage.getItem(STORAGE_KEY);
  return val ? parseInt(val, 10) : 0;
}

function setLocalProgress(progress) {
  localStorage.setItem(STORAGE_KEY, String(progress));
}

export async function loadProgress() {
  const cloudProgress = await loadCloudProgress();

  if (cloudProgress !== null) {
    setLocalProgress(cloudProgress);
    return cloudProgress;
  }

  return getLocalProgress();
}

export async function saveProgress(defeatedId) {
  const current = getLocalProgress();
  if (defeatedId <= current) {
    return current;
  }

  setLocalProgress(defeatedId);
  await saveCloudProgress(defeatedId);
  return defeatedId;
}

export function isUnlocked(shahId, progress) {
  return shahId <= progress + 1;
}

export function isDefeated(shahId, progress) {
  return shahId <= progress;
}
