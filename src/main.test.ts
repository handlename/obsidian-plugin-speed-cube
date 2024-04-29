import { TopLayerParser } from "./layer";
import { Color } from "./color";

describe("parseValidCodeBlock", () => {
	const patterns: [string, string, (Color | undefined)[][]][] = [
		[
			"default",
			"",
			[
				["blank", undefined, undefined, undefined, "blank"],
				[undefined, undefined, undefined, undefined, undefined],
				[undefined, undefined, undefined, undefined, undefined],
				[undefined, undefined, undefined, undefined, undefined],
				["blank", undefined, undefined, undefined, "blank"],
			]
		],
		[
			"complete defenition",
			[
				"_y*r_",
				"rgyyb",
				"*yyy*",
				"ogyyb",
				"_y*o_",

			].join("\n"),
			[
				["blank", "yellow", "any", "red", "blank"],
				["red", "green", "yellow", "yellow", "blue"],
				["any", "yellow", "yellow", "yellow", "any"],
				["orange", "green", "yellow", "yellow", "blue"],
				["blank", "yellow", "any", "orange", "blank"],
			]
		],
		[
			"partial definition",
			[
				"_b*g_",
				"ry*yr",
				"",
				"gy*yb",
				"_o",
			].join("\n"),
			[
				["blank", "blue", "any", "green", "blank"],
				["red", "yellow", "any", "yellow", "red"],
				[undefined, undefined, undefined, undefined, undefined],
				["green", "yellow", "any", "yellow", "blue"],
				["blank", "orange", undefined, undefined, "blank"],
			]
		]
	];

	describe.each(patterns)("%s", (_, src, expected) => {
		const res = TopLayerParser.parseCodeBlock(src);

		if (res.isErr()) {
			console.log(`unexpected error: ${res.error}`);
			expect(res.isErr()).toBeFalsy();
			return
		}

		it("to be expected", () => {
			console.log(res.value.toArray());
			expect(res.value.toArray()).toEqual(expected);
		});
	});
});
