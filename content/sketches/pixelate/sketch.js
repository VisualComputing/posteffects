let easyCam; 
let main_pg, pixel_pg;
let pixelate_shader;

let rx, ry;
let pXLevel, pYLevel;

function preload(){
  pixelate_shader = readShader('/posteffects/sketches/pixelate/shaders/pixelate.frag', {
    varyings: Tree.texcoords2, 
    matrices: Tree.pmvMatrix
  });
}

function setup() {
  createCanvas(600, 300);
  angleMode(DEGREES);
  colorMode(RGB, 1);
  
  main_pg = createGraphics(width / 2, height, WEBGL);
  main_pg.angleMode(DEGREES);
  main_pg.colorMode(RGB, 1);
 // main_pg.noSmooth();
  easycam = new Dw.EasyCam(main_pg._renderer);
  easycam.attachMouseListeners(this._renderer);
  
  pixel_pg = createGraphics(width / 2, height, WEBGL);
  pixel_pg.textureMode(NORMAL);
  pixel_pg.colorMode(RGB, 1);
  pixel_pg.angleMode(DEGREES);
  pixel_pg.shader(pixelate_shader);
  
  pXLevel = createSlider(1, 255, 25);
  pXLevel.position(10, 10);
  pXLevel.style('width', '80px');
  pXLevel.input(function() {
    pixelate_shader.setUniform('xPixels', this.value())
  });

  pYLevel = createSlider(1, 255, 25);
  pYLevel.position(10, 40);
  pYLevel.style('width', '80px');
  pYLevel.input(function() {
    pixelate_shader.setUniform('yPixels', this.value());
  });
  pixelate_shader.setUniform('xPixels', pXLevel.value());
  pixelate_shader.setUniform('yPixels', pYLevel.value());
  rx = 45;
  ry = 45;
}

function draw() {
  main_pg.background(0);
  main_pg.normalMaterial();
  
  pixelate_shader.setUniform('tex', main_pg);
  
  render(main_pg);
  
  pixel_pg.background(0);

  pixel_pg.image(main_pg, - main_pg.width / 2, - main_pg.height / 2);

  image(main_pg, 0, 0);
  image(pixel_pg, width / 2, 0);

  main_pg.reset();
  pixel_pg.reset();
}


function render(graphics){
  graphics.noStroke();
  ry = (ry + 1) % 360;
  rx = (rx + 1) % 360;
   
  graphics.push();
      graphics.fill(1, 1, 0, 0.5);
      graphics.rotateY(ry);
      graphics.torus(100, 20);
  graphics.pop();
  graphics.push()
      graphics.fill(0, 1, 1, 0.5);
      graphics.rotateX(rx);
      graphics.torus(100, 20);
  graphics.pop();
  graphics.push();
      graphics.fill(1, 0, 1, 0.5);
      graphics.rotateX(90);
      graphics.rotateY(ry);
      graphics.torus(100, 20);
  graphics.pop();
  graphics.push();
      graphics.fill(0.5, 0.5);
      graphics.rotateX(90);
      graphics.rotateY(-ry);
      graphics.torus(100, 20);
  graphics.pop();
  graphics.push();
      graphics.fill(0, 0, 1);
      graphics.sphere(50);
  graphics.pop();
  
}
