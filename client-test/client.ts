import {RateMe, RateMeConfig} from "rateme-js";
// import { RateMe, RateMeConfig } from "../dist/lib/es6/index"; // when testing local

const config: RateMeConfig = {
    maxValue: 5,
    iconSize: 25,
    iconSpacing: 6,
    allowAnimations: true,
    gradientFirst: "#fece3c",
    gradientSecond: "#f5f5f5",
    withCancel: true,
    strokeColor: "transparent",
    strokeStyle: "stroke-opacity: 0.3;"
}

const rater = new RateMe(config);
const rater2 = new RateMe({...config, maxValue: 10, withCancel: false});

console.log(rater);
console.log(rater2);