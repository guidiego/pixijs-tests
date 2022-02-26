import { Container, Sprite, Text } from "pixi.js";

type AllowedInTool = Text | Sprite;
type ImageTextToolOpts = {
  x?: number;
  y?: number;
  padding?: number;
};

export class ImageTextTool extends Container {
  constructor(
    items: AllowedInTool[],
    { x = 0, y = 0, padding = 0 }: ImageTextToolOpts = {}
  ) {
    super();

    this.position.set(x, y);

    items.forEach((item, idx) => {
      const offset = items.reduce(
        (a, c, i) => (i < idx ? a + c.width + padding : a),
        0
      );

      item.position.set(offset, 0);
      this.addChild(item);
    });
  }
}

export default ImageTextTool;
