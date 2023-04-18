const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

let map = [
  [1, 3, 6],
  [0, 2, 5],
  [1, 3, 4, 5, 6],
  [0, 2, 4, 6],
  [1, 2, 5, 6],
  [0, 2, 4, 6],
  [1, 3, 4, 5],
  [5]
];

let color_begin = "#ff0000";
let color_end = "#ffff00";

function changeIntoColors(r, g, b) {
  let color_r = Math.round(r).toString(16);
  let color_g = Math.round(g).toString(16);
  let color_b = Math.round(b).toString(16);
  if (color_r.length == 1) {
    color_r = "0" + color_r;
  }
  if (color_g.length == 1) {
    color_g = "0" + color_g;
  }
  if (color_b.length == 1) {
    color_b = "0" + color_b;
  }
  return "#" + color_r + color_g + color_b;
}

function createColorSpectre(color_begin, color_end, amount) {
  pallete = [];
  pallete.push(color_begin);
  begin_0 = parseInt(color_begin.charAt(1) + color_begin.charAt(2), 16);
  begin_1 = parseInt(color_begin.charAt(3) + color_begin.charAt(4), 16);
  begin_2 = parseInt(color_begin.charAt(5) + color_begin.charAt(6), 16);
  end_0 = parseInt(color_end.charAt(1) + color_end.charAt(2), 16);
  end_1 = parseInt(color_end.charAt(3) + color_end.charAt(4), 16);
  end_2 = parseInt(color_end.charAt(5) + color_end.charAt(6), 16);

  dr = (end_0 - begin_0) / (amount - 1);
  dg = (end_1 - begin_1) / (amount - 1);
  db = (end_2 - begin_2) / (amount - 1);

  for (let i = 1; i < amount; i++) {
    let new_r = begin_0 + dr * i;
    let new_g = begin_1 + dg * i;
    let new_b = begin_2 + db * i;
    let color_i = changeIntoColors(new_r, new_g, new_b);
    pallete.push(color_i);
  }
  console.log(pallete);
  return pallete;
}

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

// function nodeSize(node, web) {
//   console.log(web[node]);
//   var numberOfConnections = web[node].length;
//   console.log(numberOfConnections);
//   for (var i = 0; i < web.length; i++) {
//     if (i == node) continue;
//     console.log("i: ", i);
//     for (var j = 0; j < web[i].length; j++) {
//       if (j == node) {
//         numberOfConnections++;
//       }
//     }
//   }
//   return numberOfConnections;
// }

function nodeSize(node, web) {
  var numberOfConnections = web[node].length;
  for (var i = 0; i < web.length; i++) {
    if (i == node || web[node].includes(i)) continue;
    for (var j = 0; j < web[i].length; j++) {
      if (j == node) numberOfConnections++;
    }
  }
  return numberOfConnections;
}

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
  draw(color) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
  }
  //check particle and mouse position. Move particle and draw the particle
  update(color) {
    if (this.x > canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }
    //check collision
    let wavesize = 3;
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
    //move partciles
    this.x += this.directionX;
    this.y += this.directionY;
    //draw
    this.draw(color);
  }
}

// create particle array
function init(numberOfParticles) {
  particlesArray = [];
  console.log(numberOfParticles);
  pallete = createColorSpectre(color_begin, color_end, numberOfParticles);
  for (let i = 0; i < numberOfParticles; i++) {
    let size = nodeSize(i, map);
    console.log("size: ", size);
    let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;

    let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;

    let directionX = Math.random() * 5 - 2.5;
    let directionY = Math.random() * 5 - 2.5;
    let color = pallete[i];

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
    particlesArray[i].update(pallete[i]);
  }
  connect();
}

function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let c = 0; c < map[a].length; c++) {
      let b = map[a][c];
      let distance =
        Math.pow(particlesArray[a].x - particlesArray[b].x, 2) +
        Math.pow(particlesArray[a].y - particlesArray[b].y, 2);
      opacityValue = 1 - distance / 20000;
      if (opacityValue < 0.2) {
        opacityValue = 0.2;
      }
      ctx.strokeStyle = "rgba(0,0,0," + opacityValue + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
      ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
      ctx.stroke();
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

init(map.length);

animate();
