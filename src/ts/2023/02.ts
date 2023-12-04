export default (rawInput: string): [(number | string)?, (number | string)?] => {
    const input = rawInput.split('\n');

    const parseDraws = (game: string): [red: number, green: number, blue: number] => {
        let redMax = 0;
        let greenMax = 0;
        let blueMax = 0;
        const [_, stripped] = game.split(': ');

        stripped.split('; ').map(draw => {
            for (const balls of draw.split(', ')) {
                const [count, type] = balls.split(' ');
                if (type === 'red') redMax = Math.max(redMax, +count);
                if (type === 'green') greenMax = Math.max(greenMax, +count);
                if (type === 'blue') blueMax = Math.max(blueMax, +count);
            }
        });
        return [redMax, greenMax, blueMax];
    };
    const games = input.map(parseDraws);

    const RED_ALLOWED = 12;
    const GREEN_ALLOWED = 13;
    const BLUE_ALLOWED = 14;

    return [
        games.reduce((sum, [red, green, blue], idx) =>
            red <= RED_ALLOWED && green <= GREEN_ALLOWED && blue <= BLUE_ALLOWED
                ? sum + (idx + 1) // game id starts at 1
                : sum,
            0),
        games.reduce((sum, [red, green, blue]) => sum + red * green * blue, 0),
    ];
};
