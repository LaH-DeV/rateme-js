import { RateMeConfig, RateMeInstance, RMConfig, RateMeAriaLabels } from "./typings";
import { RateMeElementor } from "./rateme-elementor";
import { RateMeSVG } from "./rateme-svg";
import { RateMeSupporter as Support } from "./rateme-support";
import { createStyle } from "./rateme-styles";
export class RateMeRater implements RateMeConfig, RateMeInstance {
	readonly maxValue: number = 5;
	readonly iconSpacing: number = 6;
	readonly iconSize: number = 20;
	readonly allowAnimations: boolean = true;
	readonly withCancel: boolean = false;
	readonly gradientFirst: string = "#fece3c";
	readonly gradientSecond: string = "#f5f5f5";
	readonly strokeColor: string = "transparent";
	readonly strokeStyle: string = "stroke-opacity: 0.3;";
	readonly disableStyles: boolean = false;
	readonly stylesId: string = "rateme-stylesheet";
	readonly inputEventName: string = "rated";
	readonly elementor!: RateMeElementor;
	readonly ariaLabels: RateMeAriaLabels = {
		rated: {},
		rater: {
			main: "Rate this item out of # stars"
		},
		default: "$ out of # stars",
	};
	readonly classes = {
		active: { emptyClass: "rateme-null-score", halfClass: "rateme-half-score", fullClass: "rateme-full-score" },
		nullish: { equalZero: "rateme-equal-zero-score", aboveZero: "rateme-above-zero-score" },
		parts: { base: "rateme-part", half: "rateme-half", full: "rateme-full" },
		base: { wrapper: "rateme-wrapper", element: "rateme-element", rating: "rateme-rating", icon: "rateme-icon", form: "rateme-form", anims: "rateme-animated" },
		input: { empty: "rateme-empty", filled: "rateme-filled" },
	};
	readonly attributes = {
		filter: { name: "data-rm-id", value: "rateme" },
		value: { name: "data-rm-value", value: 0 },
		max: { name: "data-rm-max-value", value: 0.5 },
		min: { name: "data-rm-min-value", value: 0 },
		size: { name: "data-rm-size", value: "" },
		ignore: { name: "data-rm-ignore", value: "create" },
	};
	readonly svgs = {
		gradientId: "rateme-gradient",
		templateId: {
			rating: "rateme-star",
			cancel: "rateme-cancel",
		},
		paths: {
			rating: "M6.842 6.4331l-6.309.7332c-.2275.0289-.4287.1883-.5042.4306s0 .4947.1677.6541c1.8754 1.7941 4.6934 4.4808 4.6934 4.4808-.0024 0-.7736 3.9083-1.2862 6.516-.0431.236.0383.4859.2347.6353.1952.1494.4467.1519.6443.0352 2.2084-1.3158 5.5161-3.2944 5.5161-3.2944l5.5138 3.2957c.2012.1155.4527.113.6479-.0364.1964-.1494.2778-.3992.2335-.634l-1.2826-6.5172 4.6934-4.4771c.1677-.1645.2419-.4168.1677-.6579s-.2754-.4005-.503-.4281c-2.5245-.2963-6.3102-.7357-6.3102-.7357l-2.6144-6.064c-.0982-.2172-.3042-.3691-.5461-.3691s-.4491.1532-.5425.3691l-2.6144 6.064z",
			cancel: "m5.76 4.08L2.8922 5.2678 8.4243 10.8 4.08 15.84 5.2678 18.7078 10.8 13.1757 16.3322 18.7078 17.52 15.84 13.1757 10.8 18.7078 5.2678 15.84 4.08 10.8 8.4243z",
		},
	};
	constructor(config?: RMConfig) {
		const isBrowser = typeof window === "object" && typeof document === "object";
		if (!isBrowser) {
			console.error("This script should only be run in a browser environment!");
			return;
		}
		if (config) {
			if (config.maxValue != null && typeof config.maxValue === "number") {
				this.maxValue = Support.roundAndBound(config.maxValue, "full", 100, 1);
				delete config.maxValue;
			}
			if (config.iconSpacing != null && typeof config.iconSpacing === "number") {
				this.iconSpacing = Support.roundAndBound(config.iconSpacing, "full", 100);
				delete config.iconSpacing;
			}
			if (config.iconSize != null && typeof config.iconSize === "number") {
				this.iconSize = config.iconSize;
				delete config.iconSize;
			}
			if (config.allowAnimations != null && typeof config.allowAnimations === "boolean") {
				this.allowAnimations = config.allowAnimations;
				delete config.allowAnimations;
			}
			if (config.gradientFirst != null && typeof config.gradientFirst === "string") {
				this.gradientFirst = config.gradientFirst;
				delete config.gradientFirst;
			}
			if (config.gradientSecond != null && typeof config.gradientSecond === "string") {
				this.gradientSecond = config.gradientSecond;
				delete config.gradientSecond;
			}
			if (config.strokeColor != null && typeof config.strokeColor === "string") {
				this.strokeColor = config.strokeColor;
				delete config.strokeColor;
			}
			if (config.strokeStyle != null && typeof config.strokeStyle === "string") {
				this.strokeStyle = config.strokeStyle;
				delete config.strokeStyle;
			}
			if (config.withCancel != null && typeof config.withCancel === "boolean") {
				this.withCancel = config.withCancel;
				delete config.withCancel;
			}
			if (config.disableStyles != null && typeof config.disableStyles === "boolean") {
				this.disableStyles = config.disableStyles;
				delete config.disableStyles;
			}
			if ((config.paths != null && typeof config?.paths?.rating === "string") || config?.paths?.cancel === "string") {
				if (typeof config.paths.rating === "string") {
					this.svgs.paths.rating = config.paths.rating;
					delete config.paths.rating;
				}
				if (typeof config.paths.cancel === "string") {
					this.svgs.paths.cancel = config.paths.cancel;
					delete config.paths.cancel;
				}
				if (Object.keys(config.paths).length === 0) {
					delete config.paths;
				}
			}
			if (config.ariaLabels != null && typeof config.ariaLabels === "object" && (config.ariaLabels.rated != null || config.ariaLabels.rater != null)) {
				if(typeof config.ariaLabels.rated === "object") {
					this.ariaLabels.rated = Object.assign({}, this.ariaLabels.rated, config.ariaLabels.rated);
					delete config.ariaLabels.rated;
				}
				if(typeof config.ariaLabels.rater === "object") {
					this.ariaLabels.rater = {...config.ariaLabels.rater, main: config.ariaLabels.rater.main ?? this.ariaLabels.rater.main};
					delete config.ariaLabels.rater;
				}
				if(typeof config.ariaLabels.default === "string") {
					this.ariaLabels.default = config.ariaLabels.default;
					delete config.ariaLabels.default;
				}
				if (Object.keys(config.ariaLabels).length === 0) {
					delete config.ariaLabels;
				}
			}
			if (Object.keys(config).length > 0) {
				console.warn("class RateMe: some of the given properties were incorrect and therefore not used: ", config);
			}
		}
		this.elementor = new RateMeElementor(
			{
				maxValue: this.maxValue,
				iconSize: this.iconSize,
				iconSpacing: this.iconSpacing,
				allowAnimations: this.allowAnimations,
				withCancel: this.withCancel,
				gradientFirst: this.gradientFirst,
				gradientSecond: this.gradientSecond,
				strokeColor: this.strokeColor,
				strokeStyle: this.strokeStyle,
				disableStyles: this.disableStyles,
				ariaLabels: this.ariaLabels
			},
			this.classes,
			this.attributes,
			this.svgs
		);
		if (!this.disableStyles) {
			this.prepareStyles();
		}
		this.checkAndPushTemplate("rating");
		if (this.withCancel) {
			this.checkAndPushTemplate("cancel");
		}
	}

