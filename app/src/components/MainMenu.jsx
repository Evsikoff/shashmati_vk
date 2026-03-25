import OpponentCard from "./OpponentCard";

export default function MainMenu({ shahs, progress, onSelectOpponent }) {
  return (
    <div className="main-menu">
      <div className="menu-header">
        <h1 className="game-title">ШАШМАТЫ С ШАХАМИ</h1>
        <p className="game-subtitle">Побеждает тот, кто первым поставит ШАХ</p>
      </div>

      <div className="menu-divider">
        <span className="divider-ornament">&#9670;</span>
        <span className="divider-text">Лестница Шахов</span>
        <span className="divider-ornament">&#9670;</span>
      </div>

      <div className="opponents-grid">
        {shahs.map((shah) => (
          <OpponentCard
            key={shah.id}
            shah={shah}
            progress={progress}
            onClick={onSelectOpponent}
          />
        ))}
      </div>
    </div>
  );
}
