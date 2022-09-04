import { RateMeElementor } from "./rateme-elementor";

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
}

export interface RMConfig extends Partial<RateMeConfig> {
	paths?: {
		rating?: string;
		cancel?: string;
	}
}

export interface RateMeClasses {
	active: { emptyClass: string; halfClass: string; fullClass: string };
	nullish: { equalZero: string; aboveZero: string };
	parts: { base: string; half: string; full: string };
	base: { wrapper: string; element: string; rating: string; icon: string; form: string };
	input: { empty: string; filled: string };
}

export interface RateMeAttributes {
	filter: { name: string; value: string };
	value: { name: string; value: number };
	max: { name: string; value: number };
	min: { name: string; value: number };
	anims: { name: string; value: string };
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
}
