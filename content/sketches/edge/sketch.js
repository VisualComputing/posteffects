let easyCam; 
let main_pg, edge_pg;
let edge_shader;
let aspect, aspectX, aspectY;
let rx, ry;

let img;

function preload(){
  img = loadImage('/posteffects/sketches/horizontal/liminal01.jpeg');
  edge_shader = readShader('/posteffects/sketches/edge/shaders/edge.frag', {
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
  //main_pg.stroke(0); 
  easycam = new Dw.EasyCam(main_pg._renderer);
  easycam.attachMouseListeners(this._renderer);
  
  edge_pg = createGraphics(width / 2, height, WEBGL);
  edge_pg.textureMode(NORMAL);
  edge_pg.colorMode(RGB, 1);
  edge_pg.angleMode(DEGREES);
  edge_pg.shader(edge_shader);
  
  aspectX = createSlider(0, 1, 1 / main_pg.width);
  aspectX.position(10, 10);
  aspectX.style('width', '80px');
  aspectX.input(function() {
    pixelate_shader.setUniform('aspect', [this.value, aspectY.value()]())
  });

  aspectY = createSlider(0, 1, 1 / main_pg.height);
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
    
  let position = main_pg.treeLocation(Tree.ORIGIN,  {from: Tree.EYE, to: Tree.WORLD});
  let center = p5.Vector.add(position, main_pg.treeDisplacement());
  let up = main_pg.treeDisplacement(Tree.j);
  
  edge_pg.quad(-150, 150, 150, 150, 150, -150, -150, -150);
  image(main_pg, 0, 0);
  image(edge_pg, width / 2, 0);

  main_pg.reset();
  edge_pg.reset();
}

function render(graphics){
  graphics.noStroke();
  ry = (ry + 0.5) % 360;
  rx = (rx + 0.5) % 360;
  //graphics.strokeWeight(10);
  graphics.push();
      graphics.fill(1, 1, 0, 1);
      graphics.rotateY(ry);
      graphics.box(100);
  graphics.pop();
  graphics.push()
      graphics.fill(0, 1, 1, 1);
      graphics.rotateX(rx);
      graphics.box(100);
  graphics.pop();
  graphics.push();
      graphics.fill(1, 0, 1, 1);
      graphics.rotateX(90);
      graphics.rotateY(ry);
      graphics.box(100);
  graphics.pop();
  graphics.push();
      graphics.fill(0.5, 1);
      graphics.rotateX(90);
      graphics.rotateY(-ry);
      graphics.box(100);
  graphics.pop();
 
}


function render2(graphics){
  //graphics.background(img);
  graphics.image(img, - graphics.width / 2, - graphics.height / 2, graphics.width, graphics.height);
  
}
