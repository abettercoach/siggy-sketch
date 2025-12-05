import p5 from "p5";
import { PLAYER_1, SYSTEM, on } from "@rcade/plugin-input-classic";
import { PLAYER_1 as SPINNER_1, PLAYER_2 as SPINNER_2 } from "@rcade/plugin-input-spinners";

// Rcade game dimensions
const WIDTH = 336;
const HEIGHT = 262;

const BG_COLOR = 219;
const PEN_COLOR = 60;

const sketch = (p: p5) => {
    let x: number;
    let y: number;
    const speed = 4;
    const ballSize = 2;

    let shaking = false;

    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT);
        x = WIDTH / 2;
        y = HEIGHT / 2;
        
        p.background(BG_COLOR);

        on("press", (data) => {
            shake();
        });
    };

    function shake() {
        shaking = true;
    }

    p.draw = () => {
        // Handle shaking
        if (shaking) {
            p.fill(BG_COLOR, BG_COLOR, BG_COLOR, 30);
            p.rect(0,0,WIDTH,HEIGHT);
        }
        shaking = false;

        // Handle input from arcade controls
        const stepsX = SPINNER_1.SPINNER.step_delta;
        x += stepsX;

        const stepsY = SPINNER_2.SPINNER.step_delta;
        y -= stepsY;

        // Keep ball in bounds
        x = p.constrain(x, ballSize / 2, WIDTH - ballSize / 2);
        y = p.constrain(y, ballSize / 2, HEIGHT - ballSize / 2);
        
        p.fill(PEN_COLOR);
        p.noStroke();
        p.ellipse(x, y, ballSize, ballSize);
    };
};

new p5(sketch, document.getElementById("sketch")!);