	public render(config: { value?: number; fromDOM?: boolean; container?: HTMLElement; exclude?: boolean; selectors?: string[]; }): void {
		if (!config) throw new TypeError("class RateMe: config for 'render' method was not provided.");
		const { value, fromDOM, selectors, exclude, container } = config;
		if (value == null && fromDOM == null) throw new TypeError("class RateMe: config for 'render' method should have [value: number] or [selectors: string[]] property defined.");
		if (value != null && typeof value !== "number") throw new TypeError("class RateMe: config for 'render' method should have [value: number] or [selectors: string[]] property defined.");
		if (fromDOM != null && typeof fromDOM !== "boolean") throw new TypeError("class RateMe: config for 'render' method should have [value: number] or [selectors: string[]] property defined.");
		const elementConfig = { value: value ?? 0, fromDOM: fromDOM ?? false, iconSpacing: this.iconSpacing, wrapperElement: undefined, iconSize: this.iconSize };
		if (fromDOM) {
			const elements = this.elementor.findRatingElements({selectors: selectors, exclude: exclude, container: container});
			this.createElementsFromDOM(elements, elementConfig);
		} else {
			if (!container || !container.tagName) throw new TypeError("class RateMe: config for 'render' method should have [container: HTMLElement] property defined when is rendered from script values.");
			elementConfig.value = Support.roundAndBound(value ?? 0);
			const rating = this.elementor.createViewRating(elementConfig);
			container.appendChild(rating);
		}
	}

