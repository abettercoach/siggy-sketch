import p5 from "p5";
import { PLAYER_1, PLAYER_2, on } from "@rcade/plugin-input-classic";
import { PLAYER_1 as SPINNER_1, PLAYER_2 as SPINNER_2 } from "@rcade/plugin-input-spinners";
import EASTRIAL from "../assets/EASTRIAL.otf";

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
const STROKE_WEIGHT = BORDER_WIDTH;
const OFFSET = STROKE_WEIGHT / 2;

const INNER_WIDTH = WIDTH - BORDER_WIDTH * 2;
const INNER_HEIGHT = HEIGHT - BORDER_WIDTH * 2;

const MIN_X = BORDER_WIDTH + BALL_SIZE;
const MAX_X = INNER_WIDTH - BALL_SIZE / 2 + BORDER_WIDTH;
const MIN_Y = BORDER_WIDTH + BALL_SIZE;
//@ts-ignore
const MAX_Y = INNER_HEIGHT - BALL_SIZE / 2 + BORDER_WIDTH; 


// Circle 
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
    let game_started = false;

    // Screen Buffer
    let screen_canvas: p5.Graphics;

    // Font
    let font: p5.Font;

    // Tilting
    let shaking = false;
    let tilt_state = {
        x: 0,
        y: 0,
    };

    function draw_knobs() {
        p.push();
        p.translate(0,0,25);
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
        p.translate(0,0,25);
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
        p.translate(0,0,5);
        p.noFill()
        p.stroke(FRAME_COLOR)
        
        p.strokeWeight(STROKE_WEIGHT)
        p.rect(BORDER_WIDTH - OFFSET, BORDER_WIDTH - OFFSET, INNER_WIDTH + OFFSET * 2, INNER_HEIGHT + OFFSET * 2, BORDER_RADIUS);

        p.strokeWeight(5)
        p.rect(BORDER_WIDTH - 2, BORDER_WIDTH - 2, INNER_WIDTH + 2 * 2, INNER_HEIGHT + 2 * 2, BORDER_RADIUS);
        p.pop()

        // Back of frame
        p.push();
        p.fill(FRAME_COLOR);
        p.noStroke();
        p.translate(0,0,-5);
        p.rect(BORDER_WIDTH - 5, BORDER_WIDTH - 5, INNER_WIDTH + 10, INNER_HEIGHT + 10, BORDER_RADIUS / 2);
        p.pop();
    }

    function draw_screen() {
        const c = screen_canvas;
        c.push()
        c.fill(SCREEN_COLOR);
        c.translate(0,0,1);
        c.stroke(SCREEN_COLOR);
        c.strokeWeight(1);
        c.rect(0, 0, WIDTH, HEIGHT, BORDER_RADIUS / 2);
        c.pop();
    }

    p.preload = () => {
        font = p.loadFont(EASTRIAL);
    }

    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT, p.WEBGL);
        x = WIDTH / 2;
        y = HEIGHT / 2;

        screen_canvas = p.createGraphics(WIDTH, HEIGHT, p.WEBGL);
        screen_canvas.translate(-WIDTH/2,-HEIGHT/2, 5);
        screen_canvas.textFont(font);

        // p.push();
        // p.rotateY(Math.PI / 10);
        // p.translate(-WIDTH/2,-HEIGHT/2);
        
        // p.fill(SCREEN_COLOR);
        // p.rect(BORDER_WIDTH, BORDER_WIDTH, INNER_WIDTH, INNER_HEIGHT, BORDER_RADIUS);

        // draw_frame();
        // draw_knobs();
        // p.pop()


        on("press", (event) => {
            if (event.button === "LEFT") {
                tilt_state.y -= Math.PI * 0.1;
            }

            if (event.button === "RIGHT") {
                tilt_state.y += Math.PI * 0.1;
            }

            if (event.button === "UP") {
                tilt_state.x += Math.PI * 0.1;
            }

            if (event.button === "DOWN") {
                tilt_state.x -= Math.PI * 0.1;
            }

            shake();
        });

    };

    function shake() {
        shaking = true;
    }


    p.draw = () => {

        // Reset Tilt
        // if (!PLAYER_1.DPAD.down && !PLAYER_1.DPAD.up && !PLAYER_1.DPAD.left && !PLAYER_1.DPAD.right &&
        //     !PLAYER_2.DPAD.down && !PLAYER_2.DPAD.up && !PLAYER_2.DPAD.left && !PLAYER_2.DPAD.right ) {
        //         tilt_state = { x: 0, y: 0 };
        // }

        if (!PLAYER_1.DPAD.up && !PLAYER_2.DPAD.up && !PLAYER_1.DPAD.down && !PLAYER_2.DPAD.down) {
                tilt_state.x = 0;
        }

        if (!PLAYER_1.DPAD.left && !PLAYER_2.DPAD.left && !PLAYER_1.DPAD.right && !PLAYER_2.DPAD.right) {
                tilt_state.y = 0;
        }

        p.clear();
        p.push();
        p.rotateY(tilt_state.y);
        p.rotateX(tilt_state.x);
        p.translate(-WIDTH/2,-HEIGHT/2);

        // Handle shaking
        if (shaking) {
            const c = screen_canvas;
            c.push()
            c.fill(SCREEN_COLOR, SCREEN_COLOR, SCREEN_COLOR, 30);
            c.translate(0,0,5);
            c.stroke(SCREEN_COLOR);
            c.strokeWeight(1);
            c.rect(0, 0, WIDTH, HEIGHT, BORDER_RADIUS / 2);
            c.pop();
        }
        shaking = false;

        //Draw Screen
        draw_screen()

        //Calculate pen position
        const last_x = x;
        const last_y = y;

        // Handle input from arcade controls
        const stepsX = SPINNER_1.SPINNER.step_delta;
        x = last_x + stepsX * 0.7;

        const stepsY = SPINNER_2.SPINNER.step_delta;
        y = last_y - stepsY * 0.7;

        // Keep pen in bounds
        x = p.constrain(x, MIN_X, MAX_X);
        y = p.constrain(y, BORDER_WIDTH + BALL_SIZE / 2, INNER_HEIGHT - BALL_SIZE / 2 + BORDER_WIDTH);

        // Draw pen
        const c = screen_canvas;
        c.push();
        c.translate(0,0,5);
        if (stepsX !== 0 || stepsY !== 0) {
            c.fill(PEN_COLOR);
            c.stroke(SCREEN_COLOR);
            c.strokeWeight(2);
            c.ellipse(x, y, BALL_SIZE, BALL_SIZE);
        }

        c.fill(PEN_COLOR);
        c.stroke(PEN_COLOR);
        c.strokeWeight(1);
        c.ellipse(last_x, last_y, BALL_SIZE, BALL_SIZE);
        c.pop();

        // Start Instructions
        c.push();
        c.translate(0,0,5);
        c.noStroke();
        if (!game_started) {
            c.textAlign(p.CENTER);
            c.textSize(30);
            c.fill(PEN_COLOR);
            c.text("SHAKE JOYSTICKS", WIDTH / 2, HEIGHT / 2 - 15);
            c.text("TO CLEAR SCREEN", WIDTH / 2, HEIGHT / 2 + 15);
            game_started = true;
        }
        c.pop();

        p.image(c, BORDER_WIDTH, BORDER_WIDTH, INNER_WIDTH, INNER_HEIGHT);

        draw_frame();
        draw_knobs();

        p.pop();

    };
};

new p5(sketch, document.getElementById("sketch")!);
