// mod utils;

// use wasm_bindgen::prelude::*;

// #[wasm_bindgen]
// extern "C" {
//     fn alert(s: &str);
// }

// #[wasm_bindgen]
// pub fn greet() {
//     alert("Hello, langstons-ant!");
// }

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
#[derive(PartialEq, Copy, Clone)]
#[repr(u8)]
pub enum Cell {
    White = 0,
    Black = 1,
}

#[wasm_bindgen]
#[derive(PartialEq, Copy, Clone)]
pub enum Direction {
    Up,
    Down,
    Left,
    Right,
}

#[wasm_bindgen]
pub struct Ant {
    row: u32,
    col: u32,
    direction: Direction,
}

#[wasm_bindgen]
impl Ant {
    pub fn new(row: u32, col: u32) -> Ant {
        Ant {
            row,
            col,
            direction: Direction::Up,
        }
    }

    pub fn turn_clockwise(&mut self) {
        self.direction = match self.direction {
            Direction::Up => Direction::Right,
            Direction::Right => Direction::Down,
            Direction::Down => Direction::Left,
            Direction::Left => Direction::Up,
        };
    }

    pub fn turn_counter_clockwise(&mut self) {
        self.direction = match self.direction {
            Direction::Up => Direction::Left,
            Direction::Left => Direction::Down,
            Direction::Down => Direction::Right,
            Direction::Right => Direction::Up,
        };
    }

    pub fn move_forward(&mut self, width: u32, height: u32) {
        match self.direction {
            Direction::Up => {
                if self.row > 0 {
                    self.row -= 1;
                }
            }
            Direction::Down => {
                if self.row < height - 1 {
                    self.row += 1;
                }
            }
            Direction::Left => {
                if self.col > 0 {
                    self.col -= 1;
                }
            }
            Direction::Right => {
                if self.col < width - 1 {
                    self.col += 1;
                }
            }
        }
    }
}

#[wasm_bindgen]
pub struct Universe {
    width: u32,
    height: u32,
    cells: Vec<Cell>,
    ant: Ant,
}

#[wasm_bindgen]
impl Universe {
    fn get_index(&self, row: u32, col: u32) -> usize {
        (row * self.width + col) as usize
    }

    pub fn tick(&mut self) {
        let idx = self.get_index(self.ant.row, self.ant.col);

        // Flip the color of the current cell
        self.cells[idx] = match self.cells[idx] {
            Cell::White => Cell::Black,
            Cell::Black => Cell::White,
        };

        // Turn the ant based on the current cell color
        match self.cells[idx] {
            Cell::White => self.ant.turn_clockwise(),
            Cell::Black => self.ant.turn_counter_clockwise(),
        }

        // Move the ant forward
        self.ant.move_forward(self.width, self.height);
    }

    pub fn new() -> Universe {
        let width = 17;
        let height = 17;
        let cells = vec![Cell::White; (width * height) as usize];
        let ant = Ant::new(height / 2, width / 2);

        Universe {
            width,
            height,
            cells,
            ant,
        }
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn cells(&self) -> *const Cell {
        self.cells.as_ptr()
    }

    pub fn ant_row(&self) -> u32 {
        self.ant.row
    }

    pub fn ant_col(&self) -> u32 {
        self.ant.col
    }
}
