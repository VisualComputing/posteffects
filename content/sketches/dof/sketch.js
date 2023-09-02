'use strict';

let easycam;
let main_pg, depth_pg, dof_pg;
let depth_shader, dof_shader;
let depth, dof;
let blur_slider, aperture_slider;
let models;
let debug = false;
let znear, zfar;
const trange = 100;

function preload() {
  depth_shader = readShader('/posteffects/sketches/dof/shaders/depth_nonlinear.frag', { matrices: Tree.pmvMatrix });
  dof_shader = readShader('/posteffects/sketches/dof/shaders/dof.frag', { varyings: Tree.texcoords2 });
}

function setup() {
  createCanvas(600, 600);
  models = [];
  for (let i = 0; i < 50; i++) {
    models.push(
      {
        position: createVector((random() * 2 - 1) * trange, (random() * 2 - 1) * trange, (random() * 2 - 1) * trange),
        size: random() * 25 + 8,
        color: i === 0 ? color(0, 255, 0) : color(int(random(256)), int(random(256)), int(random(256))),
        type: i < 25 ? 'ball' : 'box'
      }
    );
  }
  // main graphics with camera
  main_pg = createGraphics(width, height, WEBGL);
  console.log("creando camara");
  easycam = new Dw.EasyCam(main_pg._renderer);
  easycam.attachMouseListeners(this._renderer);
  console.log("camara creada");
  // shaders' graphics
  depth_pg = createGraphics(width, height, WEBGL);
  depth_pg.textureMode(NORMAL);
  depth_pg.shader(depth_shader);
  dof_pg = createGraphics(width, height, WEBGL);
  dof_pg.textureMode(NORMAL);
  dof_pg.shader(dof_shader);
  dof_shader.setUniform('aspect', width / height);
  // gui
  /*
  addParameter("focus", this->focus, "min=0.95 max=1");
  addParameter("aperture", this->aperture, "min=0 max=1");
  addParameter("maxBlur", this->maxBlur, "min=0 max=1");
  // */
  blur_slider = createSlider(0, 1, 0.6, 0.01);
  blur_slider.position(10, 35);
  blur_slider.input(() => dof_shader.setUniform('maxBlur', blur_slider.value()));
  dof_shader.setUniform('maxBlur', blur_slider.value());
  aperture_slider = createSlider(0, 1, 0.8, 0.01);
  aperture_slider.position(10, 60);
  aperture_slider.input(() => dof_shader.setUniform('aperture', aperture_slider.value()));
  dof_shader.setUniform('aperture', aperture_slider.value());
  dof = createCheckbox('dof', true);
  dof.position(10, 10);
  dof.style('color', 'magenta');
  dof.changed(() => {
    dof.checked() ? blur_slider.show() : blur_slider.hide();
    dof.checked() ? aperture_slider.show() : aperture_slider.hide();
  });
  znear = createSlider(1, 50, 35, 1);
  znear.position(10, height - 40);
  zfar = createSlider(60, 1000, 700, 1);
  zfar.position(10, height - 20);
  debug ? znear.show() : znear.hide();
  debug ? zfar.show() : zfar.hide();
}

function draw() {
  if (frameCount % 5 === 0 && dof.checked()) {
    models[0].position = createVector((random() * 2 - 1) * trange, (random() * 2 - 1) * trange, (random() * 2 - 1) * trange);
  }
  main_pg.background(0);
  main_pg.reset();
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
  depth_pg.background(255);
  //depth_pg.background(0);
  depth_pg.reset();
  depth_pg.perspective(PI / 3, width / height, znear.value(), zfar.value());
  depth_pg.camera(position.x, position.y, position.z,
    center.x, center.y, center.z,
    up.x, up.y, up.z);
  // render
  render(depth_pg);
  if (depth) {
    // update graphics
    graphics = depth_pg;
  }
  else if (dof.checked()) {
    // a. set uniforms
    dof_shader.setUniform('texture', main_pg);
    dof_shader.setUniform('depthMap', depth_pg);
    //addParameter("focus", this->focus, "min=0.95 max=1");
    const focus = main_pg.treeLocation(models[0].position, { from: Tree.WORLD, to: Tree.SCREEN });
    dof_shader.setUniform('focus', focus.z);
    //dof_shader.setUniform('focus', map(mouseX, 0, width, -0.5, 1.5));
    //dof_shader.setUniform('focus', 0.985);
    // b. update graphics
    graphics = dof_pg;
    // c. render
    graphics.quad(-1, 1, 1, 1, 1, -1, -1, -1);
  }
  image(graphics, 0, 0);
}

function render(graphics) {
  graphics.push();
  models.forEach(model => {
    graphics.push();
    graphics.noStroke();
    graphics.fill(model.color);
    graphics.translate(model.position);
    model.type === 'box' ? graphics.box(model.size) : graphics.sphere(model.size);
    graphics.pop();
  });
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