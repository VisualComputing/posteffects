let inp;
let btn;
let f;

function setup(){
  createCanvas(300,200);
  inp = createInput('');
  btn = createButton('Calcular');
  inp.position(80, 25);
  inp.size(50);
  btn.position(50, 60);
  btn.size(50);
btn.mouseClicked(calculate);
  f = '';
}

function fibonacci(n){
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let prev = 0;
  let curr = 1;
  let nxt;

  for (let i = 2; i <= n; i++){
    nxt = curr + prev;
    prev = curr;
    curr = nxt;
  }
  return curr;
}

function calculate(){
  let n = parseInt(inp.value());
  f = fibonacci(n) + '';
}

function draw(){
  //noLoop();
  background(0);
  textSize(45);
  stroke(255);
  fill(255);
  text('n = ', 0, 40);
  textSize(20);
  text(f, 10, 120);

}