	public rate(input: HTMLInputElement, container: HTMLElement, id?: string, initialValue: number = 0): string {
		if (!input || input.tagName !== "INPUT" || input.type !== "hidden") throw new TypeError("class RateMe: [input: HTMLInputElement][type='hidden'] for 'rate' method was not provided.");
		if (!container || !container.tagName) throw new TypeError("class RateMe: [container: HTMLElement] for 'rate' method was not provided.");
		if (id == null || typeof id !== "string") {
			id = Support.randomString();
		}
		const wrappedRating = this.elementor.createPostRating(Support.roundAndBound(initialValue));
		wrappedRating.setAttribute("id", id);
		wrappedRating.classList.add(this.elementor.classForm);
		input.classList.add(initialValue > 0 ? this.classes.input.filled : this.classes.input.empty);
		wrappedRating.appendChild(input);
		this.addEventToWrapper(wrappedRating);
		this.addEventsToElements(wrappedRating);
		container.appendChild(wrappedRating);
		return id;
	}
	
	public update(id: string, rating: number): void {
		if (rating == null) throw new TypeError("class RateMe: [rating: number] for 'update' should be a valid number.");
		const form = document.querySelector(`.${this.elementor.classElement}.${this.elementor.classForm}#${id}`) as HTMLDivElement;
		if (!form) throw new TypeError("class RateMe: [id: string] for 'update' should be valid rateme-form id.");
		this.handleSVGClasses(rating, form);
		this.selectRating(rating, form);
	}

	public clear(id: string, required?: boolean): void {
		const form = document.querySelector(`.${this.elementor.classElement}.${this.elementor.classForm}#${id}`) as HTMLDivElement;
		if (!form) throw new TypeError("class RateMe: [id: string] for 'clear' should be valid rateme-form id.");
		this.update(id, 0);
		const input = form.querySelector("input") as HTMLInputElement;
		if (input) {
			input.classList.value = this.classes.input.empty;
			input.value = required ? "0" : "";
		}
	}

	public ratingHTML(rating: number): string {
		const { iconSpacing, iconSize } = this;
		const elementConfig = { fromDOM: false, iconSpacing, wrapperElement: undefined, iconSize };
		return this.elementor.createViewRating({ ...elementConfig, value: rating }).outerHTML;
	}

