// import { RateMe } from "rateme-js";
import { RateMe } from "../dist/lib/es6/index"; // when testing locally

const container = document.getElementById("container-rate")!;
const input = document.querySelector("input")!;

const config = {
	maxValue: 5,
	iconSize: 55,
	iconSpacing: 6,
	allowAnimations: true,
};

const rater = new RateMe(config);
rater.rate(input, container);
rater.render({
	fromDOM: true,
	filter: {
		selectors: ["rateme", "test"],
	},
});

console.log(rater);
