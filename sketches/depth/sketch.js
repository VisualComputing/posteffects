'use strict';

let easycam;
let main_pg, depth_pg;
let depth_shader;
let depth;

let debug = false;
let znear, zfar;
const trange = 100;

let x, z;
let rx, rz;
let theta;

function preload() {
  depth_shader = readShader('/posteffects/sketches/depth/shaders/depth_nonlinear.frag', { 
    matrices: Tree.pmvMatrix 
  });
}

function setup() {
  createCanvas(600, 300);
  angleMode(DEGREES);

  // main graphics with camera
  main_pg = createGraphics(width / 2, height, WEBGL);
  console.log("creando camara");
  easycam = new Dw.EasyCam(main_pg._renderer);
  easycam.attachMouseListeners(this._renderer);
  console.log("camara creada");
  // shaders' graphics
  depth_pg = createGraphics(width / 2, height, WEBGL);
  depth_pg.textureMode(NORMAL);
  depth_pg.shader(depth_shader);
  // gui
  
  znear = createSlider(1, 50, 35, 1);
  znear.position(10, height - 40);
  zfar = createSlider(60, 1000, 700, 1);
  zfar.position(10, height - 20);
  debug ? znear.show() : znear.hide();
  debug ? zfar.show() : zfar.hide();

  rx = 100;
  rz = 100;
  theta = 0;
}

function draw() {
  main_pg.background(0);
  main_pg.reset();
  x = rx * cos(theta);
  z = rz * sin(theta) + 290 ;
  theta = (theta + 3) % 360; 

  // where eyeZ is equal to ((height/2) / tan(PI/6))
  //pg.perspective(PI/3, width/height, eyeZ/10, eyeZ*10);
  main_pg.perspective(PI / 3, width / height, znear.value(), zfar.value());
  main_pg.axes();
  main_pg.push();
  main_pg.stroke('white');
  main_pg.grid({ size: 200, style: Tree.SOLID });
  main_pg.pop();
  let graphics = main_pg;
  render(graphics);
  // depth
  // 1. compute current main canvas camera params
  let position = main_pg.treeLocation(Tree.ORIGIN,  {from: Tree.EYE, to: Tree.WORLD});
  let center = p5.Vector.add(position, main_pg.treeDisplacement());
  let up = main_pg.treeDisplacement(Tree.j);
  // in case the current camera projection params are needed check:
  // https://github.com/VisualComputing/p5.treegl#frustum-queries
  // 2. offscreen rendering
  //depthMap.background(1);
  depth_pg.background(50);
  depth_pg.reset();
  depth_pg.perspective(PI / 3, width / height, znear.value(), zfar.value());
  depth_pg.camera(position.x, position.y, position.z,
    center.x, center.y, center.z,
    up.x, up.y, up.z);
  // render
  render(depth_pg);
  image(main_pg, 0, 0);
  image(depth_pg, width / 2, 0);
}

function render(graphics) {
  graphics.push();
    graphics.stroke(0, 0, 255);
    graphics.strokeWeight(25);
    graphics.translate(x, 0, z);
    graphics.rotateX(theta * 0.01);
    graphics.rotateY(theta * 0.01);
    graphics.rotateZ(theta * 0.01);
    graphics.box(100, 100, 100)
  graphics.pop();
}

function keyPressed() {
  if (key === 'd') {
    depth = !depth;
  }
}

function mouseWheel(event) {
  return false;
}