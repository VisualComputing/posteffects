let easyCam; 
let main_pg, rays_pg, pg;
let rays_shader;
let models;
let rx, ry;
let lightPositionOnScreenX, lightPositionOnScreenY, lightDirDOTviewDir;
let img;
const trange = 100;

function preload(){
  img = loadImage('/posteffects/sketches/rayos/liminal01.jpeg');
  rays_shader = readShader('/posteffects/sketches/rayos/shaders/rays.frag', {
    varyings: Tree.texcoords2
  });
}
function setup() {
  createCanvas(600, 300);
  angleMode(DEGREES);
  colorMode(RGB, 1);
  
  models = [];
  for (let i = 0; i < 50; i++) {
    models.push(
      {
        position: createVector((random() * 2 - 1) * trange, (random() * 2 - 1) * trange, (random() * 2 - 1) * trange),
        size: random() * 25 + 8,
        color: i === 0 ? color(0, 1, 0) : color(random(), random(), random()),
        type: i < 25 ? 'ball' : 'box'
      }
    );
  }

  main_pg = createGraphics(width / 2, height, WEBGL);
  main_pg.angleMode(DEGREES);
  main_pg.colorMode(RGB, 1);
  
  easycam = new Dw.EasyCam(main_pg._renderer);
  easycam.attachMouseListeners(this._renderer);
  
  rays_pg = createGraphics(width / 2, height, WEBGL);
  rays_pg.textureMode(NORMAL);
  rays_pg.colorMode(RGB, 1);
  rays_pg.angleMode(DEGREES);
  rays_pg.shader(rays_shader);
    
  lightPositionOnScreenX = createSlider(0, 1, 0.5,  0);
  lightPositionOnScreenX.position(10, 10);
  lightPositionOnScreenX.style('width', '80px');
  lightPositionOnScreenX.input(function() {
    rays_shader.setUniform('lightPositionOnScreen', [this.value(), lightPositionOnScreenY.value()]() );
  });

  lightPositionOnScreenY = createSlider(0, 1, 0.5,  0);
  lightPositionOnScreenY.position(10, 40);
  lightPositionOnScreenY.style('width', '80px');
  lightPositionOnScreenY.input(function() {
    rays_shader.setUniform('lightPositionOnScreen', [lightPositionOnScreenY.value(), this.value()]() );
  });

  lightDirDOTviewDir = createSlider(0, 1, 0.7, 0.1);
  lightDirDOTviewDir.position(10, 70);
  lightDirDOTviewDir.style('width', '80px');
  lightDirDOTviewDir.input(function() {
    rays_shader.setUniform('lightDirDOTviewDir', this.value());
  });
    
  rays_shader.setUniform('lightPositionOnScreen', [lightPositionOnScreenX.value(), lightPositionOnScreenY.value()]);
  rays_shader.setUniform('lightDirDOTviewDir', lightDirDOTviewDir.value());

  //rays_shader.setUniform('lightPositionOnScreen', [0.5, 0.5]);
  //rays_shader.setUniform('lightDirDOTviewDir', 0.7);

  rx = 45;
  ry = 45;
  pg = main_pg;
}

function draw() {
  main_pg.background(0);
  main_pg.normalMaterial();
  render(main_pg);
  rays_shader.setUniform('otex', main_pg);
  rays_shader.setUniform('rtex', main_pg);
  
  rays_pg.background(0);
  /*
  rays_pg.camera(position.x, position.y, position.z,
    center.x, center.y, center.z,
    up.x, up.y, up.z);
  
  */
  //render(rays_pg);
  
  rays_pg.quad(-1, 1, 1, 1, 1, -1, -1, -1);
  image(main_pg, 0, 0);
  image(rays_pg, width / 2, 0);
  pg = rays_pg;
  main_pg.reset();
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

function render2(graphics){
  //graphics.background(img);
  graphics.image(img, - graphics.width / 2, - graphics.height / 2, graphics.width, graphics.height);
  
}
