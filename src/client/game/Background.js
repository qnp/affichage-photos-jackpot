import { Sprite, Texture } from 'pixi.js';

export default class Background extends Sprite {

  constructor(num) {
    const texture = Texture.fromFrame('bg'+num);

    super(texture);

    this.anchor.x = 0;
    this.anchor.y = 0;
  }

}