import { Application, Text } from "pixi.js";

export class DisplayFPS extends Text {
  private _app: Application;

  constructor(app: Application) {
    super("FPS: --", { fill: "#FFFF" });
    this._app = app;
    this._app.stage.addChild(this);
    this.position.set(10, 10);
  }

  update() {
    this.text = `FPS: ${this._app.ticker.FPS.toFixed(2)}`;
  }
}

export default DisplayFPS;
