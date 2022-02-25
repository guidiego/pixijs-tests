import { Application, Sprite, Text, Texture } from "pixi.js";
import { ImageTextTool } from "./util/ImageTextTool";

const app = new Application({
  resizeTo: window,
});

app.loader.add("sprite-itens", "/assets/sprite-itens.json").load(() => {
  const val = new ImageTextTool(
    [
      new Sprite(Texture.from("Apple")),
      new Text("Test", { fill: "#FFF" }),
      new Text("Test", { fill: "#FFF" }),
    ],
    { x: 100, y: 100, padding: 10 }
  );

  const val2 = new ImageTextTool(
    [
      new Sprite(Texture.from("Apple")),
      new Text("Test", { fill: "#FFF" }),
      new Text("Test", { fill: "#FFF" }),
    ],
    { x: 200, y: 200, padding: 10 }
  );

  app.stage.addChild(val2);
  app.stage.addChild(val);
});

document.body.appendChild(app.view);
