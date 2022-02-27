import { Application, Texture } from "pixi.js";
import { ImageTextTool } from "./util/ImageTextTool";

const SEC = 1000;

const app = new Application({
  resizeTo: window,
});

const RAND_FONT_MAX = 50;
const RAND_FONT_MIN = 10;
const LIST_OF_RANDOM_WORLD = [
  "game",
  "foo",
  "bar",
  "deutschland",
  "english",
  "phaser",
  "pixi.js",
  "webpack",
  "fizzfuzz",
  "development",
  "production",
  "alexanderplatz",
  "u-bahn",
  "brazil",
];

const createRandomImageText = (images, delta) => {
  const randConfig = [
    Math.round(Math.random() * (LIST_OF_RANDOM_WORLD.length - 1)),
    Math.round(Math.random() * (LIST_OF_RANDOM_WORLD.length - 1)),
    Math.round(Math.random() * (LIST_OF_RANDOM_WORLD.length - 1)),
  ].map((val) => {
    if (val % 2 === 0) {
      return LIST_OF_RANDOM_WORLD[val];
    }

    return Texture.from(images[val]);
  });

  const fontSize = Math.round(RAND_FONT_MIN + Math.random() * RAND_FONT_MAX);
  const x = Math.round(Math.random() * window.innerWidth * delta);
  const y = Math.round(Math.random() * window.innerHeight * delta);

  return new ImageTextTool(randConfig, {
    x,
    y,
    padding: 10,
    textStyle: { fontSize },
  });
};

app.loader
  .add("sprite-itens", `${process.env.BASE_URL}/assets/sprite-itens.json`)
  .load((_, resources) => {
    const itens = Object.keys(resources["sprite-itens"].data.frames);

    let nextMoving = 0;
    app.ticker.add((delta) => {
      const now = Date.now();
      if (nextMoving <= now) {
        nextMoving = now + SEC;
        app.stage.addChild(createRandomImageText(itens, delta));
      }
    });
  });

document.body.appendChild(app.view);
