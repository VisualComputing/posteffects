'use strict';

let easycam;
let current_pg, main_pg, caleido_pg, depth_pg, dof_pg, edge_pg, horizontal_pg, noise_pg, pixelate_pg, rays_pg;
let caleido_shader, depth_shader, dof_shader, edge_shader, horizontal_shader, noise_shader, pixelate_shader, rays_shader;
let models;
let effects = [0];
const trange = 100;
let caleido_chk, dof_chk, edge_chk, horizontal_chk, noise_chk, pixelate_chk, rays_chk; 

function preload() {
  depth_shader = readShader('/posteffects/sketches/mezcla/shaders/depth_nonlinear.frag', { matrices: Tree.pmvMatrix });
  dof_shader = readShader('/posteffects/sketches/mezcla/shaders/dof.frag', { varyings: Tree.texcoords2 });
  caleido_shader = readShader('/posteffects/sketches/mezcla/shaders/caleido.frag', { varyings: Tree.texcoords2 });
  edge_shader = readShader('/posteffects/sketches/mezcla/shaders/edge.frag', { varyings: Tree.texcoords2 });
  horizontal_shader = readShader('/posteffects/sketches/mezcla/shaders/horizontal.frag', { varyings: Tree.texcoords2 });
  noise_shader = readShader('/posteffects/sketches/mezcla/shaders/noise.frag', { varyings: Tree.texcoords2 });
  pixelate_shader = readShader('/posteffects/sketches/mezcla/shaders/pixelate.frag', { varyings: Tree.texcoords2 });
  rays_shader = readShader('/posteffects/sketches/mezcla/shaders/rays.frag', { varyings: Tree.texcoords2 });
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
  
  main_pg = createGraphics(width, height, WEBGL);
  
  easycam = new Dw.EasyCam(main_pg._renderer);
  easycam.attachMouseListeners(this._renderer);
  current_pg = main_pg;

  // shaders' graphics
  
  caleido_pg = createGraphics(width, height, WEBGL);
  caleido_pg.textureMode(NORMAL);
  caleido_pg.colorMode(RGB, 1);
  caleido_pg.shader(caleido_shader);
  caleido_shader.setUniform('segments', 3);

  depth_pg = createGraphics(width, height, WEBGL);
  depth_pg.textureMode(NORMAL);
  depth_pg.shader(depth_shader);
  
  dof_pg = createGraphics(width, height, WEBGL);
  dof_pg.textureMode(NORMAL);
  dof_pg.shader(dof_shader);
  dof_shader.setUniform('aspect', width / height);
  dof_shader.setUniform('maxBlur', 0.5);
  dof_shader.setUniform('aperture', 0.8);

  edge_pg = createGraphics(width, height, WEBGL);
  edge_pg.textureMode(NORMAL);
  edge_pg.colorMode(RGB, 1);
  edge_pg.shader(edge_shader);
  edge_shader.setUniform('aspect', [1 / main_pg.width, 1 / main_pg.height]);

  horizontal_pg = createGraphics(width, height, WEBGL);
  horizontal_pg.textureMode(NORMAL);
  horizontal_pg.colorMode(RGB, 1);
  horizontal_pg.angleMode(DEGREES);
  horizontal_pg.shader(horizontal_shader);
  horizontal_shader.setUniform('h', 0.1);
  horizontal_shader.setUniform('r', 0.5);

  noise_pg = createGraphics(width, height, WEBGL);
  noise_pg.textureMode(NORMAL);
  noise_pg.colorMode(RGB, 1);
  noise_pg.angleMode(DEGREES);
  noise_pg.shader(noise_shader);
  noise_shader.setUniform('frequency', 1);
  noise_shader.setUniform('amplitude', 0.5);
  noise_shader.setUniform('speed', 0.5);

  pixelate_pg = createGraphics(width, height, WEBGL);
  pixelate_pg.textureMode(NORMAL);
  pixelate_pg.colorMode(RGB, 1);
  pixelate_pg.angleMode(DEGREES);
  pixelate_pg.shader(pixelate_shader);
  pixelate_shader.setUniform('xPixels', 64);
  pixelate_shader.setUniform('yPixels', 64);
  
  rays_pg = createGraphics(width, height, WEBGL);
  rays_pg.textureMode(NORMAL);
  rays_pg.colorMode(RGB, 1);
  rays_pg.angleMode(DEGREES);
  rays_pg.shader(rays_shader);
  rays_shader.setUniform('lightDirDOTviewDir', 0.7);

  caleido_chk = createCheckbox('Caleidoscopio');
  caleido_chk.position(10, 30);
  caleido_chk.changed(() => {
    if (caleido_chk.checked()){
            effects.push(1);
    } else {
      let idx = effects.indexOf(1);
      effects.splice(idx, 1);
    }
  });

  dof_chk = createCheckbox('Profundidad de Campo');
  dof_chk.position(10, 50);
  dof_chk.changed(() => {
    if (dof_chk.checked()){
      effects.push(2);
    } else {
      let idx = effects.indexOf(2);
      effects.splice(idx, 1);
    }
    console.log(effects);
  });

  edge_chk = createCheckbox('Detección de Bordes');
  edge_chk.position(10, 70);
  edge_chk.changed(() => {
    if (edge_chk.checked()){
      effects.push(3);
    } else {
      let idx = effects.indexOf(3);
      effects.splice(idx, 1);
    }
  });

  horizontal_chk = createCheckbox('Desenfoque Horizontal');
  horizontal_chk.position(10, 90);
  horizontal_chk.changed(() => {
    if (horizontal_chk.checked()){
      effects.push(4);
    } else {
      let idx = effects.indexOf(4);
      effects.splice(idx, 1);
    }
  });

  noise_chk = createCheckbox('Ruido');
  noise_chk.position(10, 110);
  noise_chk.changed(() => {
    if (noise_chk.checked()){
      effects.push(5);
    } else {
      let idx = effects.indexOf(5);
      effects.splice(idx, 1);
    }
  });

  pixelate_chk = createCheckbox('Pixelador');
  pixelate_chk.position(10, 130);
  pixelate_chk.changed(() => {
    if (pixelate_chk.checked()){
      effects.push(6);
    } else {
      let idx = effects.indexOf(6);
      effects.splice(idx, 1);
    }
  });

  rays_chk = createCheckbox('Rayos');
  rays_chk.position(10, 150);
  rays_chk.changed(() => {
    if (rays_chk.checked()){
      effects.push(7);
    } else {
      let idx = effects.indexOf(7);
      effects.splice(idx, 1);
    }
  });
}

