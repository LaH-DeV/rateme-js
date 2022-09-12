import { RateMeSupporter as Support } from "./rateme-support";
import { RateMeSVG } from "./rateme-svg";
import { RateMeAttributes, RateMeClasses, RateMeConfig, RateMeSVGs, RateMeAriaLabels } from "./typings";

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
	readonly ariaLabels: RateMeAriaLabels;
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
		this.ariaLabels = config.ariaLabels;
		this.classes = classes;
		this.attributes = attributes;
		this.svgs = svgs;
	}

	public createSingleRating(maxValue: number, minValue: number, svgConfig: { iconSize: number; svgType: "rating" | "cancel"; iconClass: string[] }): HTMLDivElement {
		const svgCreator = new RateMeSVG({ ...this.svgs });
		const svgElement = svgCreator.createSVG({ ...svgConfig, strokeOptions: { strokeColor: this.strokeColor, style: this.strokeStyle } });
		const element = document.createElement("div");
		element.classList.add(this.classRating);
		this.setAriaHidden(element);
		if (svgConfig.svgType === "rating") {
			this.setMinValueAttribute(element, minValue.toString());
			element.appendChild(this.createSelectionPart("half", minValue));
		}
		this.setMaxValueAttribute(element, maxValue.toString());
		element.appendChild(svgElement);
		element.appendChild(this.createSelectionPart("full", maxValue));
		return element;
	}

	public createSelectionPart(part: "half" | "full", value: number): HTMLDivElement {
		const element = document.createElement("div");
		element.classList.add(this.classParts, this.classes.parts[part]);
		this.setValueAttribute(element, value.toString());
		this.setAriaChecked(element, "false");
		const ariaLabel = this.prepareAriaLabel(this.getRaterAriaLabels(value), { low: value, max: this.maxValue });
		this.setAriaLabel(element, ariaLabel);
		this.setAriaRole(element, "radio");
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
		this.setAriaHidden(ratingWrapper);
		let size = iconSize;
		if (fromDOM && wrapperElement) {
			const sizeAttr = Number(wrapperElement.getAttribute(this.sizeAttribute));
			if (sizeAttr) {
				size = sizeAttr;
			}
		}
		for (let i = 1; i <= this.maxValue; i++) {
			const activeClass = Support.getActiveClass(this.classes, i, value);
			ratingWrapper.appendChild(this.createSingleViewRating(size, activeClass));
		}
		if (!fromDOM) {
			const ariaLabel = this.prepareAriaLabel(this.getRatedAriaLabels(value), { low: value, max: this.maxValue });
			return this.wrapRating(ratingWrapper, value, this.ignoreAttributeDefault, ariaLabel);
		}
		return ratingWrapper;
	}

	public createSingleViewRating(iconSize: number, activeClass: string): SVGSVGElement {
		const svgCreator = new RateMeSVG(this.svgs);
		const svgElement = svgCreator.createSVG({ iconSize, strokeOptions: { strokeColor: this.strokeColor, style: this.strokeStyle }, iconClass: [this.classIcon, activeClass], svgType: "rating" });
		return svgElement;
	}

	public createWrapper(iconSpacing: number): HTMLDivElement {
		const ratingWrapper = document.createElement("div");
		ratingWrapper.classList.add(this.classWrapper);
		ratingWrapper.style.gap = `${iconSpacing}px`;
		return ratingWrapper;
	}

	public findRatingElements(filter?: { exclude?: boolean; selectors?: string[]; container?: HTMLElement }): Element[] {
		if (filter == null) {
			const elements = document.querySelectorAll(`.${this.classElement}[${this.filterAttribute}]:not([${this.ignoreAttribute}])`);
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
			const elements = containerElement.querySelectorAll(`.${this.classElement}[${this.valueAttribute}]:not([${this.ignoreAttribute}])`);
			return Array.from(elements);
		}
	}

	public excludeQuery(container: Document | Element, selectors: string[]): Element[] {
		const ratingElements = Array.from(container.querySelectorAll(`.${this.classElement}[${this.valueAttribute}]:not([${this.ignoreAttribute}])`));
		const excludedRatingElements = ratingElements.filter((element) => {
			const elementRating = element.getAttribute(this.filterAttribute) ?? this.valueAttributeDefault.toString();
			return selectors.indexOf(elementRating) === -1;
		});
		return excludedRatingElements;
	}

	public includeQuery(container: Document | Element, selectors: string[]): Element[] {
		const elements = [];
		for (const id of selectors) {
			if (id === this.filterAttributeDefault) {
				const unspecifiedQuery = `.${this.classElement}[${this.valueAttribute}]:not([${this.ignoreAttribute}]):not([${this.filterAttribute}])`;
				const unspecifiedItems = container.querySelectorAll(unspecifiedQuery);
				if (unspecifiedItems) {
					elements.push(...Array.from(unspecifiedItems));
				}
			}
			const selector = `.${this.classElement}[${this.valueAttribute}][${this.filterAttribute}="${id}"]`;
			const queryItems = container.querySelectorAll(selector);
			if (!queryItems) continue;
			elements.push(...Array.from(queryItems));
		}
		return elements;
	}

	public createPostRating(initialValue: number): HTMLDivElement {
		const ratingWrapper = this.createWrapper(this.iconSpacing);
		ratingWrapper.classList.add(this.classWrapper);
		ratingWrapper.style.gap = `${this.iconSpacing}px`;
		this.setAriaHidden(ratingWrapper);
		const startingPosition = !this.withCancel ? 1 : 0;
		for (let i = startingPosition; i <= this.maxValue; i++) {
			const isCancel = this.withCancel && i === 0;
			const activeClass = Support.getActiveClass(this.classes, i, initialValue, isCancel);
			const currSVG = {
				iconSize: this.iconSize,
				iconClass: [this.classIcon, activeClass],
			};
			const minValue = i > 0.5 ? i - 0.5 : i;
			const ratingElement = this.createSingleRating(i, minValue, { ...currSVG, svgType: isCancel ? "cancel" : "rating" });
			ratingWrapper.appendChild(ratingElement);
		}
		const ariaLabel = this.prepareAriaLabel(this.getMainRaterAriaLabel(), { max: this.maxValue });
		return this.wrapRating(ratingWrapper, initialValue, "view", ariaLabel, false);
	}

	public wrapRating(element: HTMLDivElement, value: number, ignore?: string, ariaLabel?: string, isViewOnly: boolean = true): HTMLDivElement {
		const ratingElement = document.createElement("div");
		ratingElement.classList.add(this.classElement);
		this.setValueAttribute(ratingElement, value.toString());
		if (ignore != null && typeof ignore === "string" && ignore.length > 0) {
			this.setIgnoreAttribute(ratingElement, ignore);
		}
		if (this.allowAnimations) {
			ratingElement.classList.add(this.classAnims);
		}
		if(ariaLabel) {
			this.setAriaLabel(ratingElement, ariaLabel);
		}
		this.setAriaRole(ratingElement, isViewOnly ? "img" : "radiogroup");
		ratingElement.appendChild(element);
		return ratingElement;
	}

	public prepareAriaLabel(label: string, values: { low?: number, max?: number }): string {
		if(label != null && values.low != null && label.includes("$")) {
			label = label.replaceAll("$", values.low.toString());
		}
		if(label != null && values.max != null && label.includes("#")) {
			label = label.replaceAll("#", values.max.toString());
		}
		return label;
	}

	public getRatedAriaLabels(value: number): string {
		return this.ariaLabels.rated[value] ?? this.ariaLabels.default ?? '';
	}

	public getRaterAriaLabels(value: number): string {
		return this.ariaLabels.rater[value] ?? this.ariaLabels.default ?? '';
	}

	public getDefaultAriaLabel(): string {
		return this.ariaLabels.default ?? '';
	}

	public getMainRaterAriaLabel(): string {
		return this.ariaLabels.rater.main ?? '';
	}

	public setAriaHidden(element: Element): void {
		element.setAttribute("aria-hidden", "true");
	}

	public setAriaRole(element: Element, role: string): void {
		element.setAttribute("role", role);
	}

	public setAriaLabel(element: Element, label: string): void {
		element.setAttribute("aria-label", label);
	}

	public setAriaChecked(element: Element, value: string): void {
		element.setAttribute("aria-checked", value);
	}

	public setIgnoreAttribute(element: Element, value: string): void {
		element.setAttribute(this.ignoreAttribute, value);
	}

	public setMaxValueAttribute(element: Element, value: string): void {
		element.setAttribute(this.maxAttribute, value);
	}

	public setMinValueAttribute(element: Element, value: string): void {
		element.setAttribute(this.minAttribute, value);
	}

	public setValueAttribute(element: Element, value: string): void {
		element.setAttribute(this.valueAttribute, value);
	}

	get maxAttribute() {
		return this.attributes.max.name;
	}

	get minAttribute() {
		return this.attributes.min.name;
	}

	get ignoreAttribute() {
		return this.attributes.ignore.name;
	}

	get ignoreAttributeDefault() {
		return this.attributes.ignore.value;
	}

	get filterAttribute() {
		return this.attributes.filter.name;
	}

	get filterAttributeDefault() {
		return this.attributes.filter.value;
	}

	get valueAttribute() {
		return this.attributes.value.name;
	}

	get valueAttributeDefault() {
		return this.attributes.value.value;
	}

	get sizeAttribute() {
		return this.attributes.size.name;
	}

	get classElement() {
		return this.classes.base.element;
	}

	get classWrapper() {
		return this.classes.base.wrapper;
	}

	get classParts() {
		return this.classes.parts.base;
	}

	get classIcon() {
		return this.classes.base.icon;
	}

	get classRating() {
		return this.classes.base.rating;
	}
	
	get classAnims() {
		return this.classes.base.anims;
	}

	get classForm() {
		return this.classes.base.form;
	}
}
