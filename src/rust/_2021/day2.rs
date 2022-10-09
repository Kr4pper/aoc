const INPUT: &str = include_str!("..\\..\\input\\2021\\02");

struct Instruction<'a> {
    direction: &'a str,
    value: i32,
}

struct Position {
    x: i32,
    y: i32,
    aim: i32,
}

fn to_instruction(line: &str) -> Instruction {
    let (direction, value) = line.split_once(' ').unwrap();

    Instruction {
        direction,
        value: value.parse().unwrap(),
    }
}

fn update_position(pos: Position, Instruction { direction, value }: Instruction) -> Position {
    match direction {
        "forward" => Position {
            x: pos.x + value,
            y: pos.y + pos.aim * value,
            ..pos
        },
        "down" => Position {
            aim: pos.aim + value,
            ..pos
        },
        "up" => Position {
            aim: pos.aim - value,
            ..pos
        },
        val => panic!("bad direction input: {}", val),
    }
}

pub fn run() {
    let pos = INPUT
        .lines()
        .map(to_instruction)
        .fold(Position { x: 0, y: 0, aim: 0 }, update_position);

    println!("Part 1: {}", pos.x * pos.aim);
    println!("Part 2: {}", pos.x * pos.y);
}
