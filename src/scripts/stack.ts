import { Application, Container, Sprite, Text, Texture } from "pixi.js";

const app = new Application({
  resizeTo: window,
});

/**
 * TODO:
 * Enhance Animation Based on
 * - Vectorial Math
 * - ZIndex Capability
 * - Last Item never completes the interaction
 */

app.loader
  .add("sprite-itens", "/assets/sprite-itens.json")
  .load((_, resources) => {
    const itens = Object.keys(resources["sprite-itens"].data.frames);
    const itensQtd = itens.length;
    const scene = new Container();
    const stackOne = new Container();
    const stackTwo = new Container();
    const fpsText = new Text(`FPS: --`, {
      fill: "#FFF",
    });

    for (let i = 0; i < 144; i++) {
      const realIdx = i >= itensQtd ? i - itensQtd : i;
      const s = new Sprite(Texture.from(itens[realIdx]));
      s.position.set(0, i + 1);
      stackOne.addChild(s);
    }

    fpsText.position.set(10, 10);

    stackOne.position.set(window.innerWidth / 3, window.innerHeight / 2);
    stackTwo.position.set(stackOne.x + 100, stackOne.y);

    scene.addChild(fpsText);
    scene.addChild(stackOne);
    scene.addChild(stackTwo);

    app.stage.addChild(scene);

    const state = {
      moving: 0,
      nextMoving: 0,
    };

    app.ticker.add((delta) => {
      fpsText.text = `FPS: ${app.ticker.FPS.toFixed()}`;
      const now = Date.now();

      if (state.nextMoving <= now) {
        state.nextMoving = now + 1000;
        state.moving += 1;
      }

      const itensInStackTwo = stackTwo.children.length;
      for (let i = 0; i <= state.moving; i++) {
        const item = stackOne.children[stackOne.children.length - 1 - i];
        const diffX = stackTwo.x - (stackOne.position.x + item.x);
        const diffY =
          stackTwo.y + itensInStackTwo + 1 - (stackOne.position.y + item.y);

        if (diffX <= 0 && diffY <= 0) {
          state.moving -= 1;
          item.position.set(0, itensInStackTwo + 1);
          stackOne.removeChild(item);
          stackTwo.addChild(item);
        } else {
          item.position.set(
            item.position.x + (diffX < 0 ? -1 : 1) * 1 * delta,
            item.position.y + (diffY < 0 ? -1 : 1) * 1 * delta
          );
        }
      }
    });
  });

document.body.appendChild(app.view);
