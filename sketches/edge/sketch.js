let easyCam; 
let main_pg, edge_pg;
let edge_shader;
let aspect, aspectX, aspectY;
let models;
let rx, ry;
let x, y;
let img;
let trange = 100;

function preload(){
  img = loadImage('/posteffects/sketches/edge/Buho final.jpg');
  edge_shader = readShader('/posteffects/sketches/edge/shaders/edge.frag', {
    varyings: Tree.texcoords2, 
    matrices: Tree.pmvMatrix
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
  main_pg.stroke(0); 
  easycam = new Dw.EasyCam(main_pg._renderer);
  easycam.attachMouseListeners(this._renderer);
  
  edge_pg = createGraphics(width / 2, height, WEBGL);
  edge_pg.textureMode(NORMAL);
  edge_pg.colorMode(RGB, 1);
  edge_pg.angleMode(DEGREES);
  edge_pg.shader(edge_shader);
  
  x = edge_pg.width / 2;
  y = edge_pg.height / 2;

  aspectX = createSlider(0, 1, 1 / main_pg.width, 0);
  aspectX.position(10, 10);
  aspectX.style('width', '80px');
  aspectX.input(function() {
    pixelate_shader.setUniform('aspect', [this.value, aspectY.value()]())
  });

  aspectY = createSlider(0, 1, 1 / main_pg.height, 0);
  aspectY.position(10, 40);
  aspectY.style('width', '80px');
  aspectY.input(function() {
    edge_shader.setUniform('aspect', [aspectX.value(), this.value()]);
  });

  aspect = [1 / main_pg.width, 1 / main_pg.height];
  edge_shader.setUniform('aspect', aspect);

  rx = 45;
  ry = 45;
}

function draw() {
  main_pg.background(0);
  edge_pg.background(0);
  
  render(main_pg);
  edge_shader.setUniform('tex', main_pg);
  
  edge_pg.quad(-x, -y, x, - y, x, y, -x, y);
  image(main_pg, 0, 0);
  image(edge_pg, width / 2, 0);

  main_pg.reset();
  edge_pg.reset();
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
