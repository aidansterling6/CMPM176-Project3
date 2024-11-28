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
let score;
let clicks;
let autoResourceGeneration;


const CLICK_REWARD = 1; // How many resources you get per click
const INDUSTRY_UPGRADE_COST = 10;
const AUTO_GENERATION_COST = 20;


function update() {
  if (!ticks) {
    // Initialize game variables
    day = 0;
    industry = 1;
    ecosystem = 1;
    earthResource = 1;
    temp = 1;
    seaLevel = 1;
    wellbeing = 1;
    clicks = 0;
    score = 0;
    floaters = [];
    autoResourceGeneration = 0;
  }

  // Resource Generation (Industry / Time)
  earthResource += industry * 0.1; // Increment resource by industry each tick

  // Handle Clicking Mechanism (Using isJustPressed)
  if (input.isJustPressed) {
    clicks++;
  }

  // Display information (Time, Resources, Score)
  color("black");
  rect(24, 10, 70, 2);
  color("light_red");
  text(`Time:`, 3, 10, LetterOptions); //drawn combo
  rect(24, 10, day, 2);
  color("yellow");
  text(`Resources: ${Math.floor(earthResource)}`, 3, 16, LetterOptions); 
  text(`Clicks: ${clicks}`, 3, 22, LetterOptions); 
  text(`Score: ${Math.floor(score)}`, 3, 28, LetterOptions); 

  // Upgrade Display
  color("green");
  text(`Upgrade Industry (Cost: ${INDUSTRY_UPGRADE_COST})`, 3, 40, LetterOptions);
  text(`Auto Generation (Cost: ${AUTO_GENERATION_COST})`, 3, 46, LetterOptions);

  
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

