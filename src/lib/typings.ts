import { RateMeElementor } from "./rateme-elementor";

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export interface RateMeConfig {
	maxValue: number;
	iconSpacing: number;
	iconSize: number;
	allowAnimations: boolean;
	gradientFirst: string;
	gradientSecond: string;
	strokeColor: string;
	strokeStyle: string;
	withCancel: boolean;
	disableStyles: boolean;
	ariaLabels: RateMeAriaLabels;
}

export interface RatedAriaLabel {
	[value: number]: string; 
}

export interface RaterAriaLabel {
	main: string;
	[value: number]: string; 
}

export interface RateMeAriaLabels {
	rated: RatedAriaLabel;
	rater: RaterAriaLabel;
	default: string;
}

export interface RMConfig extends DeepPartial<RateMeConfig> {
	paths?: {
		rating?: string;
		cancel?: string;
	}
}

export interface RateMeClasses {
	active: { emptyClass: string; halfClass: string; fullClass: string };
	nullish: { equalZero: string; aboveZero: string };
	parts: { base: string; half: string; full: string };
	base: { wrapper: string; element: string; rating: string; icon: string; form: string, anims: string; };
	input: { empty: string; filled: string };
}

export interface RateMeAttributes {
	filter: { name: string; value: string };
	value: { name: string; value: number };
	max: { name: string; value: number };
	min: { name: string; value: number };
	size: { name: string; value: string };
	ignore: { name: string; value: string };
}

export interface RateMeSVGs {
	gradientId: string;
	templateId: {
		rating: string;
		cancel: string;
	};
	paths: {
		rating: string;
		cancel: string;
	};
}

export interface RateMeInstance {
	classes: RateMeClasses;
	attributes: RateMeAttributes;
	svgs: RateMeSVGs;
	stylesId: string;
	elementor: RateMeElementor;
	inputEventName: string;
}
