export default class Engine {
  constructor() {
    this.worker = null;
    this.ready = false;
    this.onMessage = null;
    this._resolveReady = null;
    this.readyPromise = new Promise((resolve) => {
      this._resolveReady = resolve;
    });
  }

  init() {
    this.worker = new Worker(import.meta.env.BASE_URL + "engine/stockfish.js");
    this.worker.onmessage = (e) => {
      const line = typeof e.data === "string" ? e.data : e.data?.data;
      if (!line) return;

      if (line.includes("uciok") || line.includes("readyok")) {
        if (!this.ready) {
          this.ready = true;
          this._resolveReady();
        }
      }

      if (this.onMessage) {
        this.onMessage(line);
      }
    };

    this.send("uci");
    this.send("setoption name UCI_Variant value 3check");
  }

  send(command) {
    if (this.worker) {
      this.worker.postMessage(command);
    }
  }

  setSkillLevel(level) {
    this.send(`setoption name Skill Level value ${level}`);
  }

  async findBestMove(fen, depth = 10) {
    await this.readyPromise;

    // For 3-check variant, we append +2+2 to simulate that both sides
    // need only one more check to win (1-check game).
    const modifiedFen = `${fen} +2+2`;

    return new Promise((resolve) => {
      const handler = (line) => {
        if (line.startsWith("bestmove")) {
          const move = line.split(" ")[1];
          this.onMessage = null;
          resolve(move);
        }
      };
      this.onMessage = handler;
      this.send(`position fen ${modifiedFen}`);
      this.send(`go depth ${depth}`);
    });
  }

  newGame() {
    this.send("ucinewgame");
    this.send("isready");
  }

  destroy() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}
