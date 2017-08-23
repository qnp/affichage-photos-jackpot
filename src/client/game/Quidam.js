import { Sprite, Texture, filters } from 'pixi.js';

function randomMatrix() {
  let matrix = [
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0
  ];
  let rdNum = Math.round(Math.random()*10);
  for (let i=0; i<rdNum; i++) {
    let rdIndex = Math.round(Math.random()*20);
    matrix[rdIndex] = Math.random();
  }
  return matrix;
}

export default class Quidam extends Sprite {

  constructor(id,x,y) {
    const texture = Texture.fromImage('http://localhost:8000/images/'+id+'.png');
    //const texture = Texture.fromFrame(id);
    super(texture);

    console.log('quidam',id,x,y);

    this.isAdded = true;

    this.filter = new filters.ColorMatrixFilter();

    this.anchor.x = 0.5;
    this.anchor.y = 0.5;

    this.initScale = 0.3;
    this.scaleInc = 0.00001;

    this.scale.x = this.initScale;
    this.scale.y = this.initScale;

    this.whlimit = 200;

    this.rotation = 0;

    this.counterLim = 200;
    this.counterWaitLim = 400;

    this.changePos = true;
    this.counter = 0;
    this.counterWait = 0;
    this.position.x = x;
    this.position.y = y;
    this.prevpos = {
      x: x,
      y: y,
      r: 0
    };
    this.newpos = {
      x: x,
      y: y,
      r: 0
    };
    this.f = 0;
    this.fr = 0;
    this.beta = 0;
    this.C = {
      x: 0,
      y: 0,
      r: 0
    };
    this.phi = {
      x: 0,
      y: 0,
      r: 0
    };
    this.A = {
      x: 0,
      y: 0,
      r: 0
    }
    this.m = 10;
    this.speed = {
      x: 10,
      y: 10,
      r: 0.1
    };
    this.t = 0;

  }

  move() {
    this.isAdded = false;
    this.filters = [];
  }

  update(delta) {

    if (this.isAdded) {

      this.filter.matrix = randomMatrix();
      this.filters = [
        this.filter
      ];

    } else {

      this.prevpos.x = this.position.x;
      this.prevpos.y = this.position.y;
      this.prevpos.r = this.rotation;
      if (this.changePos) {
        this.changePos = false;
        this.counter = 0;
        this.counterWait = 0;
        this.t = 0;
        this.newpos.x = Math.round(Math.random()*(window.innerWidth-this.whlimit));
        this.newpos.y = Math.round(Math.random()*(window.innerHeight-this.whlimit));
        this.newpos.r = Math.random()*2*Math.PI;
        this.f = Math.random()*100;
        this.fr = Math.random()*0.1;
        let tempDist = Math.sqrt(Math.pow(this.newpos.x-this.position.x,2)+Math.pow(this.newpos.y-this.position.y,2));
        let tempDistR = Math.sqrt(Math.pow(this.newpos.r-this.rotation,2));
        this.beta = Math.sqrt(this.f / (this.m*tempDist));
        this.C.x = this.f*this.newpos.x / (this.m*tempDist);
        this.C.y = this.f*this.newpos.y / (this.m*tempDist);
        this.C.r = this.fr*this.newpos.r / (this.m*tempDistR);
        let tempAtanArgX = this.speed.x / (this.C.x/this.beta - this.beta*this.position.x);
        let tempAtanArgY = this.speed.y / (this.C.y/this.beta - this.beta*this.position.y);
        let tempAtanArgR = this.speed.r / (this.C.r/this.beta - this.beta*this.rotation);
        this.phi.x = tempAtanArgX >= 0 ? Math.atan(tempAtanArgX) : Math.atan(tempAtanArgX) + Math.PI;
        this.phi.y = tempAtanArgY >= 0 ? Math.atan(tempAtanArgY) : Math.atan(tempAtanArgY) + Math.PI;
        this.phi.r = tempAtanArgR >= 0 ? Math.atan(tempAtanArgR) : Math.atan(tempAtanArgR) + Math.PI;
        this.A.x = -this.speed.x / (this.beta*Math.sin(this.phi.x));
        this.A.y = -this.speed.y / (this.beta*Math.sin(this.phi.y));
        this.A.r = -this.speed.r / (this.beta*Math.sin(this.phi.r));

        //console.log(this.t,this.newpos,this.f,this.fr,tempDist,tempDistR,this.beta,this.C,tempAtanArgX,tempAtanArgY,this.phi,this.A);
        //this.dx = (this.newpos.x-this.position.x)/100;
        //this.dy = (this.newpos.y-this.position.y)/100;
        //console.log(this.newpos.x,this.newpos.y,this.dx,this.dy);
        //this.position.x = this.newpos.x;
        //this.position.y = this.newpos.y;
        //console.log(Math.abs(2),Math.abs(this.position.x - this.newpos.x),Math.abs(this.position.y - this.newpos.y));
      }

      this.t += delta;
      this.counter++;
      this.counterWait++;

      this.position.x = this.A.x * Math.cos( this.beta * this.t + this.phi.x ) + this.C.x / Math.pow(this.beta,2);
      this.position.y = this.A.y * Math.cos( this.beta * this.t + this.phi.y ) + this.C.y / Math.pow(this.beta,2);
      this.rotation = this.A.r * Math.cos( this.beta * this.t + this.phi.r ) + this.C.r / Math.pow(this.beta,2);
      if (this.scale.x > 0) {
        this.scale.x -= this.scaleInc;
        this.scale.y -= this.scaleInc;
      } else {
        this.scale.x = 0;
        this.scale.y = 0;
      }

      this.speed.x = (this.position.x - this.prevpos.x) / delta;
      this.speed.y = (this.position.y - this.prevpos.y) / delta;
      this.speed.r = (this.rotation - this.prevpos.r) / delta;

      if (!this.andWait && (this.position.x<1 || this.position.y<1 || this.position.x>window.innerWidth || this.position.y>window.innerHeight) ) {
        this.changePos = true;
        this.andWait = true;
      }
      if (!this.andWait && this.counter > this.counterLim) {
        this.changePos = true;
      }
      if (this.counterWait > this.counterWaitLim) {
        this.andWait = false;
      }

    }
    //console.log(this.position.x,this.position.y,this.speed.x,this.speed.y);

  }

}