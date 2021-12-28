import {binaryStrToInt, Hashtable} from '../utils';

export default (rawInput: string) => {
    enum TokenType {Literal, Sum, Product, Minimum, Maximum, GreaterThan, LessThan, EqualTo}
    type LiteralToken = [type: TokenType.Literal, version: number, value: number];
    type OperatorToken = [type: Exclude<TokenType, TokenType.Literal>, version: number, value: Token[]];
    type Token = LiteralToken | OperatorToken;
    const TokenTypeById = {
        '000': TokenType.Sum,
        '001': TokenType.Product,
        '010': TokenType.Minimum,
        '011': TokenType.Maximum,
        '100': TokenType.Literal,
        '101': TokenType.GreaterThan,
        '110': TokenType.LessThan,
        '111': TokenType.EqualTo,
    } as const;
    const Operations: {[T in Exclude<TokenType, TokenType.Literal>]: (values: number[]) => number} = {
        [TokenType.Sum]: values => values.reduce((sum, v) => sum + v, 0),
        [TokenType.Product]: values => values.reduce((prod, v) => prod * v, 1),
        [TokenType.Minimum]: values => Math.min(...values),
        [TokenType.Maximum]: values => Math.max(...values),
        [TokenType.GreaterThan]: values => values[0] > values[1] ? 1 : 0,
        [TokenType.LessThan]: values => values[0] < values[1] ? 1 : 0,
        [TokenType.EqualTo]: values => values[0] === values[1] ? 1 : 0,
    };

    // PART 1
    const HexToBin = {
        0: '0000',
        1: '0001',
        2: '0010',
        3: '0011',
        4: '0100',
        5: '0101',
        6: '0110',
        7: '0111',
        8: '1000',
        9: '1001',
        A: '1010',
        B: '1011',
        C: '1100',
        D: '1101',
        E: '1110',
        F: '1111',
    } as Hashtable<string>;

    const hexToPaddedBin = (hex: string): string => {
        const res = hex.split('').reduce((acc, v) => acc + HexToBin[v], '');
        return res.length % 4 === 0
            ? res
            : res.padStart((Math.floor(res.length / 4) + 1) * 4, '0');
    };

    const tokenize = (input: string): Token[] => {
        const parseLiteral = (version: number): LiteralToken => {
            const data = [];
            while (true) {
                const [prefix, ...suffix] = consume(5);
                data.push(...suffix);

                if (prefix === '0') break;
            }
            return [TokenType.Literal, version, binaryStrToInt(data.join(''))];
        };

        const readBits = (bits: number) => parsePackets(readBits => readBits === bits);
        const readPackets = (packets: number) => parsePackets((_, readPackets) => readPackets === packets);

        const parseOperator = (tokenType: OperatorToken[0], version: number): OperatorToken => [
            tokenType,
            version,
            consume(1) === '0'
                ? readBits(binaryStrToInt(consume(15)))
                : readPackets(binaryStrToInt(consume(11)))
        ];

        const consume = <T extends string>(width: number): T => input.substring(ptr, (ptr = ptr + width)) as T;

        let ptr = 0;
        const parsePackets = (done?: (bitsRead: number, packetsRead: number) => boolean): Token[] => {
            let startPtr = ptr;
            const packets: Token[] = [];
            while (!done?.(ptr - startPtr, packets.length) && ptr < input.length - 10) {
                const version = binaryStrToInt(consume<string>(3));
                const tokenType = TokenTypeById[consume<keyof typeof TokenTypeById>(3)];

                if (tokenType === TokenType.Literal) packets.push(parseLiteral(version));
                else packets.push(parseOperator(tokenType, version));
            }
            return packets;
        };

        return parsePackets();
    };

    const _versionSum = (token: Token): number => {
        if (token[0] === TokenType.Literal) return token[1];

        const [_, version, children] = token;
        return version + children.reduce((acc, c) => acc + _versionSum(c), 0);
    };
    const versionSum = (tokens: Token[]) => tokens.reduce((acc, t) => acc + _versionSum(t), 0);

    const parse = (token: Token): number =>
        token[0] === TokenType.Literal
            ? token[2]
            : Operations[token[0]](token[2].map(parse));

    const tokens = tokenize(hexToPaddedBin(rawInput));

    return [
        versionSum(tokens),
        parse(tokens[0]),
    ];
};
