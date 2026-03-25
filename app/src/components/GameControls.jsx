import { showAd } from "../utils/AdsManager";

export default function GameControls({ onUndo, onRestart, onExit }) {
  const handleAction = (action) => {
    showAd(() => {
      action();
    });
  };

  return (
    <div className="game-controls">
      <button className="ctrl-btn" onClick={() => handleAction(onUndo)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
        Отменить ход
      </button>
      <button className="ctrl-btn" onClick={() => handleAction(onRestart)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
        Заново
      </button>
      <button className="ctrl-btn ctrl-btn-exit" onClick={() => handleAction(onExit)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Вернуться
      </button>
    </div>
  );
}
