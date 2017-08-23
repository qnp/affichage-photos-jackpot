import './style.css'; // webpack magic

import { Container, Point, Graphics, Text, TextStyle, SCALE_MODES, BLEND_MODES, settings, Sprite } from 'pixi.js';
import { RGBSplitFilter } from 'pixi-filters';

settings.SCALE_MODE = SCALE_MODES.NEAREST;

import bluebird from "bluebird";
import io from 'socket.io-client';

import * as engine from 'engine';
import * as display from 'engine/display';
import * as input from 'engine/input';
import * as resources from 'engine/resources';
import Scene from 'engine/Scene';

import Quidam from './Quidam';
import Background from './Background';
import ThunderStrike from './ThunderStrike';


class AffichagePhotosJackpot extends Scene {
  init() {

    this.socket = io('http://localhost:8000');

    this.socket.on('connect', () => console.log('Socket connected'));
    this.socket.on('disconnect', () => console.log('Socket disconnected'));
    // this.socket.on('startEndAnimation', () => this.startEndAnimation());

    this.THUNDER_TIME = 4000;
    this.idBg = 0;
    this.alphaBgInc = 0.0001;

    this.bgs = [];
    for (let i=1; i<=8; i++) this.bgs.push(new Background(i));

    this.bgs.forEach((bg) => {
      this.stage.addChild(bg);
      bg.alpha = 0;
      bg.blendMode = BLEND_MODES.ADD;
    });

    this.bgs[this.idBg].alpha = 1;

    this.quidams = [];
    this.socket.on('imageAdded', (data) => this.quidams.push(this.addNewQuidam(data.id)));

    //this.quidams.push(this.addNewQuidam(1,this.thunderstrike,this.stage));
    this.count = 0;

  }

  addNewQuidam(id) {
    let quidam = new Quidam(id,window.innerWidth/2,window.innerHeight/2);
    this.stage.addChild(quidam);
    if (this.thunderstrike) this.stage.removeChild(this.thunderstrike);
    this.thunderstrike = new ThunderStrike();
    this.stage.addChild(this.thunderstrike);
    this.thunderstrike.start();
    setTimeout(()=>{
      this.thunderstrike.stop();
      quidam.move();
    },this.THUNDER_TIME)
    return quidam;
  }

  update(delta) {

    this.bgs[this.idBg%this.bgs.length].alpha -= this.alphaBgInc;
    this.bgs[(this.idBg+1)%this.bgs.length].alpha += this.alphaBgInc;
    if (this.bgs[this.idBg%this.bgs.length].alpha <= 0) this.idBg = (this.idBg+1)%this.bgs.length;

    this.quidams.forEach((quidam) => quidam.update(delta));
    this.quidams.forEach((quidam,i) => {
      if (quidam.scale.x == 0) {
        this.stage.removeChild(quidam);
        this.quidams.splice(i,1);
      }
    });

    if (this.thunderstrike) this.thunderstrike.update(delta);

  }

}

const parentElement = document.body;
parentElement.innerHTML = '<div class="msg-loading">Loading...</div>';

engine.launch(new AffichagePhotosJackpot(), {parentElement});
