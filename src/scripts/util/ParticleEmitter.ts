import ct from "color-transitions";
import rgbHex from "rgb-hex";

import { Sprite, ParticleContainer, Texture } from "pixi.js";

export class ParticleEmitter {
  private _texture: string;
  private _lifetimeRation: number[];
  private _spawnPoint: number[];
  private _spawnPointOffset: number[];
  private _speedRange: number[][];
  private _scaleRange: number[][];
  private _alphaRange: number[];
  private _colorRange: string[];
  private _rotateOrigin: number;
  private _rotateRange: number[];

  constructor(
    texture: string,
    lifetimeRation: number[],
    spawnPoint: number[],
    spawnPointOffset: number[],
    speedRange: number[][],
    scaleRange: number[][],
    alphaRange: number[],
    colorRange: string[],
    rotate = 0,
    rotateRange = [0, 0]
  ) {
    this._texture = texture;
    this._lifetimeRation = lifetimeRation;
    this._spawnPoint = spawnPoint;
    this._spawnPointOffset = spawnPointOffset;
    this._speedRange = speedRange;
    this._scaleRange = scaleRange;
    this._alphaRange = alphaRange;
    this._colorRange = colorRange;
    this._rotateOrigin = rotate;
    this._rotateRange = rotateRange;
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
          this._speedRange,
          this._scaleRange,
          this._alphaRange,
          this._colorRange,
          this._rotateOrigin,
          this._rotateRange
        )
      );
    }
  }
}

export class Particle extends Sprite {
  private _speed: number[];
  private _spawnPoint: number[];
  private _spawnPointOffset: number[];
  private _alpha: number[];
  private _lifetime: number;
  private _lifetimeRation: number;
  private _scaleRange: number[][];
  private _colorRange: string[];
  private _rotationRange: number[];

  constructor(
    texture: string,
    spawnPoint: number[],
    spawnPointOffset: number[],
    lifetimeRation: number,
    speed: number[][],
    scaleRange: number[][],
    alpha: number[],
    colorRange: string[],
    rotation: number,
    rotationRange: number[]
  ) {
    super(Texture.from(texture));
    this._speed = [
      speed[0][0] + Math.random() * speed[0][1],
      speed[1][0] + Math.random() * speed[1][1],
    ];

    this._lifetimeRation = lifetimeRation;
    this._alpha = alpha;
    this._spawnPoint = spawnPoint;
    this._spawnPointOffset = spawnPointOffset;
    this._scaleRange = scaleRange;
    this._colorRange = colorRange;
    this._rotationRange = rotationRange;

    this.alpha = this._alpha[0];
    this.rotation = rotation;
    this.reset(Date.now());
    this.anchor.set(0.5, 1);
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

    if (this._rotationRange[0] !== 0 || this._rotationRange[1] !== 0) {
      this.rotation +=
        this._rotationRange[0] +
        Math.random() * (this._rotationRange[1] - this.rotation) * delta;
    }

    this.scale.set(
      this._scaleRange[0][0] + Math.random() * delta * xScaleDiff,
      this._scaleRange[1][0] + Math.random() * delta * yScaleDiff
    );

    this.position.set(
      this.position.x + this._speed[0] * delta,
      this.position.y + delta * this._speed[1]
    );
  }
}
