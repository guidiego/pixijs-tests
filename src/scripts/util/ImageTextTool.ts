import { Container, Sprite, Text, Texture, TextStyle } from "pixi.js";

type AllowedInTool = Texture | string;
type ResultedInTool = Sprite | Text;
type ImageTextToolOpts = {
  x?: number;
  y?: number;
  padding?: number;
  textStyle?: Partial<TextStyle>;
};

export class ImageTextTool extends Container {
  constructor(
    items: AllowedInTool[],
    { x = 0, y = 0, padding = 0, textStyle }: ImageTextToolOpts = {}
  ) {
    super();
    this.position.set(x, y);

    textStyle.fill = !textStyle.fill ? "#FFF" : textStyle.fill;

    const createdItems: ResultedInTool[] = items.map((raw) => {
      if (raw instanceof Texture) {
        return new Sprite(raw);
      } else {
        return new Text(raw, textStyle);
      }
    });

    createdItems.forEach((item, idx) => {
      const offset = createdItems.reduce(
        (a, c, i) => (i < idx ? a + c.width + padding : a),
        0
      );

      item.position.set(offset, 0);
      this.addChild(item);
    });
  }
}

export default ImageTextTool;
