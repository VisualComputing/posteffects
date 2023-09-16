let easyCam; 
let main_pg, horizontal_pg;
let horizontal_shader;
let models;
let rx, ry;
let hLevel, rLevel;
let img;
const trange = 100;

function preload(){
  img = loadImage('/posteffects/sketches/horizontal/liminal01.jpeg');
  horizontal_shader = readShader('/posteffects/sketches/horizontal/shaders/horizontal.frag', {
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
  
  horizontal_pg = createGraphics(width / 2, height, WEBGL);
  horizontal_pg.textureMode(NORMAL);
  horizontal_pg.colorMode(RGB, 1);
  horizontal_pg.angleMode(DEGREES);
  horizontal_pg.shader(horizontal_shader);
  
  hLevel = createSlider(0, 0.1, 0.005,  0);
  hLevel.position(10, 10);
  hLevel.style('width', '80px');
  hLevel.input(function() {
    horizontal_shader.setUniform('h', this.value() );
  });

  rLevel = createSlider(0, 1, 0.5, 0.1);
  rLevel.position(10, 40);
  rLevel.style('width', '80px');
  rLevel.input(function() {
    horizontal_shader.setUniform('r', this.value());
  });
  horizontal_shader.setUniform('h', 0.005);
  horizontal_shader.setUniform('r', 0.5);

  rx = 45;
  ry = 45;
}

function draw() {
  main_pg.background(0);
  main_pg.normalMaterial();
  render(main_pg);
  horizontal_shader.setUniform('tDiffuse', main_pg);
  
  horizontal_pg.background(0);
  /*
  horizontal_pg.camera(position.x, position.y, position.z,
    center.x, center.y, center.z,
    up.x, up.y, up.z);
  
  */
  //render(horizontal_pg);
  
  

  horizontal_pg.quad(-1, 1, 1, 1, 1, -1, -1, -1);
  image(main_pg, 0, 0);
  image(horizontal_pg, width / 2, 0);

  main_pg.reset();
  horizontal_pg.reset();
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
