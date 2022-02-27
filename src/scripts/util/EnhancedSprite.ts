import { Sprite, Texture } from "pixi.js";

export class EnhancedSprite extends Sprite {
  static OFFSET = 2.5;

  private _normalizedX: number;
  private _normalizedY: number;
  private _direction: number;

  private _distX: number;
  private _distY: number;
  private _speed: number;

  constructor(
    texture: Texture,
    totalSprites: number,
    stacksY: number,
    initialX: number,
    finalX: number,
    index: number
  ) {
    super(texture);

    const reversedIndex = totalSprites - index - 1;
    this._distY = stacksY + reversedIndex * EnhancedSprite.OFFSET;
    this._distX = finalX;
    this._speed = 10;
    this.position.set(initialX, stacksY + index * EnhancedSprite.OFFSET);
    this.calcNormalizedVects(finalX - initialX, this.position.y - this._distY);
  }

  private calcNormalizedVects(x, y) {
    if (y < 0) {
      this._normalizedY = y * -1;
      this._direction = 1;
    } else {
      this._normalizedY = y;
      this._direction = -1;
    }

    const mag = Math.sqrt(x * x + this._normalizedY * this._normalizedY);

    this._normalizedX = x / mag;
    this._normalizedY = this._normalizedY / mag;
  }

  fixDist() {
    this.position.set(this._distX, this._distY);
  }

  move(delta) {
    if (this.position.x >= this._distX) {
      this._normalizedX = 0;
    }

    if (this._direction === 1) {
      if (this.position.y >= this._distY) {
        this._normalizedY = 0;
      }
    } else {
      if (this.position.y <= this._distY) {
        this._normalizedY = 0;
      }
    }

    if (this._normalizedX === 0 && this._normalizedY === 0) {
      return true;
    }

    this.position.set(
      this.position.x + this._normalizedX * delta * this._speed,
      this.position.y +
        this._normalizedY * delta * this._direction * this._speed
    );

    return false;
  }
}

export default EnhancedSprite;
