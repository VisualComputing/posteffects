let easyCam; 
let main_pg, pixel_pg;
let pixelate_shader;

let rx, ry;
let pXLevel, pYLevel;

function preload(){
  pixelate_shader = readShader('/posteffects/sketches/pixelate/shaders/pixelate.frag', {
    varyings: Tree.texcoords2
  });
}

function setup() {
  createCanvas(600, 300);
  angleMode(DEGREES);
  colorMode(RGB, 1);
  
  main_pg = createGraphics(width / 2, height, WEBGL);
  main_pg.angleMode(DEGREES);
  main_pg.colorMode(RGB, 1);
  main_pg.noSmooth();
  easycam = new Dw.EasyCam(main_pg._renderer);
  easycam.attachMouseListeners(this._renderer);
  
  pixel_pg = createGraphics(width / 2, height, WEBGL);
  pixel_pg.textureMode(NORMAL);
  pixel_pg.colorMode(RGB, 1);
  pixel_pg.angleMode(DEGREES);
  pixel_pg.shader(pixelate_shader);
  
  pXLevel = createSlider(6, 255, 6);
  pXLevel.position(10, 10);
  pXLevel.style('width', '80px');
  pXLevel.input(() => {
    pixelate_shader.setUniform('xPixels', this.value())
  });

  pYLevel = createSlider(6, 255, 6);
  pYLevel.position(10, 40);
  pYLevel.style('width', '80px');
  pYLevel.input(() => {
    pixelate_shader.setUniform('yPixels', this.value())
  });

  rx = 45;
  ry = 45;
}

function draw() {
  main_pg.background(0);
  main_pg.normalMaterial();
  
  pixelate_shader.setUniform('tex', main_pg);
  
  render(main_pg);

  

  let position = main_pg.treeLocation(Tree.ORIGIN,  {from: Tree.EYE, to: Tree.WORLD});
  let center = p5.Vector.add(position, main_pg.treeDisplacement());
  let up = main_pg.treeDisplacement(Tree.j);

  pixel_pg.background(0);
  
  pixel_pg.camera(position.x, position.y, position.z,
    center.x, center.y, center.z,
    up.x, up.y, up.z);
  
  
  render(pixel_pg);

  image(main_pg, 0, 0);
  image(pixel_pg, width / 2, 0);

  main_pg.reset();
  pixel_pg.reset();
}

/*
function render(graphics){
  ry = (ry + 0.1) % 360;
  rx = (rx + 0.1) % 360;
   
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
      graphics.fill(1, 0.5);
      graphics.rotateX(90);
      graphics.rotateY(-ry);
      graphics.torus(100, 20);
  graphics.pop();
  /*
  graphics.push();
      graphics.fill(0, 0, 0);
      graphics.sphere(90);
  graphics.pop();
  
}*/

function render(graphics){
  graphics.fill(0,0,1);
  graphics.push();
    graphics.translate(0, 0, 200)
    graphics.sphere(100);
  graphics.pop();
}