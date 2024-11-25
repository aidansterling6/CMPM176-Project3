
title = "Spaghetti";

description = "[Click]";

characters = [];

options = {
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 6,
  viewSize: {
    x: 200,
    y: 100
  }
};

LetterOptions = {
  isSmallText: true
}
/** @type {{ str: string; pos: Vector; vy: number; ticks: number, color: string }[]} */
let floaters;

let day;
let industry;
let ecosystem;
let earthResource;
let temp;
let seaLevel;
let wellbeing;

function update() {
  if (!ticks) {
    day = 0;
    industry = 1;
    ecosystem = 1;
    earthResource = 1;
    temp = 1;
    seaLevel = 1;
    wellbeing = 1;
    floaters = [];
  }

  score = industry;

  color("black");
  rect(24, 10, 70, 2);
  color("light_red");
  text(`Time:`, 3, 10, LetterOptions); //drawn combo
  rect(24, 10, day, 2);
  color("yellow");
  text(`Resources: ${earthResource}`, 3, 16, LetterOptions);

  remove(floaters, (fl) => {
    color(fl.color);
    text(fl.str, fl.pos);
    fl.pos.y -= fl.vy;
    fl.vy *= .9;
    fl.ticks--;
    return fl.ticks < 0;
  });


  day = (day + .5) % 70;
}