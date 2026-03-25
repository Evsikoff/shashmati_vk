import { useState, useCallback } from "react";
import { useChessGame } from "./Board";
import GameControls from "./GameControls";
import { showAd } from "../utils/AdsManager";

export default function GameScreen({ opponent, onExit, onWin }) {
  const [playerColor] = useState(() => (Math.random() < 0.5 ? "w" : "b"));
  const [gameResult, setGameResult] = useState(null);

  const handleGameEnd = useCallback((result) => {
    setGameResult(result);
  }, []);

  const boardState = useChessGame({
    opponent,
    playerColor,
    onGameEnd: handleGameEnd,
  });

  const handleRestart = () => {
    setGameResult(null);
    boardState.restartGame();
  };

  const handleWinContinue = () => {
    onWin(opponent.id);
    onExit();
  };

  const avatarPath = import.meta.env.BASE_URL + opponent.avatar_path.replace(/\\/g, "/").replace(/^\//, "");

  return (
    <div className="game-screen">
      {/* Left panel */}
      <div className="game-panel panel-left">
        <div className="opponent-info">
          <img
            src={avatarPath}
            alt={opponent.name}
            className="opponent-avatar"
          />
          <h2 className="opponent-name">{opponent.name}</h2>
          <span className="opponent-group">{opponent.group}</span>
          <p className="opponent-desc">{opponent.description}</p>
          <div className="opponent-meta">
            <span className="meta-label">Сложность:</span>
            <div className="strength-bar">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className={`strength-pip ${i < opponent.strength ? "active" : ""}`}
                />
              ))}
            </div>
          </div>
          <div className="color-info">
            Вы играете {playerColor === "w" ? "белыми" : "чёрными"}
          </div>
        </div>
      </div>

      {/* Center - Board */}
      <div className="game-board-area">
        {boardState.boardElement}
      </div>

      {/* Right panel */}
      <div className="game-panel panel-right">
        <div className="move-history">
          <h3 className="history-title">Ходы</h3>
          <div className="history-list">
            {boardState.moveHistory.map((pair) => (
              <div key={pair.num} className="history-row">
                <span className="history-num">{pair.num}.</span>
                <span className="history-white">{pair.white}</span>
                <span className="history-black">{pair.black}</span>
              </div>
            ))}
          </div>
        </div>

        <GameControls
          onUndo={boardState.undoMove}
          onRestart={handleRestart}
          onExit={onExit}
        />
      </div>

      {/* Result modal */}
      {gameResult && (
        <div className="modal-overlay">
          <div className="modal">
            {gameResult === "win" ? (
              <>
                <div className="modal-icon win">&#9813;</div>
                <h2 className="modal-title">ШАХ! Вы победили!</h2>
                <p className="modal-text">
                  Вы объявили шах {opponent.name}!
                </p>
                <div className="modal-buttons">
                  <button className="modal-btn primary" onClick={handleWinContinue}>
                    Далее
                  </button>
                </div>
              </>
            ) : gameResult === "lose" ? (
              <>
                <div className="modal-icon lose">&#9819;</div>
                <h2 className="modal-title">Вам поставили ШАХ</h2>
                <p className="modal-text">
                  {opponent.name} объявил вам шах. Вы проиграли.
                </p>
                <div className="modal-buttons">
                  <button className="modal-btn primary" onClick={() => showAd(handleRestart)}>
                    Реванш
                  </button>
                  <button className="modal-btn" onClick={() => showAd(onExit)}>
                    В меню
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="modal-icon draw">&#189;</div>
                <h2 className="modal-title">Ничья</h2>
                <p className="modal-text">
                  Партия завершилась вничью.
                </p>
                <div className="modal-buttons">
                  <button className="modal-btn primary" onClick={handleRestart}>
                    Заново
                  </button>
                  <button className="modal-btn" onClick={onExit}>
                    В меню
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
