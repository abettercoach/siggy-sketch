import p5 from "p5";
import { on } from "@rcade/plugin-input-classic";
import { PLAYER_1 as SPINNER_1, PLAYER_2 as SPINNER_2 } from "@rcade/plugin-input-spinners";

// Rcade game dimensions
const WIDTH = 336;
const HEIGHT = 262;
const BORDER_WIDTH = 35
const BORDER_RADIUS = 10

const SCREEN_COLOR = 219;
const FRAME_COLOR = [200, 1, 1];
const PEN_COLOR = 60;

// A red line
const STROKE_WEIGHT = 5;
const OFFSET = STROKE_WEIGHT / 2

const INNER_WIDTH = WIDTH - BORDER_WIDTH * 2
const INNER_HEIGHT = HEIGHT - BORDER_WIDTH * 2

//circle 
const KNOB_RADIUS = 30
const KNOB_MARGIN = 5


const sketch = (p: p5) => {
    let x: number;
    let y: number;
    const ballSize = 2;

    let shaking = false;

    function draw_knobs() {
        p.push();
        p.fill("white");
        p.stroke(SCREEN_COLOR);
        p.strokeWeight(2);
        p.circle(BORDER_WIDTH / 2 + KNOB_MARGIN, HEIGHT - BORDER_WIDTH / 2 - KNOB_MARGIN, KNOB_RADIUS);
        p.circle(WIDTH - BORDER_WIDTH / 2 - KNOB_MARGIN, HEIGHT - BORDER_WIDTH / 2 - KNOB_MARGIN, KNOB_RADIUS);
        p.pop();
    }
    function draw_frame() {
        p.push()
        p.noFill()
        p.stroke(FRAME_COLOR)
        p.strokeWeight(STROKE_WEIGHT)
        p.rect(BORDER_WIDTH - OFFSET, BORDER_WIDTH - OFFSET, INNER_WIDTH + OFFSET * 2, INNER_HEIGHT + OFFSET * 2, BORDER_RADIUS);
        p.pop()
    }
    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT);
        x = WIDTH / 2;
        y = HEIGHT / 2;


        p.background(FRAME_COLOR);
        p.fill(SCREEN_COLOR);
        // p.noStroke();

        p.rect(BORDER_WIDTH, BORDER_WIDTH, INNER_WIDTH, INNER_HEIGHT, BORDER_RADIUS);
        draw_frame();
        on("press", () => {
            shake();
        });

        draw_knobs();
    };

    function shake() {
        shaking = true;
    }


    p.draw = () => {
        // Handle shaking
        if (shaking) {
            p.fill(SCREEN_COLOR, SCREEN_COLOR, SCREEN_COLOR, 30);
            p.rect(BORDER_WIDTH, BORDER_WIDTH, INNER_WIDTH, INNER_HEIGHT, BORDER_RADIUS);
        }
        shaking = false;

        // Handle input from arcade controls
        const stepsX = SPINNER_1.SPINNER.step_delta;
        x += stepsX;

        const stepsY = SPINNER_2.SPINNER.step_delta;
        y -= stepsY;

        // Keep ball in bounds
        x = p.constrain(x, BORDER_WIDTH + ballSize / 2, INNER_WIDTH - ballSize / 2 + BORDER_WIDTH);
        y = p.constrain(y, BORDER_WIDTH + ballSize / 2, INNER_HEIGHT - ballSize / 2 + BORDER_WIDTH);

        p.fill(PEN_COLOR);
        p.noStroke();
        p.ellipse(x, y, ballSize, ballSize);
        draw_frame();

    };
};

new p5(sketch, document.getElementById("sketch")!);
