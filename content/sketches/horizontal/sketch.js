let easyCam; 
let main_pg, horizontal_pg;
let horizontal_shader;

let rx, ry;
let hLevel, rLevel;

function preload(){
  horizontal_shader = readShader('/posteffects/sketches/horizontal/shaders/horizontal.frag', {
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
  
  horizontal_pg = createGraphics(width / 2, height, WEBGL);
  horizontal_pg.textureMode(NORMAL);
  horizontal_pg.colorMode(RGB, 1);
  horizontal_pg.angleMode(DEGREES);
  horizontal_pg.shader(horizontal_shader);
  
  hLevel = createSlider(0, 255, 6);
  hLevel.position(10, 10);
  hLevel.style('width', '80px');
  hLevel.input(() => {
    horizontal_shader.setUniform('h', this.value())
  });

  rLevel = createSlider(0, 100, 0);
  rLevel.position(10, 40);
  rLevel.style('width', '80px');
  rLevel.input(() => {
    horizontal_shader.setUniform('r', this.value() * 0.01)
  });

  rx = 45;
  ry = 45;
}

function draw() {
  main_pg.background(0);
  main_pg.normalMaterial();
  
  horizontal_shader.setUniform('tDiffuse', main_pg);
  
  render(main_pg);

  

  let position = main_pg.treeLocation(Tree.ORIGIN,  {from: Tree.EYE, to: Tree.WORLD});
  let center = p5.Vector.add(position, main_pg.treeDisplacement());
  let up = main_pg.treeDisplacement(Tree.j);

  horizontal_pg.background(0);
  
  horizontal_pg.camera(position.x, position.y, position.z,
    center.x, center.y, center.z,
    up.x, up.y, up.z);
  
  
  render(horizontal_pg);

  image(main_pg, 0, 0);
  image(horizontal_pg, width / 2, 0);

  main_pg.reset();
  horizontal_pg.reset();
}

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
  graphics.push();
      graphics.fill(0, 0, 0);
      graphics.sphere(90);
  graphics.pop();
}