let easyCam; 
let main_pg, edge_pg;
let edge_shader;
let aspect;
let rx, ry;

function preload(){
  edge_shader = readShader('/posteffects/sketches/edge/shaders/edge.frag', {
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
  
  edge_pg = createGraphics(width / 2, height, WEBGL);
  edge_pg.textureMode(NORMAL);
  edge_pg.colorMode(RGB, 1);
  edge_pg.angleMode(DEGREES);
  edge_pg.shader(edge_shader);
  
  aspect = createVector(main_pg.width / main_pg.height, 1.0);
  edge_shader.setUniform('aspect', aspect);

  rx = 45;
  ry = 45;
}

function draw() {
  main_pg.background(0);
  main_pg.normalMaterial();
  
  edge_shader.setUniform('tex', main_pg);
  
  render(main_pg);

  let position = main_pg.treeLocation(Tree.ORIGIN,  {from: Tree.EYE, to: Tree.WORLD});
  let center = p5.Vector.add(position, main_pg.treeDisplacement());
  let up = main_pg.treeDisplacement(Tree.j);

  edge_pg.background(0);
  
  edge_pg.camera(position.x, position.y, position.z,
    center.x, center.y, center.z,
    up.x, up.y, up.z);
    
  render(edge_pg);

  image(main_pg, 0, 0);
  image(edge_pg, width / 2, 0);

  main_pg.reset();
  edge_pg.reset();
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
      graphics.fill(0, 0, 1);
      graphics.sphere(90);
  graphics.pop();
}

