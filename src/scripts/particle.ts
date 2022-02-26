import { Application } from "pixi.js";

const app = new Application({
  resizeTo: window,
});

app.loader.add("sprite-itens", "/assets/sprite-itens.json");

document.body.appendChild(app.view);
