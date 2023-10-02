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
  createCanvas(600, 900);
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
  main_pg = createGraphics(width / 2, height / 3, WEBGL);
  console.log("creando camara");
  easycam = new Dw.EasyCam(main_pg._renderer);
  easycam.attachMouseListeners(this._renderer);
  console.log("camara creada");
  // shaders' graphics
  depth_pg = createGraphics(width / 2, height / 3, WEBGL);
  depth_pg.textureMode(NORMAL);
  depth_pg.shader(depth_shader);
  dof_pg = createGraphics(width, 2 * height / 3, WEBGL);
  dof_pg.textureMode(NORMAL);
  dof_pg.shader(dof_shader);
  dof_shader.setUniform('aspect', width / height);

  blur_slider = createSlider(0, 1, 0.6, 0.01);
  blur_slider.position(10, 35);
  blur_slider.input(() => dof_shader.setUniform('maxBlur', blur_slider.value()));
  dof_shader.setUniform('maxBlur', blur_slider.value());
  
  aperture_slider = createSlider(0, 1, 0.8, 0.01);
  aperture_slider.position(10, 60);
  aperture_slider.input(() => dof_shader.setUniform('aperture', aperture_slider.value()));
  dof_shader.setUniform('aperture', aperture_slider.value());
  
  znear = createSlider(1, 50, 35, 1);
  znear.position(10, height - 40);
  zfar = createSlider(60, 1000, 700, 1);
  zfar.position(10, height - 20);
  debug ? znear.show() : znear.hide();
  debug ? zfar.show() : zfar.hide();
}

function draw() {
  if (frameCount % 100 === 0) {
    models[0].position = createVector((random() * 2 - 1) * trange, (random() * 2 - 1) * trange, (random() * 2 - 1) * trange);
  }
  main_pg.background(0);
  
  render(main_pg);
  
  let position = main_pg.treeLocation(Tree.ORIGIN,  {from: Tree.EYE, to: Tree.WORLD});
  let center = p5.Vector.add(position, main_pg.treeDisplacement());
  let up = main_pg.treeDisplacement(Tree.j);
  
  //depth_pg.background(255);
  depth_pg.background(0);
  
  depth_pg.camera(position.x, position.y, position.z,
    center.x, center.y, center.z,
    up.x, up.y, up.z);
    
    // render
  render(depth_pg);
  
  const focus = main_pg.treeLocation(models[0].position, { from: Tree.WORLD, to: Tree.SCREEN });
  dof_shader.setUniform('texture', main_pg);
  dof_shader.setUniform('depthMap', depth_pg);
  dof_shader.setUniform('focus', focus.z);
 
  depth_pg.quad(-1, 1, 1, 1, 1, -1, -1, -1);
  dof_pg.quad(-1, 1, 1, 1, 1, -1, -1, -1);
  
  image(main_pg, 0, 0, width / 2, height / 3);
  image(depth_pg, 300, 0, width , height / 3);
  image(dof_pg, 0, height / 3, width, height);

  main_pg.reset();
  depth_pg.reset();
  dof_pg.reset();
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

function mouseWheel(event) {
  return false;
}
