mod solutions;
use std::{ops::Sub, time::Instant};

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
    if 0 == 1 {
        run_day!(day1, day2);
    }

    let start = Instant::now();
    run_day!(day1);
    let stop = Instant::now();

    println!("Ran in {:?}ms", stop.sub(start).as_secs_f64() * 1000.0);
}
