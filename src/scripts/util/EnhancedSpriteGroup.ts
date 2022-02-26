import { Container } from "pixi.js";
import EnhancedSprite from "./EnhancedSprite";

export class EnhancedSpriteGroup extends Container {
  children: EnhancedSprite[] = [];
}

export default EnhancedSpriteGroup;
