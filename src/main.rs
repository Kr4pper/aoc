use std::{ops::Sub, time::Instant};

mod solutions;

macro_rules! run_day {
    ($($d:ident),*) => {
        $(
            let start = Instant::now();
            solutions::rust::$d::run();
            let stop = Instant::now();
            println!("Day ran in: {}ms\n", stop.sub(start).as_secs_f64() * 1000.0);
        )*
    };
}

fn main() {
    // prevent dead code errors
    if 0 == 1 {
        run_day!(day1, day2);
    }

    let args: Vec<String> = std::env::args().collect();
    println!("Got {:?} arguments: {:?}.", args.len() - 1, &args[1..]);

    if args.len() < 2 {
         panic!("Missing argument for day")
    }
    let day = &args[1].parse::<i32>().unwrap();
    println!("Day is {}", day);

    let start = Instant::now();
    run_day!(day1);
    let stop = Instant::now();

    println!("Ran in {:?}ms", stop.sub(start).as_secs_f64() * 1000.0);
}
