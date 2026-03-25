import { isUnlocked, isDefeated } from "../utils/progress";

export default function OpponentCard({ shah, progress, onClick }) {
  const unlocked = isUnlocked(shah.id, progress);
  const defeated = isDefeated(shah.id, progress);

  const avatarPath = import.meta.env.BASE_URL + shah.avatar_path.replace(/\\/g, "/").replace(/^\//, "");

  return (
    <button
      className={`opponent-card ${unlocked ? "unlocked" : "locked"} ${defeated ? "defeated" : ""}`}
      onClick={() => unlocked && onClick(shah)}
      disabled={!unlocked}
      title={unlocked ? shah.name : "Заблокировано"}
    >
      <div className="card-avatar-wrap">
        {unlocked ? (
          <img
            src={avatarPath}
            alt={shah.name}
            className="card-avatar"
          />
        ) : (
          <div className="card-avatar-locked">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        )}
        {defeated && (
          <div className="card-checkmark">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d5b67d" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>
      <div className="card-info">
        <span className="card-id">#{shah.id}</span>
        <span className="card-name">{unlocked ? shah.name : "???"}</span>
        {unlocked && <span className="card-group">{shah.group}</span>}
      </div>
    </button>
  );
}
