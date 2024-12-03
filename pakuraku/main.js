title = "Never Ending Pasta";
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

//Setting these like this means that by default they are hidden, but once they are seen, continuing to play, even after game over, continues to allow them to be seen, which I think is really neat.
let showTemp = false;
let showSeaLevel = false;
let showwellbeing = false;
let showEcosys = false;

let gameOverCause = "";

let clickedToday;
let daysSinceClick;

function update() {
  if (!ticks) {
    daysSinceClick = 0;
    clickedToday = false;
    day = 0;
    industry = 1;
    ecosystem = 100;
    earthResource = 100;
    temp = 40;
    seaLevel = 60;
    wellbeing = 100;
    floaters = [];
  }
  clickedToday = false;

  // Display information (Time, Resources, Score)
  color("black");
  rect(24, 10, 70, 2);
  color("light_red");
  text(`Time:`, 3, 10, LetterOptions); //drawn combo
  rect(24, 10, day, 2);
  color("yellow");
  text(`Industry: ${industry}`, 3, 16, LetterOptions);
  text(`Resources: ${earthResource}`, 3, 22, LetterOptions);
  //Only show these variables when they are in the danger zone(s)
    //Or after enough time
  showEcosys = showEcosys || ecosystem < 10 || ticks > 14400; //These vars should switch on once in teh danger zone (become true, once they're true they will stay true)
  if (showEcosys) text(`Ecosystem: ${ecosystem}`, 3, 28, LetterOptions);
  showSeaLevel = showSeaLevel || seaLevel < 20 || seaLevel > 80 || ticks > 7200;
  if (showSeaLevel) text(`Sea level: ${seaLevel}`, 3, 40, LetterOptions);
  showwellbeing = showwellbeing || wellbeing < 50 || ticks > 10800;
  if (showwellbeing) text(`Wellbeing: ${wellbeing}`, 3, 46, LetterOptions);
  showTemp = showTemp || temp > 70 || temp < 20 || ticks > 3600;
  if (showTemp) text(`Temperatures: ${temp}`, 3, 34, LetterOptions);

  remove(floaters, (fl) => {
    color(fl.color);
    text(fl.str, fl.pos);
    fl.pos.y -= fl.vy;
    fl.vy *= .9;
    fl.ticks--;
    return fl.ticks < 0;
  });

  //Draw the "button"
  color("light_black");
  rect(80,30, 40, 40);
  color("black");
  rect(81,31, 38, 38);
  color("light_black");
  text("Industry", 85, 50, LetterOptions)

    //On pressing button increase industry
  if(input.isJustPressed && input.pos.isInRect(80,30, 40, 40)){
    particle(input.pos.x, 30, 20, 1.1, -PI/2, PI/2)
    industry++;
    earthResource--;
    clickedToday = true;
    daysSinceClick = 0;
    play("laser");
  }

  //Have day progress
  day = (day + .5) % 70;
  if (day === 69.5){
    //Put calcs here.
      //Each day these values change based on each other.
      //The intended experience is to maximize industry and therefore maximize points, UNTIL a variable reveals itself showing its getting bad, at that point it is likely too late.
      //So the player has to balance these things.
      //The intended way to continue the system is to continue with endless growth, you break out/push back against the system by not clicking, not engaging.
    let TEMPeco = ecosystem+clamp(.04*ecosystem, 0, 1)+((.007*earthResource)+(-.045*industry)+(-.0225*temp)+(-.0225*seaLevel))/4;
    let TEMPearthResource = earthResource + ((-.014*industry)+(.03*ecosystem)+(-.02*temp))/3;
    let TEMPtemp = temp + ((.04*industry)+(-.009*ecosystem)+(-.01*seaLevel))/3;
    let TEMPseaLevel = seaLevel + ((.025*temp)+(-.005*ecosystem))/2;
    let TEMPwellbeing = wellbeing + ((.015*industry)+(.02*ecosystem)+(-.03*temp)+(-.03*seaLevel))/4
    ecosystem = clamp(Math.round(TEMPeco), -1, 150);
    earthResource = clamp(Math.round(TEMPearthResource), -1, 200);
    temp = Math.round(TEMPtemp);
    seaLevel = Math.round(TEMPseaLevel);
    wellbeing = Math.round(TEMPwellbeing);
    if (!clickedToday) {
      daysSinceClick++;
    }
    if (daysSinceClick > 5) {
      industry = clamp(industry - (Math.ceil((daysSinceClick - 5)/10)), 0, 9999);
    }
    addScore(industry);
  }
  //TODO: Maybe button that unlock after getting all variables, which costs alot of money/score but improves a specific variable, or the current most dangerous one?
  if (showEcosys && showSeaLevel && showwellbeing && showTemp) {
  color("light_black");
  rect(70,80, 60, 20);
  color("black");
  rect(71,81, 58, 18);
  color("light_black");
  text("Ecosystem\nConservation\nProgram", 80, 83, LetterOptions)

    //On pressing button increase industry
  if(input.isJustPressed && input.pos.isInRect(80,80, 40, 20)){
    particle(input.pos.x, 80, 20, 1.1, -PI/2, PI/2)
    industry -= 5;
    addScore(-300);
    ecosystem += 20;
    play("laser");
  }
}


  //Check game over conditions
    //TODO: Maybe give messages based on which gave a game over.
    if (earthResource <= 0) {
      gameOverCause = "Earth resources ran out!";
      end(gameOverCause);
    } else if (ecosystem <= 5) {
      gameOverCause = "Ecosystem health is too low!";
      end(gameOverCause);
    } else if (temp <= -10 || temp >= 130) {
      gameOverCause = "Temperature reached an extreme!";
      end(gameOverCause);
    } else if (seaLevel <= 5 || seaLevel > 120) {
      gameOverCause = "Sea level became too extreme!";
      end(gameOverCause);
    } else if (wellbeing <= 0) {
      gameOverCause = "Wellbeing has dropped to zero!";
      
      end(gameOverCause);
    }

}