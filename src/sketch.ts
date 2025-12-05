import p5 from "p5";
import { on } from "@rcade/plugin-input-classic";
import { PLAYER_1 as SPINNER_1, PLAYER_2 as SPINNER_2 } from "@rcade/plugin-input-spinners";

// Rcade game dimensions
const WIDTH = 336;
const HEIGHT = 262;
const BORDER_WIDTH = 35
const BORDER_RADIUS = 10

const BALL_SIZE = 2;


const SCREEN_COLOR = 219;
const FRAME_COLOR = [200, 1, 1];
const PEN_COLOR = 60;
const NOTCH_COLOR = 130;
const KNOB_N_NOTCHES = 20;

// A red line
const STROKE_WEIGHT = 5;
const OFFSET = STROKE_WEIGHT / 2;

const INNER_WIDTH = WIDTH - BORDER_WIDTH * 2;
const INNER_HEIGHT = HEIGHT - BORDER_WIDTH * 2;

const MIN_X = BORDER_WIDTH + BALL_SIZE;
const MAX_X = INNER_WIDTH - BALL_SIZE / 2 + BORDER_WIDTH;
const MIN_Y = BORDER_WIDTH + BALL_SIZE;
//@ts-ignore
const MAX_Y = INNER_HEIGHT - BALL_SIZE / 2 + BORDER_WIDTH; 


//circle 
const KNOB_DIAMETER = 30
const KNOB_MARGIN = 5
const KNOB_CENTER_LEFT = {
    x: BORDER_WIDTH / 2 + KNOB_MARGIN,
    y: HEIGHT - BORDER_WIDTH / 2 - KNOB_MARGIN
};
const KNOB_CENTER_RIGHT = {
    x: WIDTH - BORDER_WIDTH / 2 - KNOB_MARGIN,
    y: HEIGHT - BORDER_WIDTH / 2 - KNOB_MARGIN
};

const sketch = (p: p5) => {
    let x: number;
    let y: number;

    let shaking = false;

    function draw_knobs() {
        p.push();
        p.fill("white");
        p.stroke(SCREEN_COLOR);
        p.strokeWeight(2);
        p.circle(KNOB_CENTER_LEFT.x, KNOB_CENTER_LEFT.y, KNOB_DIAMETER);
        p.circle(KNOB_CENTER_RIGHT.x, KNOB_CENTER_RIGHT.y, KNOB_DIAMETER);
        p.pop();

        let normalized_x = (x - MIN_X) / (INNER_WIDTH - BALL_SIZE * 2);
        let notch_angle_x = normalized_x * 2 * Math.PI;

        let normalized_y = (y - MIN_Y) / (INNER_HEIGHT - BALL_SIZE * 2);
        let notch_angle_y = (1 - normalized_y) * 2 * Math.PI;

        draw_notches(KNOB_CENTER_LEFT, notch_angle_x);
        draw_notches(KNOB_CENTER_RIGHT, notch_angle_y);

    }

    function draw_notches(knob_center: { x: number, y: number }, notch_angle: number) {

        p.push();
        p.translate(knob_center.x, knob_center.y);
        p.rotate(notch_angle);
        p.stroke(NOTCH_COLOR);
        p.strokeWeight(2)

        // other notches

        // for (let angle = 0; angle < 2 * Math.PI; angle += KNOB_N_NOTCHES / 2 * Math.PI) {
        for (let i = 0; i < KNOB_N_NOTCHES; i++) {
            p.push();
            let angle = i / KNOB_N_NOTCHES * 2 * Math.PI;
            p.rotate(angle);
            p.strokeWeight(1);
            p.stroke(SCREEN_COLOR);
            p.line(0, KNOB_DIAMETER / 3, 0, KNOB_DIAMETER / 2 - 2);
            p.pop();
        }

        // indicator notch
        p.line(0, KNOB_DIAMETER / 4, 0, KNOB_DIAMETER / 2 - 2);

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
        x = p.constrain(x, MIN_X, MAX_X);
        y = p.constrain(y, BORDER_WIDTH + BALL_SIZE / 2, INNER_HEIGHT - BALL_SIZE / 2 + BORDER_WIDTH);

        p.fill(PEN_COLOR);
        p.noStroke();
        p.ellipse(x, y, BALL_SIZE, BALL_SIZE);
        draw_frame();
        draw_knobs();
    };
};

new p5(sketch, document.getElementById("sketch")!);
