import DisplayFPS from "./util/DisplayFPS";

import { Application, ParticleContainer } from "pixi.js";
import { ParticleEmitter, Particle } from "./util/ParticleEmitter";

const SEC = 1000;
const app = new Application({ resizeTo: window, backgroundColor: 0x333333 });
const sprites = new ParticleContainer(10, {
  scale: true,
  position: true,
  rotation: true,
  uvs: true,
  alpha: true,
});

document.body.appendChild(app.view);
app.stage.addChild(sprites);
app.loader
  .add(`${process.env.BASE_URL}/assets/revoltfx-spritesheet.json`)
  .load(() => {
    const fps = new DisplayFPS(app);
    const spawnPoint = [
      app.renderer.width / 2,
      app.renderer.height - app.renderer.height / 5,
    ];

    const lightEmitter = new ParticleEmitter(
      "fx-light01",
      [SEC * 1, SEC * 2],
      spawnPoint,
      [15, 5],
      [
        [0, 0],
        [0, -0.2],
      ],
      [
        [0.3, 0.3],
        [0.3, 1.2],
      ],
      [200, 30],
      ["#ffca57", "#c42700"]
    );

    const sparkEmitter = new ParticleEmitter(
      "fx-flame02",
      [SEC * 1, SEC * 1],
      [spawnPoint[0] - 5, spawnPoint[1] - 80],
      [20, 0],
      [
        [-0.1, 0.1],
        [-0.5, -2],
      ],
      [
        [0.1, 0.1],
        [0.1, 0.1],
      ],
      [200, 100],
      ["#ffca57", "#c42700"],
      1.4
    );

    const smokeEmitter = new ParticleEmitter(
      "mc_fx-explo_0019",
      [SEC * 1, SEC * 2],
      [spawnPoint[0] - 30, spawnPoint[1]],
      [15, 0],
      [
        [-1, 2],
        [-0.5, -2],
      ],
      [
        [0.5, 1],
        [0.5, 1],
      ],
      [100, 0],
      ["#343434", "#4D4D4D"],
      0,
      [0, 1]
    );

    const bgLight = new ParticleEmitter(
      "fx-light01",
      [SEC * 2, SEC * 3],
      [spawnPoint[0], spawnPoint[1] + 70],
      [0, 0],
      [
        [0, 0],
        [0, -0.2],
      ],
      [
        [1, 2],
        [1, 2],
      ],
      [0.1, 0.1],
      ["#FFFD9A", "#FC7819"]
    );

    bgLight.init(1, sprites);
    lightEmitter.init(5, sprites);
    smokeEmitter.init(2, sprites);
    sparkEmitter.init(2, sprites);

    app.stage.addChild(fps);
    app.ticker.add((delta) => {
      fps.update();
      const now = Date.now();
      sprites.children.forEach((c: Particle) => {
        c.update(delta, now);
      });
    });
  });
