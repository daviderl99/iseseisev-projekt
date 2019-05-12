/*jshint esversion: 6*/

//https://en.wikipedia.org/wiki/Maze_generation_algorithm#Randomized_Depth-First_Search

let sketch = (m) => {
  let cellSize = parseInt(getLocalStorage("difficulty"));
  let cols, rows, current;
  let cells = [];
  let stack = [];

  let showHighlight = true;
  let player, finish;


 m.setup = function() {
   let canvas = m.createCanvas(750, 750);
   canvas.parent('sketch-div');
   cols = m.floor(m.width/cellSize);
   rows = m.floor(m.height/cellSize);

   for (let j = 0; j < rows; j++){
     for (let i = 0; i < cols; i++){
       let cell = new m.Cell(i, j);
       cells.push(cell);
     }
   }
   current = cells[0];
   player = cells[0];
   finish = cells[(cols * rows) - 1];
 };

 m.draw = function() {
   m.background(50);
   for (let i = 0; i < cells.length; i++){
     cells[i].show();
   }

   current.visited = true;
   current.highlight();
   let next = current.checkNeighbours();
   if (next) {
     next.visited = true;
     stack.push(current);
     m.removeWalls(current, next);

     current = next;
   }
   else if (stack.length > 0){
     current = stack.pop();
   }
   else if (stack.length == 0){
    showHighlight = false;
    controls = true;
    player.visible("player");
    finish.visible("finish");
   }

   if (controls){
     if (!started){
       getCurrentTime();
     }
     if (!finished){
       if (m.keyIsDown(m.UP_ARROW) && !player.walls[0]) {
         player = cells[m.index(player.i, player.j-1)];
       }
       else if (m.keyIsDown(m.RIGHT_ARROW) && !player.walls[1]) {
         player = cells[m.index(player.i+1, player.j)];
         started = true;
       }
       else if (m.keyIsDown(m.DOWN_ARROW) && !player.walls[2]) {
         player = cells[m.index(player.i, player.j+1)];
         started = true;
       }
       else if (m.keyIsDown(m.LEFT_ARROW) && !player.walls[3]) {
         player = cells[m.index(player.i-1, player.j)];
       }
       if (player === finish) {
         finished = true;
         document.querySelector("#popup-container").style.display = "flex";
         document.querySelector("#time").innerHTML += getTime();
         document.querySelector("#close").onclick = function(){
           document.querySelector("#popup-container").style.display = "none";
         };
       }
     }
    m.frameRate(12);
   }

 };
  m.Cell = function(i, j){
   this.i = i;
   this.j = j;
   this.walls = [true, true, true, true];
   this.visited = false;

   this.checkNeighbours = function(){
     let neighbours = [];

     let top = cells[m.index(i, j -1)];
     let right = cells[m.index(i+1, j)];
     let bottom = cells[m.index(i, j+1)];
     let left = cells[m.index(i-1, j)];

     addNeighbours(top);
     addNeighbours(right);
     addNeighbours(bottom);
     addNeighbours(left);

     function addNeighbours(position){
       if (position && !position.visited) {
         neighbours.push(position);
       }
     }

     if (neighbours.length > 0){
       let rnd = m.floor(m.random(0, neighbours.length));
       return neighbours[rnd];
     }
     else{
       return undefined;
     }
   };

  m.index = function(i, j){
   if (i < 0 || j < 0 || i > cols-1 || j > rows-1) {
     return -1;
   }
   return i + j * cols;
 };

   this.highlight = function(){
     if (showHighlight){
       let x = this.i*cellSize;
       let y = this.j*cellSize;
       m.noStroke();
       m.fill('#0077DD');
       m.rect(x, y, cellSize, cellSize);
     }
   };

  this.visible = function(type){
    let x = this.i*cellSize;
    let y = this.j*cellSize;

    m.stroke(0);
    m.strokeWeight(0.7);
    if (type == "player"){
      m.fill(20, 240, 30);
      m.ellipse(x+(cellSize / 2), y+(cellSize / 2), cellSize/2, cellSize/2);
    }
    else if (type == "finish"){
      m.fill(240, 20, 30);
      m.rect(x+(cellSize / 5.5), y+(cellSize / 5.5), cellSize/1.5, cellSize/1.5);
    }
  };

   this.show = function(){
     m.strokeWeight(1);
     let x = this.i*cellSize;
     let y = this.j*cellSize;
     m.stroke(parseInt(getLocalStorage("lineColor")));
     if (this.walls[0]) {
       m.line(x, y, x+cellSize, y); //Top
     }
     if (this.walls[1]) {
       m.line(x+cellSize, y, x+cellSize, y+cellSize); //Right
     }
     if (this.walls[2]) {
       m.line(x+cellSize, y+cellSize, x, y+cellSize); //Bottom
     }
     if (this.walls[3]) {
       m.line(x, y+cellSize, x, y); //Left
     }
     if (this.visited){
       m.noStroke();
       m.fill(getLocalStorage("colorScheme"));
       m.rect(x, y, cellSize, cellSize);
     }
   };
 };

  m.removeWalls = function(a, b){
   let x = a.i - b.i;
   let y = a.j - b.j;

   if (x == 1){
     a.walls[3] = false;
     b.walls[1] = false;
   }
   else if (x == -1){
     a.walls[1] = false;
     b.walls[3] = false;
   }

   if (y == 1){
     a.walls[0] = false;
     b.walls[2] = false;
   }
   else if (y == -1){
     a.walls[2] = false;
     b.walls[0] = false;
   }
  };
};
