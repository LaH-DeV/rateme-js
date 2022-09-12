import { RateMeRater } from "./rateme-rater";
import { RMConfig } from "./typings";

/**
 * @description RateMe class
 * @param {number} [maxValue] - optional max rating value
 * @param {number} [iconSpacing] - optional spacing between icons [px] 
 * @param {number} [iconSize] - optional icon size [px]
 * @param {boolean} [allowAnimations] - optional as name suggests
 * @param {boolean} [withCancel] - optional with cancel icon (nullish input value)
 * @param {boolean} [disableStyles] - optional disabling library default styling
 * @param {string} [strokeColor] - optional svg stroke color
 * @param {string} [strokeStyle] - optional svg stroke style
 * @param {string} [gradientFirst] - optional svg gradient - first color
 * @param {string} [gradientSecond] - optional svg gradient - second color
 * @param {object} [paths] - optional custom svg icon paths
 * @property {string} [paths.rating] - optional svg rating icon path
 * @property {string} [paths.cancel] - optional svg cancel icon path
 * @param {object} [ariaLabels] - optional custom aria labels
 * @property {string} [ariaLabels.default] - optional, default aria label for missing values
 * @property {object} [ariaLabels.rated] - optional, custom aria labels for view-elements
 * @property {string} [ariaLabels.rated.value] - optional aria label value, example: {0: 'zero out of #', 1: '$ out of #'}
 * @property {object} [ariaLabels.rater] - optional, custom aria labels for rate-elements
 * @property {string} [ariaLabels.rater.main] - optional main form aria label value, example: 'Rate this item out of five stars'
 * @property {string} [ariaLabels.rater.value] - optional aria label value, example: {1: '$ star out of five stars'}
 * @external Documentation 
 * @see {@link https://github.com/LaH-DeV/rateme-js/#readme Documentation}
 */
class RateMe {
	private readonly instance: RateMeRater;
	constructor(config?: RMConfig) {
		this.instance = new RateMeRater(config);
	}

	/**
	 * @example rater.render({value: 4.5, container: containerElement});
	 * @example render({selectors: ["shopRating", "item"]});
	 * @example render({selectors: ["itemRating"], exclude: true, container: containerElement});
	 * @overload `from script` generate ratings and push to the DOM.
	 * @param {object} config - required `config` parameter of type `object`.
	 * @property {number} config.value - rating value - will be rounded to 0.5
	 * @property {HTMLElement} config.container - will-be container of this rating
	 * @description Renders `view-only` rating element.
	 */
	public render(config: { value: number; container: HTMLElement }): void;
	/**
	 * @example render({selectors: ["shopRating", "item"]});
	 * @example render({selectors: ["itemRating"], exclude: true, container: containerElement});
	 * @example rater.render({value: 4.5, container: containerElement});
	 * @overload `from DOM` generate ratings from the DOM.
	 * @param {object} config - required `config` parameter of type `object`.
	 * @property {string[]} selectors - 'data-rm-id' attribute to filter ratings in html.
	 * @property {boolean} [exclude] - boolean to exclude given selectors - render rest.
	 * @property {HTMLElement} [config.container] - container to narrow down the query of selectors.
	 * @description Renders `view-only` rating element.
	 */
	public render(config: { selectors: string[]; exclude?: boolean; container?: HTMLElement }): void;
	public render(config: { value?: number; container?: HTMLElement; selectors?: string[]; exclude?: boolean;}): void {
		const fromDOM = config.selectors != null && config.value == null;
		this.instance.render({...config, fromDOM});
	}

	/**
	 * @example rate(inputElement, containerElement);
	 * @example rate(inputElement, containerElement, "rateme-form-id");
	 * @example rate(inputElement, containerElement, "rateme-form-id", 5);
	 * @example rate(inputElement, containerElement, undefined, 3.5);
	 * @param {HTMLInputElement} input - required input[type="hidden"] for rating.
	 * @param {HTMLElement} container - required container to put rating in.
	 * @param {string} [id] - optional argument for identification of 'rating-form instance' (default: random).
	 * @param {number} [initialValue] - optional argument (default: 0)
	 * @emits Event emits event called `rated` on inputElement when rated.
	 * @returns {string} `id` of the rating 'form' element (random or provided)
	 * @description Renders interactive rating element.
	 */
	public rate(input: HTMLInputElement, container: HTMLElement, id?: string, initialValue: number = 0): string {
		return this.instance.rate(input, container, id, initialValue);
	}

	/**
 	 * @example update(id, 5);
	 * @param {string} id - required argument for identification of 'rating-form instance'.
	 * @param {number} rating - required argument for setting new value'.
	 * @description Updates rating to given rating.
	 */
	public update(id: string, rating: number): void {
		this.instance.update(id, rating);
	}

	/**
	 * @example rate(id);
	 * @param {string} id - required argument for identification of 'rating-form instance'.
	 * @emits Event emits event called `rated` on inputElement when cleared.
	 * @description Clears rating.
	 * - When rating is not required (withCancel) => sets value to empty string (`''`). 
	 * - When rating is required (!withCancel) => sets value to `0`.
	 */
	public clear(id: string): void {
		this.instance.clear(id, this.instance.withCancel);
	}

	/**
	 * @example ratingHTML(rating);
	 * @param {number} rating - required argument
	 * @emits Event emits event called `rated` on inputElement when rated.
	 * @returns {string} rating element's `outerHTML`
	 * @description Creates and returnes `view-only` rating element in the form of string.
	 */
	public ratingHTML(rating: number): string {
		return this.instance.ratingHTML(rating);
	}

	/**
	 * @example templateHTML("rating");
	 * @example templateHTML("cancel");
	 * @param {"rating" | "cancel"} templateType - required argument
	 * @returns {string} rating svg template's `outerHTML`
	 * @description Creates and returnes svg template element in the form of string.
	 */
	public templateHTML(templateType: "rating" | "cancel"): string {
		return this.instance.templateHTML(templateType);
	}
}

export { RateMe, RMConfig };
