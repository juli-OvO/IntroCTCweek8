// 🌬️ Breeze of Words — p5.js version
let letters = [];
let flowers = [];
let inputText = "";
let inputDone = false;
let breeze = false;
let font;
let breezeButton;

function setup() {
  createCanvas(800, 600);
  textFont('Courier New');
  breezeButton = new Button("💨 BLOW", width / 2 - 50, 20, 100, 40);
}

function draw() {
  background(240, 245, 250);

  if (!inputDone) {
    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);
    text("Write your poem below and press ENTER when done:", width / 2, height / 3 - 50);
    textSize(24);
    text(inputText, width / 2, height / 3);
  } else {
    breezeButton.display();

    // Update & draw letters
    for (let i = letters.length - 1; i >= 0; i--) {
      let l = letters[i];
      l.update();
      l.display();

      // When letter hits ground, spawn flower
      if (l.pos.y > height - 40 && !l.hasSpawnedFlower) {
        flowers.push(new Flower(l.pos.x, height - 40));
        l.hasSpawnedFlower = true;
      }
    }

    // Draw flowers
    for (let f of flowers) {
      f.display();
    }
  }
}

function keyPressed() {
  if (!inputDone) {
    if (keyCode === BACKSPACE) {
      inputText = inputText.substring(0, inputText.length - 1);
    } else if (keyCode === ENTER || keyCode === RETURN) {
      createLetters();
      inputDone = true;
    } else if (key.length === 1) {
      inputText += key;
    }
  }
}

function mousePressed() {
  if (breezeButton.isOver(mouseX, mouseY) && !breeze) {
    breeze = true;
    for (let l of letters) l.applyBreeze();
  }
}

function createLetters() {
  letters = [];
  let x = width / 2 - (inputText.length * 15) / 2;
  let y = height / 2;
  for (let i = 0; i < inputText.length; i++) {
    let c = inputText.charAt(i);
    let jitterX = random(-50, 50);
    let jitterY = random(-30, 30);
    let sz = random(18, 32);
    letters.push(new Letter(c, x + i * 15 + jitterX, y + jitterY, sz));
  }
}

// --- Letter class ---
class Letter {
  constructor(c, x, y, s) {
    this.c = c;
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.size = s;
    this.hasSpawnedFlower = false;
  }

  applyBreeze() {
    let angle = random(-PI / 4, -PI / 8);
    let strength = random(2, 5);
    this.acc.add(createVector(cos(angle) * strength, sin(angle) * strength));
  }

  update() {
    if (breeze) {
      this.acc.y += 0.1; // gravity
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }
  }

  display() {
    fill(20, 40, 60);
    textSize(this.size);
    textAlign(CENTER, CENTER);
    text(this.c, this.pos.x, this.pos.y);
  }
}

// --- Flower class ---
class Flower {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.stemHeight = random(30, 80);
    this.petalCount = int(random(4, 8));
    this.bloomSize = random(10, 20);
    this.petalColor = color(random(150, 255), random(80, 200), random(100, 255));
    this.leafColor = color(60, random(100, 150), 60);
  }

  display() {
    push();
    translate(this.x, this.y);

    // Stem
    stroke(this.leafColor);
    strokeWeight(2);
    line(0, 0, 0, -this.stemHeight);

    // Leaves
    noStroke();
    fill(this.leafColor);
    for (let i = 0; i < int(random(1, 3)); i++) {
      let lx = random(-10, 10);
      let ly = random(-this.stemHeight / 2, -this.stemHeight / 3);
      beginShape();
      vertex(0, ly);
      quadraticVertex(lx, ly - 5, lx * 2, ly);
      quadraticVertex(lx, ly + 5, 0, ly);
      endShape(CLOSE);
    }

    // Petals
    translate(0, -this.stemHeight);
    fill(this.petalColor);
    noStroke();
    for (let i = 0; i < this.petalCount; i++) {
      let angle = TWO_PI / this.petalCount * i;
      push();
      rotate(angle);
      beginShape();
      vertex(0, 0);
      quadraticVertex(this.bloomSize / 2, -this.bloomSize, 0, -this.bloomSize * 1.5);
      quadraticVertex(-this.bloomSize / 2, -this.bloomSize, 0, 0);
      endShape(CLOSE);
      pop();
    }

    // Center
    fill(255, 220, 80);
    ellipse(0, 0, 6, 6);
    pop();
  }
}

// --- Button class ---
class Button {
  constructor(label, x, y, w, h) {
    this.label = label;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  display() {
    fill(this.isOver(mouseX, mouseY) ? 200 : 230);
    stroke(0);
    rect(this.x, this.y, this.w, this.h, 8);
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(16);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }

  isOver(mx, my) {
    return mx > this.x && mx < this.x + this.w && my > this.y && my < this.y + this.h;
  }
}
