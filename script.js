const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.font = "20px Georgia";
ctx.fillText("Hello World!", 10, 50);

let miejsce_x = (canvas.width * 2) / 3;
let miejsce_y = canvas.height / 2;

let particlesArray;

// get mouse position
let mouse = {
  x: null,
  y: null,
  radius: (canvas.height / 80) * (canvas.width / 80)
};

window.addEventListener("mousemove", function(event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

//create particle
class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }
  //draw indicidua; particle
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = "#000000";
    ctx.fill();
  }
  //check particle and mouse position. Move particle and draw the particle
  update() {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }
    //check collision
    let wavesize = 20;
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * wavesize) {
        this.x += wavesize;
      }
      if (mouse.x > this.x && this.x > canvas.width - this.size * wavesize) {
        this.x -= wavesize;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.size * wavesize) {
        this.y += wavesize;
      }
      if (mouse.y > this.y && this.y > canvas.height - this.size * wavesize) {
        this.y -= wavesize;
      }
    }
    if (0 < this.x && this.x < miejsce_x && miejsce_y > this.y && this.y > 0) {
      this.x += wavesize;
      this.y += wavesize;
    }

    //move partciles
    this.x += this.directionX;
    this.y += this.directionY;
    //draw
    this.draw();
  }
}

// create particle array
function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.height * canvas.width * 1.5) / 10000;
  console.log(numberOfParticles);
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 5 + 1;
    let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
    console.log(x);
    let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
    console.log(y);
    let directionX = Math.random() * 5 - 2.5;
    let directionY = Math.random() * 5 - 2.5;
    let color = "#000000";

    particlesArray.push(
      new Particle(x, y, directionX, directionY, size, color)
    );
  }
}

// animation loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = 0; b < particlesArray.length; b++) {
      let distance =
        Math.pow(particlesArray[a].x - particlesArray[b].x, 2) +
        Math.pow(particlesArray[a].y - particlesArray[b].y, 2);
      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        opacityValue = 1 - distance / 20000;
        ctx.strokeStyle = "rgba(0,0,0," + opacityValue + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

// resize event
window.addEventListener("resize", function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  mouse.radius = (canvas.height / 80) * (canvas.width / 80);
});

//mouse out event
window.addEventListener("mouseout", function() {
  mouse.x = undefined;
  mouse.y = undefined;
});

init();

animate();
