export class RateMeSVG {
	readonly SVGN = "http://www.w3.org/2000/svg";
	readonly paths: { rating: string; cancel: string };
	readonly templateId: { rating: string; cancel: string };
	readonly gradientId: string;
	constructor(options: { gradientId: string; templateId: { rating: string; cancel: string }; paths: { rating: string; cancel: string } }) {
		this.gradientId = options.gradientId;
		this.templateId = options.templateId;
		this.paths = options.paths;
	}

	public createSVG(options: { svgType: "rating" | "cancel"; iconSize: number; iconClass: string[]; strokeOptions: { strokeColor: string; style: string } }): SVGSVGElement {
		const svgElement = document.createElementNS(this.SVGN, "svg");
		svgElement.setAttribute("xmlns", this.SVGN);
		const { svgType, iconClass, iconSize, strokeOptions } = options;
		svgElement.classList.add(...iconClass);
		svgElement.setAttribute("width", `${iconSize}px`);
		svgElement.setAttribute("height", `${iconSize}px`);
		const mainUse = this.createUse({ svgType });
		svgElement.appendChild(mainUse);
		if (svgType === "rating") {
			const strokeUse = this.createUse({ svgType, strokeOptions });
			svgElement.appendChild(strokeUse);
		}
		return svgElement;
	}

	public createSVGTemplate(config: { svgType: "rating" | "cancel"; gradientColors?: { firstColor: string; secondColor: string } }): SVGSVGElement {
		const svgElement = document.createElementNS(this.SVGN, "svg");
		svgElement.setAttribute("xmlns", this.SVGN);
		const { svgType, gradientColors } = config;
		svgElement.setAttribute("height", "0");
		svgElement.setAttribute("width", "0");
		if (svgType === "rating" && gradientColors) {
			const defs = document.createElementNS(this.SVGN, "defs");
			const { firstColor, secondColor } = gradientColors;
			defs.appendChild(this.createGradientElement(firstColor, secondColor));
			svgElement.appendChild(defs);
		}
		const symbol = this.createSymbolElement(this.templateId[svgType]);
		symbol.appendChild(this.createPathElement(this.paths[svgType]));
		svgElement.appendChild(symbol);
		return svgElement;
	}

	private createUse(config: { svgType: "rating" | "cancel"; strokeOptions?: { strokeColor: string; style: string } }): SVGUseElement {
		const { svgType, strokeOptions } = config;
		const use = document.createElementNS(this.SVGN, "use");
		use.setAttribute("href", `#${this.templateId[svgType]}`);
		if (svgType === "rating" && strokeOptions != null) {
			use.setAttribute("fill", "none");
			use.setAttribute("stroke", strokeOptions.strokeColor);
			use.setAttribute("style", strokeOptions.style);
		}
		return use;
	}
	private createPathElement(d: string): SVGPathElement {
		const path = document.createElementNS(this.SVGN, "path");
		path.setAttribute("d", d);
		return path;
	}
	private createSymbolElement(id: string, viewBox: string = "0 0 20 20"): SVGSymbolElement {
		const symbol = document.createElementNS(this.SVGN, "symbol");
		symbol.setAttribute("xmlns", this.SVGN);
		symbol.setAttribute("viewBox", viewBox);
		symbol.setAttribute("id", id);
		return symbol;
	}
	private createStopElement(offset: string, color: string): SVGStopElement {
		const stop = document.createElementNS(this.SVGN, "stop");
		stop.setAttribute("offset", offset);
		stop.setAttribute("style", `stop-color:${color};stop-opacity:1`);
		return stop;
	}
	private createGradientElement(firstColor: string, secondColor: string): SVGLinearGradientElement {
		const gradient = document.createElementNS(this.SVGN, "linearGradient");
		gradient.setAttribute("id", this.gradientId);
		gradient.setAttribute("x1", "0%");
		gradient.setAttribute("y1", "0%");
		gradient.setAttribute("x2", "100%");
		gradient.setAttribute("y2", "0%");
		gradient.appendChild(this.createStopElement("0%", firstColor));
		gradient.appendChild(this.createStopElement("50%", firstColor));
		gradient.appendChild(this.createStopElement("50%", secondColor));
		gradient.appendChild(this.createStopElement("100%", secondColor));
		return gradient;
	}
}
