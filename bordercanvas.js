const canvas2 = document.getElementById("bordercanvas");
const ctx2 = canvas2.getContext("2d");
canvas2.width = window.innerWidth;
canvas2.height = window.innerHeight / 2;

ctx2.font = "100px arial";
ctx2.fillText("Hello World!", 50, 150);
