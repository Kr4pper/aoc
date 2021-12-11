const INPUT: &str = include_str!("..\\..\\input\\02");

pub fn run() {
    let list_of_ints: Vec<i32> = INPUT.lines().map(|f| f.parse::<i32>().unwrap()).collect();

    println!("Part 1: {}", list_of_ints.windows(2).filter(|v| v[0] < v[1]).count());
    println!("Part 2: {}", list_of_ints.windows(4).filter(|v| v[0] < v[3]).count());
}
