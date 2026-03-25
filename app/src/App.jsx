import { useState, useEffect } from "react";
import MainMenu from "./components/MainMenu";
import GameScreen from "./components/GameScreen";
import { loadProgress, saveProgress } from "./utils/progress";
import {
  initYandexSdk,
  notifyLoadingReady,
  setDocumentLanguage,
  startGameplay,
  stopGameplay,
} from "./utils/yandexSdk";

export default function App() {
  const [shahs, setShahs] = useState([]);
  const [progress, setLocalProgress] = useState(0);
  const [currentOpponent, setCurrentOpponent] = useState(null);
  const [appLocked, setAppLocked] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const ysdk = await initYandexSdk();
      setDocumentLanguage(ysdk);

      const [loadedShahs, loadedProgress] = await Promise.all([
        fetch(import.meta.env.BASE_URL + "data/shahs.json").then((r) => r.json()),
        loadProgress(),
      ]);

      if (!isMounted) {
        return;
      }

      setShahs(loadedShahs);
      setLocalProgress(loadedProgress);

      notifyLoadingReady(ysdk);
      setAppLocked(false);
    };

    bootstrap().catch(console.error);

    return () => {
      isMounted = false;
      stopGameplay();
    };
  }, []);

  useEffect(() => {
    if (!shahs.length) {
      return;
    }

    if (currentOpponent) {
      startGameplay();
      return;
    }

    stopGameplay();
  }, [currentOpponent, shahs.length]);

  const handleSelectOpponent = (shah) => {
    setCurrentOpponent(shah);
  };

  const handleExit = () => {
    stopGameplay();
    setCurrentOpponent(null);
  };

  const handleWin = async (shahId) => {
    const updatedProgress = await saveProgress(shahId);
    setLocalProgress(updatedProgress);
  };

  if (!shahs.length) {
    return (
      <div className="loading-screen">
        <div className="loading-ornament">&#9813;</div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className={appLocked ? "app-root app-locked" : "app-root"}>
      {currentOpponent ? (
        <GameScreen
          opponent={currentOpponent}
          onExit={handleExit}
          onWin={handleWin}
        />
      ) : (
        <MainMenu
          shahs={shahs}
          progress={progress}
          onSelectOpponent={handleSelectOpponent}
        />
      )}
    </div>
  );
}
