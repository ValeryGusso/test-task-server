 const alphabet = [
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
]

export function randomName(length: number): string {
	const result: string[] = []
	for (let i = 0; i < length; i++) {
		const letter = alphabet[Math.floor(Math.random() * alphabet.length)]
		result.push(Math.random() > 0.5 ? letter.toUpperCase() : letter)
	}
	return result.join('')
}