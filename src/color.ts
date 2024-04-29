import { Result, ok, err } from 'neverthrow';

const Colors = {
	w: "white",
	r: "red",
	b: "blue",
	g: "green",
	o: "orange",
	y: "yellow",
	_: "blank",
	"*": "any",
} as const;

export type ShortColor = keyof typeof Colors;
export type Color = (typeof Colors)[ShortColor];

const shortColors = Object.keys(Colors);
const colors = Object.values(Colors);

export function isShortColor(s: string): s is ShortColor {
	return shortColors.includes(s as ShortColor);
}

export function isColor(s: string): s is Color {
	return colors.includes(s as Color);
}

export function toColor(s: string): Result<Color, Error> {
	if (isColor(s)) {
		return ok(s);
	}

	if (isShortColor(s)) {
		return ok(Colors[s]);
	}

	return err(new Error(`s is not a Color or ShortColor`));
}
