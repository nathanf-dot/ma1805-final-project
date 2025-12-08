let trees = [];
let clusters = 50; // how many groups of trees //
let isNight = false; // starts in day mode //
let audioContext;
let gust = 0;
let rippleActive = false;
let rippleX = 0;
let rippleY = 0;
let rippleRadius = 0;
let rippleMaxRadius = 300; // how big the ripple gets 
// let windsound

// function preload() {
//   windsound = loadSound("whoosh.mp3");
// }


function setup() {
  createCanvas(800, 600);
  noStroke();

  // Generates tree positions //
  for (let i = 0; i < 200; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(20, 60); // canopy size //

    let col = color(
      random(20, 60),
      random(100, 150),
      random(40, 80),
      200
    );

    trees.push({
      x: x,
      y: y,
      r: r,
      col: col,
      ox: x, // original x stored //
      oy: y  // original y stored //
    });
  }
}


function draw() {
  // day vs night background //
if (isNight) {
  background(20, 30, 60); // dark blue night //
} else {
  background(152, 251, 152); // pale green day //
}

// --- draw wind ripple //
if (rippleActive) {
  push();

  noFill();
  stroke(255, 255, 255, 180); // white ring
  strokeWeight(2);
  circle(rippleX, rippleY, rippleRadius * 2);

  // expand the ripple //
  rippleRadius += 6;

  // stop when it gets too big //
  if (rippleRadius > rippleMaxRadius) {
    rippleActive = false;
  }

  pop();
}

  for (let t of trees) {

    // wind behaviour // 
    let d = dist(mouseX, mouseY, t.x, t.y);

    if (d < 150) {
      let angle = atan2(t.y - mouseY, t.x - mouseX);
      t.x += cos(angle) * 1.5;
      t.y += sin(angle) * 1.5;
    }

     // base wind radius and strength //
    let baseRadius = 100;
    let baseStrength = 1.5;

    // gust makes the wind reach further and hit harder //
    let windRadius = baseRadius + gust; 
    let windStrength = baseStrength + gust * 0.05;

    if (d < windRadius) { // wind radius with gust //
      // Move the tree away from the mouse //
      let angle = atan2(t.y - mouseY, t.x - mouseX);
      t.x += cos(angle) * windStrength; // speed of movement //
      t.y += sin(angle) * windStrength;
    }

    // return to origin //
    let backSpeed = 0.03;
    t.x = lerp(t.x, t.ox, backSpeed);
    t.y = lerp(t.y, t.oy, backSpeed); 

    // Adjust tree color depending on day/night //
if (isNight) {
  fill(red(t.col)*0.6, green(t.col)*0.6, blue(t.col)*0.9, 220); 
} else {
  fill(t.col);
}
circle(t.x, t.y, t.r * 2);
  }
}

function keyPressed() {
  if (key === 'n' || key === 'N') {
    isNight = !isNight; // switch true/false //
  }
}

function mouseReleased() {

//  if (windsound) windsound.play();

// start ripple at mouse position //
rippleActive = true;
  rippleX = mouseX;
  rippleY = mouseY;
  rippleRadius = 0;

  let gustRadius = 250; // distance effect //
  let gustForce = 50;   // how strong the one-shot push is //

  for (let t of trees) {
    let d = dist(mouseX, mouseY, t.x, t.y);

    if (d < gustRadius) {
      let angle = atan2(t.y - mouseY, t.x - mouseX);
      t.x += cos(angle) * gustForce;
      t.y += sin(angle) * gustForce;
    }
  }
}

// function mousePressed() {
//   // initialize audio context if not already
//   if (!audioContext) {
//     audioContext = new (window.AudioContext || window.webkitAudioContext)();
//   }
//   // create buffer for brown noise (wind-like sound)
//   let bufferSize = audioContext.sampleRate * 1.5; // 1.5 seconds
//   let buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
//   let data = buffer.getChannelData(0);
//   let lastOut = 0.0;
//   for (let i = 0; i < bufferSize; i++) {
//     let white = Math.random() * 2 - 1;
//     data[i] = (lastOut + (0.02 * white)) / 1.02; // brown noise
//     lastOut = data[i];
//     data[i] *= 3.5; // adjust volume
//   }
//   let source = audioContext.createBufferSource();
//   source.buffer = buffer;
//   let gainNode = audioContext.createGain();
//   source.connect(gainNode);
//   gainNode.connect(audioContext.destination);
//   gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
//   gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
//   source.start();
// } THIS WAS CODE FOR A WIND SOUND THAT I ENDED UP NOT USING, I DRAFTED THIS WITH A CODING TUTOR BUT I FELT IT DIDNT REFLECT MY ACTUAL ABILITY AND DID MATCH THE EXACT AESTHETIC I WAS GOING FOR