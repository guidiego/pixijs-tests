import { Application, Container, Sprite, Text, Texture } from "pixi.js";

const app = new Application({
  resizeTo: window,
});

// Test 1
// 144 Sprites
// Animation from a Stack To Another Stack
// Animation Should Have 2 Seconds

// -> Create Sprite Map
// -> Create The Stack Container

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

      for (let i = 0; i <= state.moving; i++) {
        const diffX =
          stackTwo.x - (stackOne.position.x + stackOne.children[i].x);
        const diffY =
          stackTwo.y - (stackOne.position.y + stackOne.children[i].y);

        if (diffX <= 0 && diffY <= 0) {
          state.moving -= 1;
          stackOne.children[i].position.set(0, stackTwo.children.length + 1);
          stackTwo.addChild(stackOne.children[i]);
          stackOne.children[i].destroy();
        } else {
          stackOne.children[i].position.set(
            stackOne.children[i].position.x + (diffX < 0 ? -1 : 1) * 1 * delta,
            stackOne.children[i].position.y + (diffY < 0 ? -1 : 1) * 1 * delta
          );
        }
      }
    });
  });

document.body.appendChild(app.view);
