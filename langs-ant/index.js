import init, { Universe, Cell } from "./pkg/langs_ant.js";

const CELL_SIZE = 30;  // px
const GRID_COLOR = "#CCCCCC";
const WHITE_COLOR = "#FFFFFF";
const BLACK_COLOR = "#000000";
const ANT_COLOR = "#FF0000";  // Ant's color

init().then(wasm => {
    const universe = Universe.new();
    const width = universe.width();
    const height = universe.height();

    const canvas = document.getElementById("langtons-ant-canvas");
    const playPauseButton = document.getElementById("play-pause");
    const forwardButton = document.getElementById("forward");
    const backwardButton = document.getElementById("backward");

    let animationId = null;
    let isPlaying = false;

    canvas.width = (CELL_SIZE + 1) * width + 1;
    canvas.height = (CELL_SIZE + 1) * height + 1;

    const ctx = canvas.getContext("2d");

    const drawGrid = () => {
        ctx.beginPath();
        ctx.strokeStyle = GRID_COLOR;

        for (let i = 0; i <= width; i++) {
            ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
            ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
        }

        for (let j = 0; j <= height; j++) {
            ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
            ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
        }

        ctx.stroke();
    };

    const drawCells = () => {
        const cellsPtr = universe.cells();
        const cells = new Uint8Array(wasm.memory.buffer, cellsPtr, width * height);

        ctx.beginPath();

        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                const idx = row * width + col;

                ctx.fillStyle = cells[idx] === Cell.White
                    ? WHITE_COLOR
                    : BLACK_COLOR;

                ctx.fillRect(
                    col * (CELL_SIZE + 1) + 1,
                    row * (CELL_SIZE + 1) + 1,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }

        // Draw the ant
        const antRow = universe.ant_row();
        const antCol = universe.ant_col();
        ctx.fillStyle = ANT_COLOR;
        ctx.fillRect(
            antCol * (CELL_SIZE + 1) + 1,
            antRow * (CELL_SIZE + 1) + 1,
            CELL_SIZE,
            CELL_SIZE
        );

        ctx.stroke();
    };

    const renderLoop = () => {
        universe.tick();
        drawGrid();
        drawCells();

        animationId = requestAnimationFrame(renderLoop);
    };

    const play = () => {
        isPlaying = true;
        playPauseButton.textContent = "Pause";
        renderLoop();
    };

    const pause = () => {
        isPlaying = false;
        playPauseButton.textContent = "Play";
        cancelAnimationFrame(animationId);
        animationId = null;
    };

    const stepForward = () => {
        universe.tick();
        drawGrid();
        drawCells();
    };

    const stepBackward = () => {
        universe.step_backward();
        drawGrid();
        drawCells();
    };

    playPauseButton.addEventListener("click", () => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    });

    forwardButton.addEventListener("click", () => {
        pause();  // Pause when stepping manually
        stepForward();
    });

    backwardButton.addEventListener("click", () => {
        pause();  // Pause when stepping manually
        stepBackward();
    });

    drawGrid();
    drawCells();
});
