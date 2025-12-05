import p5 from "p5";
import { PLAYER_1, SYSTEM } from "@rcade/plugin-input-classic";
import { PLAYER_1 as SPINNER_1, PLAYER_2 as SPINNER_2 } from "@rcade/plugin-input-spinners";

// Rcade game dimensions
const WIDTH = 336;
const HEIGHT = 262;

const sketch = (p: p5) => {
    let x: number;
    let y: number;
    const speed = 4;
    const ballSize = 2;
    let gameStarted = false;

    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT);
        x = WIDTH / 2;
        y = HEIGHT / 2;
        
        p.background(26, 26, 46);
    };

    p.draw = () => {
        // p.background(26, 26, 46);

        if (!gameStarted) {
            // Show start screen
            p.fill(255);
            p.textSize(18);
            p.textAlign(p.CENTER, p.CENTER);
            p.text("Press 1P START", WIDTH / 2, HEIGHT / 2);
            p.textSize(12);
            p.text("Use D-PAD to move", WIDTH / 2, HEIGHT / 2 + 30);

            if (SYSTEM.ONE_PLAYER) {
                gameStarted = true;
                p.background(26, 26, 46);
            }

            return;
        }

        // Handle input from arcade controls
        const stepsX = SPINNER_1.SPINNER.step_delta;
        x += stepsX;

        const stepsY = SPINNER_2.SPINNER.step_delta;
        y -= stepsY;

        // Keep ball in bounds
        x = p.constrain(x, ballSize / 2, WIDTH - ballSize / 2);
        y = p.constrain(y, ballSize / 2, HEIGHT - ballSize / 2);

        // Draw ball (change color when A is pressed)
        if (PLAYER_1.A) {
            p.fill(255, 100, 100);
        } else if (PLAYER_1.B) {
            p.fill(100, 255, 100);
        } else {
            p.fill(100, 200, 255);
        }
        p.noStroke();
        p.ellipse(x, y, ballSize, ballSize);
    };
};

new p5(sketch, document.getElementById("sketch")!);
