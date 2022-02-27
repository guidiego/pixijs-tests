import { Application, Texture } from "pixi.js";
import DisplayFPS from "./util/DisplayFPS";
import EnhancedSprite from "./util/EnhancedSprite";
import EnhancedSpriteGroup from "./util/EnhancedSpriteGroup";

const TOTAL_SPRITES = 144;
const SEC = 1000;

const app = new Application({
  resizeTo: window,
});

app.loader
  .add("sprite-itens", `${process.env.BASE_URL}/assets/sprite-itens.json`)
  .load((_, resources) => {
    const itens = Object.keys(resources["sprite-itens"].data.frames);
    const itensQtd = itens.length;
    const grid = window.innerWidth / 6;
    const stacksY = 75;
    const stackOneX = grid;
    const stackTwoX = grid * 4;
    const group = new EnhancedSpriteGroup();
    const fps = new DisplayFPS(app);

    for (let i = 0; i < TOTAL_SPRITES; i++) {
      const realIdx = i >= itensQtd ? i - itensQtd : i;
      const texture = Texture.from(itens[realIdx]);
      const s = new EnhancedSprite(
        texture,
        TOTAL_SPRITES,
        stacksY,
        stackOneX,
        stackTwoX,
        i
      );
      group.addChild(s);
    }

    let movings = [];
    let lastIdxMov = -1;
    let nextMoving = 0;

    group.position.set(0, 0);
    app.stage.addChild(group);
    app.ticker.add((delta) => {
      fps.update();

      const now = Date.now();
      if (nextMoving <= now && lastIdxMov < group.children.length - 1) {
        nextMoving = now + SEC;
        lastIdxMov += 1;
        movings = [...movings, lastIdxMov];
      }

      if (movings.length === 0) {
        return;
      }

      for (const i of movings) {
        const item = group.children[i];
        if (item.move(delta)) {
          item.fixDist();
          movings = movings.filter((v) => v !== i);
        }
      }
    });
  });

document.body.appendChild(app.view);
