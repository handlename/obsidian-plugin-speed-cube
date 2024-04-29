import { MarkdownPostProcessorContext, Plugin } from 'obsidian';
import { TopLayerParser, TopLayerElementBuilder } from './layer';

export default class SpeedCubePlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor("speedcube", this.codeProcessor)
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