function draw() {
  if (frameCount % 100 === 0) {
    models[0].position = createVector((random() * 2 - 1) * trange, (random() * 2 - 1) * trange, (random() * 2 - 1) * trange);
  }
  main_pg.background(0);
  
  render(main_pg);
  
  if (effects.length === 1){
    current_pg = main_pg;
  }
  
  for (let i = 1; i < effects.length; i++){
    let tx = buff(effects[i - 1]);
    let pg = buff(effects[i]);
    let sh = shdr(effects[i]) 
    sh.setUniform('tex', tx);
    
    if (effects[i] === 2){
      let position = main_pg.treeLocation(Tree.ORIGIN,  {from: Tree.EYE, to: Tree.WORLD});
      let center = p5.Vector.add(position, main_pg.treeDisplacement());
      let up = main_pg.treeDisplacement(Tree.j);
    
      depth_pg.background(0);
      depth_pg.camera(position.x, position.y, position.z,
        center.x, center.y, center.z,
        up.x, up.y, up.z
      );
    
      render(depth_pg);
    
      const focus = main_pg.treeLocation(models[0].position, { from: Tree.WORLD, to: Tree.SCREEN });
      
      sh.setUniform('depthMap', depth_pg);
      sh.setUniform('focus', focus.z);
    } else if (effects[i] === 5){
      sh.setUniform('time', millis() / 1000);
    } else if (effects[i] === 7){
      sh.setUniform('rtex', tx);
      sh.setUniform('lightPositionOnScreen', [1 - mouseX / main_pg.width, 1 - mouseY / main_pg.height]);
    }
    pg.quad(-1, 1, 1, 1, 1, -1, -1, -1);
    current_pg = pg;
  }
  image(current_pg, 0, 0);
  
  main_pg.reset();
  current_pg.reset();
  caleido_pg.reset();
  depth_pg.reset();
  dof_pg.reset();
  edge_pg.reset();
  horizontal_pg.reset();
  noise_pg.reset();
  pixelate_pg.reset();
  rays_pg.reset();
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

function buff(n){
  let pg;
  if (n === 0){
    pg = main_pg;
  } else if (n === 1){
    pg = caleido_pg;
  } else if (n === 2){
    pg = dof_pg;
  }else if (n === 3){
    pg = edge_pg;
  } else if (n === 4){
    pg = horizontal_pg;
  } else if (n === 5){
    pg = noise_pg;
  } else if (n === 6){
    pg = pixelate_pg;
  } else if (n === 7){
    pg = rays_pg;
  }
  return pg;
}

function shdr(n){
  let effect;
  if (n === 1){
    effect = caleido_shader;
  } else if (n === 2){
    effect = dof_shader;
  }else if (n === 3){
    effect = edge_shader;
  } else if (n === 4){
    effect = horizontal_shader;
  } else if (n === 5){
    effect = noise_shader;
  } else if (n === 6){
    effect = pixelate_shader;
  } else if (n === 7){
    effect = rays_shader;
  } else {
    effect = null;
  }
  return effect;
}