import { RateMeSupporter as Support } from "./rateme-support";
import { RateMeSVG } from "./rateme-svg";
import { RateMeAttributes, RateMeClasses, RateMeConfig, RateMeSVGs } from "./typings";

export class RateMeElementor implements RateMeConfig {
	readonly maxValue: number;
	readonly iconSpacing: number;
	readonly iconSize: number;
	readonly allowAnimations: boolean;
	readonly gradientFirst: string;
	readonly gradientSecond: string;
	readonly strokeColor: string;
	readonly strokeStyle: string;
	readonly withCancel: boolean;
	readonly disableStyles: boolean;
	readonly classes: RateMeClasses;
	readonly attributes: RateMeAttributes;
	readonly svgs: RateMeSVGs;
	constructor(config: RateMeConfig, classes: RateMeClasses, attributes: RateMeAttributes, svgs: RateMeSVGs) {
		this.maxValue = config.maxValue;
		this.iconSpacing = config.iconSpacing;
		this.iconSize = config.iconSize;
		this.allowAnimations = config.allowAnimations;
		this.gradientFirst = config.gradientFirst;
		this.gradientSecond = config.gradientSecond;
		this.strokeColor = config.strokeColor;
		this.strokeStyle = config.strokeStyle;
		this.withCancel = config.withCancel;
		this.disableStyles = config.disableStyles;
		this.classes = classes;
		this.attributes = attributes;
		this.svgs = svgs;
	}
	public createSingleRating(maxValue: number, minValue: number, svgConfig: { iconSize: number; svgType: "rating" | "cancel"; iconClass: string[] }): HTMLDivElement {
		const svgCreator = new RateMeSVG({ ...this.svgs });
		const svgElement = svgCreator.createSVG({ ...svgConfig, strokeOptions: { strokeColor: this.strokeColor, style: this.strokeStyle } });
		const element = document.createElement("div");
		element.classList.add(this.classes.base.rating);

		if (svgConfig.svgType === "rating") {
			element.setAttribute(this.attributes.min.name, minValue.toString());
			element.appendChild(this.createSelectionPart("half", minValue));
		}
		element.setAttribute(this.attributes.max.name, maxValue.toString());
		element.appendChild(svgElement);
		element.appendChild(this.createSelectionPart("full", maxValue));
		return element;
	}
	public createSelectionPart(part: "half" | "full", value: number): HTMLDivElement {
		const element = document.createElement("div");
		element.classList.add(this.classes.parts.base, this.classes.parts[part]);
		element.setAttribute(this.attributes.value.name, value.toString());
		return element;
	}
	public findWrapper(targetElement: HTMLDivElement): HTMLDivElement | undefined {
		const ratingElement = targetElement.parentNode as HTMLDivElement;
		if (!ratingElement) return;
		const wrapperElement = ratingElement.parentNode as HTMLDivElement;
		if (!wrapperElement) return;
		return wrapperElement;
	}
	public createViewRating(config: { value: number; fromDOM: boolean; iconSpacing: number; wrapperElement: Element | undefined; iconSize: number }): HTMLDivElement {
		const { value, fromDOM, iconSpacing, wrapperElement, iconSize } = config;
		const ratingWrapper = this.createWrapper(iconSpacing);
		let size = iconSize;
		if (fromDOM && wrapperElement) {
			const sizeAttr = Number(wrapperElement.getAttribute(this.attributes.size.name));
			if (sizeAttr) {
				size = sizeAttr;
			}
		}
		for (let i = 1; i <= this.maxValue; i++) {
			const activeClass = Support.getActiveClass(this.classes, i, value);
			ratingWrapper.appendChild(this.createSingleViewRating(size, activeClass));
		}
		if (!fromDOM) {
			return this.wrapRating(ratingWrapper, value, !fromDOM);
		}
		return ratingWrapper;
	}
	public createSingleViewRating(iconSize: number, activeClass: string): SVGSVGElement {
		const svgCreator = new RateMeSVG(this.svgs);
		const svgElement = svgCreator.createSVG({ iconSize, strokeOptions: { strokeColor: this.strokeColor, style: this.strokeStyle }, iconClass: [this.classes.base.icon, activeClass], svgType: "rating" });
		return svgElement;
	}
	public createWrapper(iconSpacing: number): HTMLDivElement {
		const ratingWrapper = document.createElement("div");
		ratingWrapper.classList.add(this.classes.base.wrapper);
		ratingWrapper.style.gap = `${iconSpacing}px`;
		return ratingWrapper;
	}
	public findRatingElements(filter?: { exclude?: boolean; selectors?: string[]; container?: HTMLElement }): Element[] {
		if (filter == null) {
			const elements = document.querySelectorAll(`.${this.classes.base.element}[${this.attributes.filter.name}]:not([${this.attributes.ignore.name}])`);
			return Array.from(elements);
		}
		return [...this.getFilteredElements(filter)];
	}
	public getFilteredElements(filter: { exclude?: boolean; selectors?: string[]; container?: HTMLElement }): Element[] {
		const { exclude, selectors, container } = filter;
		const containerElement = container ?? document;
		if (selectors && selectors.length > 0) {
			if (exclude) {
				return this.excludeQuery(containerElement, selectors);
			} else {
				return this.includeQuery(containerElement, selectors);
			}
		} else {
			const elements = containerElement.querySelectorAll(`.${this.classes.base.element}[${this.attributes.value.name}]:not([${this.attributes.ignore.name}])`);
			return Array.from(elements);
		}
	}
	public excludeQuery(container: Document | Element, selectors: string[]): Element[] {
		const ratingElements = Array.from(container.querySelectorAll(`.${this.classes.base.element}[${this.attributes.value.name}]:not([${this.attributes.ignore.name}])`));
		const excludedRatingElements = ratingElements.filter((element) => {
			const elementRating = element.getAttribute(this.attributes.filter.name) ?? this.attributes.value.value.toString();
			return selectors.indexOf(elementRating) === -1;
		});
		return excludedRatingElements;
	}
	public includeQuery(container: Document | Element, selectors: string[]): Element[] {
		const elements = [];
		for (const id of selectors) {
			if (id === this.attributes.filter.value) {
				const unspecifiedQuery = `.${this.classes.base.element}[${this.attributes.value.name}]:not([${this.attributes.ignore.name}]):not([${this.attributes.filter.name}])`;
				const unspecifiedItems = container.querySelectorAll(unspecifiedQuery);
				if (unspecifiedItems) {
					elements.push(...Array.from(unspecifiedItems));
				}
			}
			const selector = `.${this.classes.base.element}[${this.attributes.value.name}][${this.attributes.filter.name}="${id}"]`;
			const queryItems = container.querySelectorAll(selector);
			if (!queryItems) continue;
			elements.push(...Array.from(queryItems));
		}
		return elements;
	}
	public createPostRating(initialValue: number): HTMLDivElement {
		const ratingWrapper = this.createWrapper(this.iconSpacing);
		ratingWrapper.classList.add(this.classes.base.wrapper);
		ratingWrapper.style.gap = `${this.iconSpacing}px`;
		const startingPosition = !this.withCancel ? 1 : 0;
		for (let i = startingPosition; i <= this.maxValue; i++) {
			const isCancel = this.withCancel && i === 0;
			const activeClass = Support.getActiveClass(this.classes, i, initialValue, isCancel);
			const currSVG = {
				iconSize: this.iconSize,
				iconClass: [this.classes.base.icon, activeClass],
			};
			const minValue = i > 0.5 ? i - 0.5 : i;
			const ratingElement = this.createSingleRating(i, minValue, { ...currSVG, svgType: isCancel ? "cancel" : "rating" });
			ratingWrapper.appendChild(ratingElement);
		}

		return this.wrapRating(ratingWrapper, initialValue, true);
	}
	public wrapRating(element: HTMLDivElement, value: number, addFilter: boolean): HTMLDivElement {
		const ratingElement = document.createElement("div");
		ratingElement.classList.add(this.classes.base.element);
		ratingElement.setAttribute(this.attributes.value.name, value.toString());
		if (addFilter) {
			ratingElement.setAttribute(this.attributes.ignore.name, this.attributes.ignore.value);
		}
		if (this.allowAnimations) {
			ratingElement.setAttribute(this.attributes.anims.name, "true");
		}
		ratingElement.appendChild(element);
		return ratingElement;
	}
}
