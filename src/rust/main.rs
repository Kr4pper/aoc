use std::{ops::Sub, time::Instant};

mod _2021;

macro_rules! run_day {
    ($($d:ident),*) => {
        $(_2021::$d::run())*
    };
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    println!("Got {:?} arguments: {:?}.", args.len() - 1, &args[1..]);

    if args.len() < 2 {
        panic!("Missing argument for day")
    }
    let day = &args[1].parse::<i32>().unwrap();
    println!("Day is {}", day);

    let start = Instant::now();
    match day {
        1 => run_day!(day1),
        2 => run_day!(day2),
        3 => run_day!(day3),
        _ => panic!("Day not implemented"),
    };
    let stop = Instant::now();

    println!("Ran in {:?}ms", stop.sub(start).as_secs_f64() * 1000.0);
}
