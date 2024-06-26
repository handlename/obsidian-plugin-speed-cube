import { MarkdownPostProcessorContext, Plugin } from 'obsidian';
import { TopLayerParser, TopLayerElementBuilder } from './layer';
import { HTML_CLASS_NAME } from './constants';

export default class SpeedCubePlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor("speedcube", this.codeProcessor)
	}

	async onunload() {
		document.querySelectorAll(`.${HTML_CLASS_NAME}`).forEach((el) => {
			el.remove();
		});
	}

	async codeProcessor(src: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) {
		TopLayerParser.parseCodeBlock(src)
			.map((matrix) => {
				const table = TopLayerElementBuilder.build(matrix);
				console.debug(table);
				el.appendChild(table);
			})
			.mapErr((err) => {
				console.error(`error occured: ${err}`);
			});
	}
}
