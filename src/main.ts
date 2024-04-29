import { Plugin } from 'obsidian';
import { TopLayerParser } from './layer';

export default class SpeedCubePlugin extends Plugin {
	async onload() {
		// TODO: MarkdownPreviewRenderer.createCodeBlockPostProcessor
	}

	onunload() {
		this.registerMarkdownCodeBlockProcessor("speedcube", (src, el, ctx) => {
			const matrix = TopLayerParser.parseCodeBlock(src);
			const table = TopLayerParser.buildTable(matrix);
			el.appendChild(table);
		});
	}

}