	private prepareStyles(): void {
		const styleInDOM = document.querySelector(`#${this.stylesId}`);
		if (!styleInDOM) {
			const styleTag = createStyle(this.stylesId);
			document.head.appendChild(styleTag);
		}
	}
	private createElementsFromDOM(elements: Element[], elementConfig: { value: number; fromDOM: boolean; iconSpacing: number; wrapperElement: Element | undefined; iconSize: number }): void {
		elements.forEach((element) => {
			const value = Number(element.getAttribute(this.elementor.valueAttribute));
			if (!Number.isNaN(value)) {
				const roundedValue = Support.roundAndBound(value);
				elementConfig.value = roundedValue;
				elementConfig.wrapperElement = element;
				const rating = this.elementor.createViewRating(elementConfig);
				this.setupElementFromDOM(element, value, roundedValue);
				element.appendChild(rating);
			}
		});
	}
	private setupElementFromDOM(element: Element, value: number, roundedValue: number) {
		if (roundedValue !== value) {
			this.elementor.setValueAttribute(element, roundedValue.toString());
		}
		const ariaLabel = this.elementor.prepareAriaLabel(this.elementor.getRatedAriaLabels(roundedValue), { low: roundedValue, max: this.maxValue });
		this.elementor.setAriaLabel(element, ariaLabel);
		this.elementor.setAriaRole(element, "img");
		this.elementor.setIgnoreAttribute(element, "creation");
	}
	private addEventsToElements(wrappedRating: HTMLDivElement): void {
		const ratingElements = wrappedRating.querySelectorAll(`.${this.elementor.classParts}`);
		ratingElements.forEach((element) => {
			element.addEventListener("click", (e) => {
				this.elementEventHandler(e, wrappedRating);
			});
			element.addEventListener("mouseover", (e) => {
				this.elementEventHandler(e);
			});
		});
	}
	private elementEventHandler(event: Event, wrappedRating?: HTMLDivElement): void {
		const targetElement = event.target as HTMLDivElement;
		if (!targetElement) return;
		const score = Number(targetElement.getAttribute(this.elementor.valueAttribute));
		if (score == null || Number.isNaN(score)) return;
		const wrapper = this.elementor.findWrapper(targetElement);
		if (wrapper) {
			this.handleSVGClasses(score, wrapper);
		}
		if (wrappedRating) {
			this.selectRating(score, wrappedRating);
		}
	}
	private selectRating(score: number, wrapperElement: HTMLDivElement): void {
		const inputElement = wrapperElement.querySelector("input") as HTMLInputElement;
		if (wrapperElement && inputElement) {
			this.elementor.setValueAttribute(wrapperElement, score.toString());
			this.handleInputSelect(inputElement, score);
			this.handleAriaChecked(wrapperElement, score);
		}
	}
	private handleInputSelect(inputElement: HTMLInputElement, score: number) {
		const { empty, filled } = this.classes.input;
		inputElement.classList.remove(score > 0 ? empty : filled);
		inputElement.classList.add(score > 0 ? filled : empty);
		const ratedEvent = new CustomEvent<number>(this.inputEventName, { detail: score });
		const inputValue = score > 0 ? score : this.withCancel ? "" : 0;
		inputElement.dispatchEvent(ratedEvent);
		inputElement.value = inputValue.toString();
	}
	private handleAriaChecked(wrapperElement: HTMLDivElement, score: number) {
		const checked = wrapperElement.querySelectorAll(`[aria-checked="true"]`);
		if(checked != null) {
			checked.forEach(checkedElement => {
				if(checked && Number(checkedElement.getAttribute(this.elementor.valueAttribute)) !== score) {
					this.elementor.setAriaChecked(checkedElement, "false");
				}
			});
		}
		const rating = wrapperElement.querySelector(`div.${this.elementor.classRating} [${this.elementor.valueAttribute}="${score}"]`);
		if(rating) {
			this.elementor.setAriaChecked(rating, "true");
		}
	}
	private addEventToWrapper(wrappedRating: HTMLDivElement): void {
		wrappedRating.addEventListener("mouseleave", (_) => {
			const score = Number(wrappedRating.getAttribute(this.elementor.valueAttribute));
			if (score != null && !Number.isNaN(score)) {
				this.handleSVGClasses(score, wrappedRating);
			}
		});
	}
	private handleSVGClasses(score: number, wrapper: HTMLDivElement): void {
		const { emptyClass, halfClass, fullClass } = this.classes.active;
		const ratings = Array.from(wrapper.querySelectorAll(`div.${this.elementor.classRating}`));
		ratings.forEach((rating) => {
			const lowerBound = Number(rating.getAttribute(this.elementor.minAttribute));
			const upperBound = Number(rating.getAttribute(this.elementor.maxAttribute));
			const iconElement = rating.querySelector(`.${this.elementor.classIcon}`);
			if (!iconElement) return;
			if (lowerBound === 0) {
				const { aboveZero, equalZero } = this.classes.nullish;
				iconElement.classList.remove(score > 0 ? equalZero : aboveZero);
				iconElement.classList.add(score > 0 ? aboveZero : equalZero);
			} else {
				const activeClass = score >= upperBound ? fullClass : score === lowerBound ? halfClass : emptyClass;
				if (!iconElement.classList.contains(activeClass)) {
					iconElement.classList.remove(emptyClass, halfClass, fullClass);
					iconElement.classList.add(activeClass);
				}
			}
		});
	}
	public templateHTML(templateType: "rating" | "cancel"): string {
		if(templateType === "rating" || templateType === "cancel") {
			const svgCreator = new RateMeSVG({ ...this.svgs });
			const template = svgCreator.createSVGTemplate({ svgType: templateType, gradientColors: { firstColor: this.gradientFirst, secondColor: this.gradientSecond } });
			return template.outerHTML;
		} else {
			throw new Error("class RateMe: 'templateType' argument for 'templateHTML' method should have value 'rating' or 'cancel'");
		}
	}
	private checkAndPushTemplate(templateString: "rating" | "cancel"): void {
		const templateDOM = document.querySelector(`symbol#${this.svgs.templateId[templateString]}`);
		if (!templateDOM) {
			const svgCreator = new RateMeSVG({ ...this.svgs });
			const template = svgCreator.createSVGTemplate({ svgType: templateString, gradientColors: { firstColor: this.gradientFirst, secondColor: this.gradientSecond } });
			document.body.appendChild(template);
		}
	}
}
