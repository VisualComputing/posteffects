let easyCam; 
let main_pg, kaleido_pg;
let kaleido_shader;
let models;
let rx, ry;
let segments;
let img;
const trange = 100;

function preload(){
  img = loadImage('/posteffects/sketches/caleidoscopio/liminal01.jpeg');
  kaleido_shader = readShader('/posteffects/sketches/caleidoscopio/shaders/kaleido.frag', {
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
  
  kaleido_pg = createGraphics(width / 2, height, WEBGL);
  kaleido_pg.textureMode(NORMAL);
  kaleido_pg.colorMode(RGB, 1);
  kaleido_pg.angleMode(DEGREES);
  kaleido_pg.shader(kaleido_shader);
  
  segments = createSlider(1, 9, 1,  1);
  segments.position(10, 10);
  segments.style('width', '80px');
  segments.input(function() {
    kaleido_shader.setUniform('segments', this.value());
  });
  kaleido_shader.setUniform('segments', segments.value());
  
  
  rx = 45;
  ry = 45;
}

function draw() {
  main_pg.background(0);
  kaleido_pg.background(125);
  
  render(main_pg);
  kaleido_shader.setUniform('texture', main_pg);
  
  kaleido_pg.quad(-1, 1, 1, 1, 1, -1, -1, -1);
  
  image(main_pg, 0, 0);
  image(kaleido_pg, width / 2, 0);

  main_pg.reset();
  kaleido_pg.reset();
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
