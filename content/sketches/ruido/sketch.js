let easyCam; 
let main_pg, noise_pg;
let noise_shader;
let models;
let rx, ry;
let frequency, amplitude;
let img;
const trange = 100;

function preload(){
  img = loadImage('/posteffects/sketches/ruido/liminal01.jpeg');
  noise_shader = readShader('/posteffects/sketches/ruido/shaders/noise.frag', {
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
  
  //easycam = new Dw.EasyCam(main_pg._renderer);
  //easycam.attachMouseListeners(this._renderer);
  
  noise_pg = createGraphics(width / 2, height, WEBGL);
  noise_pg.textureMode(NORMAL);
  noise_pg.colorMode(RGB, 1);
  noise_pg.angleMode(DEGREES);
  noise_pg.shader(noise_shader);
  
  frequency = createSlider(0, 10, 4,  0);
  frequency.position(10, 10);
  frequency.style('width', '80px');
  frequency.input(function() {
    noise_shader.setUniform('frequency', this.value() );
  });

  amplitude = createSlider(0, 1, 0.1, 0.1);
  amplitude.position(10, 40);
  amplitude.style('width', '80px');
  amplitude.input(function() {
    noise_shader.setUniform('amplitude', this.value());
  });
 

  speed = createSlider(0, 1, 0.1, 0.1);
  speed.position(10, 70);
  speed.style('width', '80px');
  speed.input(function() {
    noise_shader.setUniform('speed', this.value());
  });

  noise_shader.setUniform('frequency', 0.005);
  noise_shader.setUniform('amplitude', 0.5);
  noise_shader.setUniform('speed', 0.5);

  rx = 45;
  ry = 45;
}

function draw() {
  main_pg.background(0);
  main_pg.normalMaterial();
  render2(main_pg);
  noise_shader.setUniform('tex', main_pg);
  noise_shader.setUniform('time', millis() / 1000);
  noise_pg.background(0);
  /*
  noise_pg.camera(position.x, position.y, position.z,
    center.x, center.y, center.z,
    up.x, up.y, up.z);
  
  */
  //render(noise_pg);
  
  

  noise_pg.quad(-1, 1, 1, 1, 1, -1, -1, -1);
  image(main_pg, 0, 0);
  image(noise_pg, width / 2, 0);

  main_pg.reset();
  noise_pg.reset();
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
