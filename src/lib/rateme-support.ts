import { RateMeClasses } from "./typings";

export class RateMeSupporter {
	constructor() {}

	public static getActiveClass(classes: RateMeClasses, i: number, score: number, isCancel?: boolean): string {
		if (isCancel) {
			const { aboveZero, equalZero } = classes.nullish;
			return score > 0 ? aboveZero : equalZero;
		}
		const { emptyClass, halfClass, fullClass } = classes.active;
		const scoreInt = Math.floor(score);
		const hasEndingHalf = score - scoreInt === 0.5;
		const isScored = RateMeSupporter.isScored(scoreInt, score, i, hasEndingHalf);
		const isHalf = hasEndingHalf && i === scoreInt + 1;
		return isScored ? (isHalf ? halfClass : fullClass) : emptyClass;
	}

	public static isScored(scoreInt: number, score: number, i: number, hasEndingHalf: boolean): boolean {
		return (score > 0 && i <= scoreInt && !hasEndingHalf) || (score > 0 && i <= scoreInt + 1 && hasEndingHalf);
	}

	public static randomNumber(max: number): number {
		return Math.round(Math.random() * max * 2) / 2;
	}
	public static randomString(): string {
		const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
		return charset
			.split("")
			.sort(() => 0.5 - Math.random())
			.join("")
			.substring(Math.floor(RateMeSupporter.randomNumber(charset.length * 0.5)));
	}

	public static roundAndBound(value: number, rounding: "half" | "full" = "half", maxValue: number = 100, minValue: number = 0): number {
		if (value <= minValue) return minValue;
		if (value > maxValue) return maxValue;
		return rounding === "half" ? Math.round(value * 2) / 2 : Math.round(value);
	}
}
