let starsArray = [];
let noiseScale = 0.005; // Scale for Perlin noise (smaller values give more detail)
let threshold = 0.3; // Threshold for drawing pixels based on noise value

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
  let numStars = Math.round(width * height * 0.0025); // Adjust star density if needed

  generateNoise();

  // Generate stars with integer x, y coordinates and random base colors
  for (let i = 0; i < numStars; i++) {
    let v = {
      x: Math.floor(random(width)), // Ensure integer value
      y: Math.floor(random(height)), // Ensure integer value
      progress: random(1, 100), // Progress for brightness
      baseColor: [random(200, 255), random(200, 255), random(170, 255)], // Random base color
    };
    starsArray.push(v);
  }

  frameRate(30);
}

function draw() {
  stars(); // Draw stars
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateGalaxies(); // Regenerate galaxies if window is resized
}
function generateNoise() {
  loadPixels(); // Prepare to manipulate the pixel array

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Generate initial Perlin noise for brightness
      let noiseValue = noise(x * noiseScale, y * noiseScale);

      // Only draw pixels where the initial noise value is above the threshold
      if (noiseValue > threshold) {
        // The brightness is derived from the initial noise
        let brightness = map(noiseValue, threshold, 1, 0, 25); // Overall brightness

        // Generate separate Perlin noise values for color variation (R, G, B)
        let noiseRed = noise((x + 1000) * noiseScale, (y + 1000) * noiseScale); // Offset for red channel
        let noiseGreen = noise(
          (x + 2000) * noiseScale,
          (y + 2000) * noiseScale
        ); // Offset for green channel
        let noiseBlue = noise((x + 3000) * noiseScale, (y + 3000) * noiseScale); // Offset for blue channel

        // Scale the color channels based on the overall brightness
        let r = brightness * map(noiseRed, 0, 1, 0, 1); // Slight red variation
        let g = brightness * map(noiseGreen, 0, 1, 0, 1); // More green variation
        let b = brightness * map(noiseBlue, 0, 1, 0, 1); // Blue variation

        // Calculate the pixel index in the pixel array
        let pixelIndex = (x + y * width) * 4;

        // Set the pixel values with brightness-scaled colors
        pixels[pixelIndex] = r; // Red
        pixels[pixelIndex + 1] = g; // Green
        pixels[pixelIndex + 2] = b; // Blue
        pixels[pixelIndex + 3] = 255; // Full opacity
      }
    }
  }

  updatePixels(); // Apply the pixel updates
}
function stars() {
  loadPixels(); // Load pixel data from the canvas

  for (let i = 0; i < starsArray.length; i++) {
    let v = starsArray[i];
    let x = v.x;
    let y = v.y;

    // Ensure the coordinates are within canvas bounds
    if (x >= 0 && x < width && y >= 0 && y < height) {
      let pixelIndex = (x + y * width) * 4; // Calculate the pixel index

      let brightness = getBrightness(v.progress); // Get brightness based on progress

      // Apply brightness to the base color (give each pixel a slight color variation)
      pixels[pixelIndex] = v.baseColor[0] * (brightness / 255); // Red channel
      pixels[pixelIndex + 1] = v.baseColor[1] * (brightness / 255); // Green channel
      pixels[pixelIndex + 2] = v.baseColor[2] * (brightness / 255); // Blue channel
      pixels[pixelIndex + 3] = 255; // Alpha channel (fully opaque)

      // Update progress for the next frame
      v.progress = (v.progress + 1) % 100; // Loop progress from 1 to 100
    }
  }

  updatePixels(); // Apply the changes to the canvas
}

function getBrightness(progress) {
  let brightness;

  if (progress <= 20) {
    // Fading in: whiteness goes from 0 to 255 as progress increases from 1 to 20
    brightness = map(progress, 1, 20, 0, 255);
  } else if (progress <= 60) {
    // Fluctuating: brightness varies around a mid value (e.g., 200)
    brightness = map(sin(progress), -1, 1, 180, 230); // Sine function to vary around 200
  } else if (progress <= 100) {
    // Fading out: whiteness goes from 255 to 0 as progress increases from 60 to 100
    brightness = map(progress, 60, 100, 255, 0);
  }

  return brightness;
}
