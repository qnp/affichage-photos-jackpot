import { Sprite, Graphics, filters } from 'pixi.js';

class RandomStrike extends Sprite {

  constructor(color,...args) {
    super(...args);
    this.lines = [new Graphics(),new Graphics()]
    let w = 50;
    let moveX = window.innerWidth/2;
    let moveY = 0;
    let oldMoveX = moveX;
    let oldMoveY = moveY;
    this.lines[1].filters = [new filters.BlurFilter(5,5)];
    this.lines.forEach((line) => this.addChild(line));
    while (oldMoveY < window.innerHeight) {
      oldMoveX = moveX;
      oldMoveY = moveY;
      moveX = window.innerWidth/2-w+Math.random()*(w*2);
      if (Math.random() > 0.8) moveX = window.innerWidth/2+Math.random()*3*(-w+Math.random()*(w*2));
      if (Math.random() > 0.8) moveY += Math.random()*5;
      moveY += Math.random()*50;
      this.lines.forEach((line) => line
        .lineStyle(2,color)
        .moveTo(oldMoveX,oldMoveY)
        .lineTo(moveX,moveY)
      );
    }
  }

}

class RandomStrikeH extends Sprite {

  constructor(color,...args) {
    super(...args);
    this.lines = [new Graphics(),new Graphics()]
    let w = 50;
    let moveX = 0
    let moveY = window.innerHeight/2;
    let oldMoveX = moveX;
    let oldMoveY = moveY;
    this.lines[1].filters = [new filters.BlurFilter(5,5)];
    this.lines.forEach((line) => this.addChild(line));
    while (oldMoveX < window.innerWidth) {
      oldMoveX = moveX;
      oldMoveY = moveY;
      moveY = window.innerHeight/2-w+Math.random()*(w*2);
      if (Math.random() > 0.8) moveY = window.innerHeight/2+Math.random()*3*(-w+Math.random()*(w*2));
      if (Math.random() > 0.8) moveX += Math.random()*5;
      moveX += Math.random()*50;
      this.lines.forEach((line) => line
        .lineStyle(2,color)
        .moveTo(oldMoveX,oldMoveY)
        .lineTo(moveX,moveY)
      );
    }
  }

}

export default class ThunderStrike extends Sprite {

  constructor(...args) {
    super(...args);
    this.play = false;
    this.color = 0xffffff;
    /* this.randomStrike = new RandomStrike(this.color);
    this.randomStrikeH = new RandomStrikeH(this.color);
    this.addChild(this.randomStrike);
    this.addChild(this.randomStrikeH); */
    this.count = 0;
    this.countLim = 1;
  }

  start() {
    this.play = true;
  }

  stop() {
    this.play = false;
    if (this.randomStrike) this.removeChild(this.randomStrike);
    if (this.randomStrikeH) this.removeChild(this.randomStrikeH);
  }

  update(delta) {
    if (this.play) {
      this.count++;
      if (this.count > this.countLim) {
        if (this.randomStrike) this.removeChild(this.randomStrike);
        this.randomStrike = new RandomStrike(this.color);
        this.addChild(this.randomStrike);
        if (this.randomStrikeH) this.removeChild(this.randomStrikeH);
        this.randomStrikeH = new RandomStrikeH(this.color);
        this.addChild(this.randomStrikeH);
      }
    }
  }

}