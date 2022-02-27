import ct from "color-transitions";
import rgbHex from "rgb-hex";
import { Application, ParticleContainer, Sprite, Texture } from "pixi.js";
import DisplayFPS from "./util/DisplayFPS";

const SEC = 1000;
const app = new Application({ resizeTo: window, backgroundColor: 0x333333 });
const sprites = new ParticleContainer(10000, {
  scale: true,
  position: true,
  rotation: true,
  uvs: true,
  alpha: true,
});

class ParticleEmitter {
  private _texture: string;
  private _lifetimeRation: number[];
  private _spawnPoint: number[];
  private _spawnPointOffset: number[];
  private _speedRange: number[];
  private _scaleRange: number[][];
  private _alphaRange: number[];
  private _colorRange: string[];

  constructor(
    texture: string,
    lifetimeRation: number[],
    spawnPoint: number[],
    spawnPointOffset: number[],
    speedRange: number[],
    scaleRange: number[][],
    alphaRange: number[],
    colorRange: string[]
  ) {
    this._texture = texture;
    this._lifetimeRation = lifetimeRation;
    this._spawnPoint = spawnPoint;
    this._spawnPointOffset = spawnPointOffset;
    this._speedRange = speedRange;
    this._scaleRange = scaleRange;
    this._alphaRange = alphaRange;
    this._colorRange = colorRange;
  }

  init(totalParticles: number, container: ParticleContainer) {
    while (totalParticles >= 0) {
      totalParticles--;
      container.addChild(
        new Particle(
          this._texture,
          this._spawnPoint,
          this._spawnPointOffset,
          this._lifetimeRation[0] + Math.random() * this._lifetimeRation[1],
          this._speedRange[0] + Math.random() * this._speedRange[1],
          this._scaleRange,
          this._alphaRange,
          this._colorRange
        )
      );
    }
  }
}

class Particle extends Sprite {
  private _speed: number;
  private _spawnPoint: number[];
  private _spawnPointOffset: number[];
  private _alpha: number[];
  private _lifetime: number;
  private _lifetimeRation: number;
  private _scaleRange: number[][];
  private _colorRange: string[];

  constructor(
    texture: string,
    spawnPoint: number[],
    spawnPointOffset: number[],
    lifetimeRation: number,
    speed: number,
    scaleRange: number[][],
    alpha: number[],
    colorRange: string[]
  ) {
    super(Texture.from(texture));
    this._speed = speed;
    this._lifetimeRation = lifetimeRation;
    this._alpha = alpha;
    this._spawnPoint = spawnPoint;
    this._spawnPointOffset = spawnPointOffset;
    this._scaleRange = scaleRange;
    this._colorRange = colorRange;

    this.alpha = this._alpha[0];
    this.reset(Date.now());
    this.scale.set(this._scaleRange[0][0], this._scaleRange[1][0]);
  }

  private reset(now) {
    const offsetX =
      Math.random() * this._spawnPointOffset[0] * 2 - this._spawnPointOffset[0];
    const offsetY =
      Math.random() * this._spawnPointOffset[1] * 2 - this._spawnPointOffset[1];

    ct(
      this._colorRange[0],
      this._colorRange[1],
      { duration: this._lifetimeRation },
      ([r, g, b]) => {
        this.tint = parseInt("0x" + rgbHex(r, g, b));
      }
    );

    this.alpha = this._alpha[0];
    this._lifetime = now + this._lifetimeRation;
    this.position.set(
      this._spawnPoint[0] + offsetX,
      this._spawnPoint[1] + offsetY
    );

    this.anchor.set(0.5, 1);
  }

  update(delta, now) {
    if (this._lifetime <= now) {
      return this.reset(now);
    }

    const xScaleDiff = this._scaleRange[0][1] - this.scale.x;
    const yScaleDiff = this._scaleRange[1][1] - this.scale.y;

    this.scale.set(
      this._scaleRange[0][0] + Math.random() * delta * xScaleDiff,
      this._scaleRange[1][0] + Math.random() * delta * yScaleDiff
    );

    this.position.set(
      this.position.x,
      this.position.y + -1 * delta * this._speed
    );
  }
}

document.body.appendChild(app.view);
app.stage.addChild(sprites);
app.loader
  .add(`${process.env.BASE_URL}/assets/revoltfx-spritesheet.json`)
  .load(() => {
    const fps = new DisplayFPS(app);
    const spawnPoint = [app.renderer.width / 2, app.renderer.height / 2];
    const lightEmitter = new ParticleEmitter(
      "fx-light01",
      [SEC * 1, SEC * 2],
      spawnPoint,
      [15, 5],
      [0.1, 0.2],
      [
        [0.3, 0.3],
        [0.3, 1.2],
      ],
      [200, 30],
      ["#ffca57", "#c42700"]
    );

    lightEmitter.init(5, sprites);

    const sparkEmitter = new ParticleEmitter(
      "fx-flame02",
      [SEC * 1, SEC * 1],
      [spawnPoint[0], spawnPoint[1] - 50],
      [15, 0],
      [0.5, 2],
      [
        [0.1, 0.1],
        [0.1, 0.1],
      ],
      [200, 100],
      ["#ffca57", "#c42700"]
    );

    sparkEmitter.init(2, sprites);

    const smokeEmitter = new ParticleEmitter(
      "mc_fx-explo_0019",
      [SEC * 1, SEC * 2],
      [spawnPoint[0], spawnPoint[1] - 50],
      [15, 0],
      [0.5, 2],
      [
        [0.5, 1],
        [0.5, 1],
      ],
      [100, 0],
      ["#343434", "#4D4D4D"]
    );

    smokeEmitter.init(2, sprites);

    app.stage.addChild(fps);
    app.ticker.add((delta) => {
      fps.update();
      const now = Date.now();
      sprites.children.forEach((c: Particle) => {
        c.update(delta, now);
      });
    });
  });
