import { Color, toColor } from './color';
import { Result, ok, err } from 'neverthrow';

export class TopLayerMatrix {
	readonly #rows = 5;
	readonly #cols = 5;
	#cells: Map<number, Map<number, Color>>;

	constructor() {
		this.#cells = new Map<number, Map<number, Color>>();

		for (let r = 0; r < this.#rows; r++) {
			this.#cells.set(r, new Map<number, Color>());

			for (let c = 0; c < this.#cols; c++) {
				if (this.mustBlank(r, c)) {
					this.set(r, c, "blank");
				}
			}
		}
	}

	get rows(): number { return this.#rows }
	get cols(): number { return this.#cols }

	set(row: number, col: number, color: Color): Result<Color, Error> {
		if (!this.validateRowCal(row, col)) {
			return err(new Error(`invalid row (${row}) or col (${col})`));
		}

		const cell = this.#cells.get(row);
		if (cell === undefined) {
			return err(new Error(`target cell at (${row}, ${col}) is not exists`));
		}

		cell.set(col, color);

		return ok(color);
	}

	get(row: number, col: number): Color | undefined {
		return this.#cells.get(row)?.get(col);
	}

	toArray(): (Color | undefined)[][] {
		const arr: (Color | undefined)[][] = [];

		this.forEach((row, col, color) => {
			if (arr[row] === undefined) {
				arr[row] = [];
			}

			arr[row][col] = color;
		});

		return arr;
	}

	mustBlank(row: number, col: number): boolean {
		return (row === 0 && col === 0) ||
			(row === 0 && col === this.#cols - 1) ||
			(row === this.#rows - 1 && col === 0) ||
			(row === this.#rows - 1 && col === this.#cols - 1);
	}

	validateRow(n: number): boolean {
		return 0 <= n && n < this.#cols;
	}

	validateCol(n: number): boolean {
		return 0 <= n && n < this.#cols;
	}

	validateRowCal(row: number, col: number): boolean {
		return this.validateRow(row) && this.validateCol(col);
	}

	forEach(fn: (row: number, col: number, color: Color | undefined) => void) {
		for (let r = 0; r < this.#rows; r++) {
			for (let c = 0; c < this.#cols; c++) {
				fn(r, c, this.get(r, c))
			}
		}
	}
}

export const TopLayerParser = {
	parseCodeBlock(src: string): Result<TopLayerMatrix, Error> {
		console.debug(`parses: ${src}`);

		const matrix = new TopLayerMatrix();

		for (const [row, line] of src.split("\n").entries()) {
			for (const [col, c] of line.split("").entries()) {
				const colorRes = toColor(c);
				if (colorRes.isErr()) {
					return err(new Error(`invalid color "${c}" at (${row}, ${col}): ${colorRes.error}`));
				}

				const setRes = matrix.set(row, col, colorRes.value);
				if (setRes.isErr()) {
					return err(new Error(`failed to set "${c} at (${row}, ${col}): ${setRes.error}`))
				}
			}
		}

		console.debug(`parsed to: ${matrix.toArray()}`);

		return ok(matrix);
	},
};

export const TopLayerElementBuilder = {
	build(matrix: TopLayerMatrix): HTMLTableElement {
		const table = document.createElement("table");
		table.addClass("speedcube")

		for (let r = 0; r < matrix.rows; r++) {
			const tr = document.createElement("tr");

			for (let c = 0; c < matrix.cols; c++) {
				const td = document.createElement("td");
				const color = matrix.get(r, c);

				if (color !== undefined) {
					td.addClass(color)
				}

				td.addClass(`row-${r + 1}`);
				td.addClass(`col-${c + 1}`);

				tr.appendChild(td);
			}

			table.appendChild(tr);
		}

		return table;
	},
};
