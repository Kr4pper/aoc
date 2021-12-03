use std::{env, fs};

mod day1;

fn main() {
    let args: Vec<String> = env::args().collect();
    println!("ARGS = {:?}", args);
    
    let mut day = "01";
    let mut sample_requested = false;

    match args.len() {
        1 => {
            eprintln!("Called without args")
        },
        2 => {
            day = &args[1];
        },
        3 => {
            sample_requested = &args[2].eq("sample") | &args[2].eq("s");
        },
        _ => {
            eprintln!("Too many args: {:?}", args);
        }
    }

    println!("The day is {}", day);
    if sample_requested { println!("Using sample input"); }
    let sample_suffix = if sample_requested { format!(".sample") } else { format!("") };
    let filename = format!("src/input/{}{}", day, sample_suffix);
    println!("Trying to load file {}", filename);
    let contents = fs::read_to_string(filename)
        .expect("Something went wrong reading the file");

    println!("Input has {} lines", contents.lines().count());

    day1::part1(contents);
}
