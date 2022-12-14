// import { RateMe, RMConfig } from "rateme-js";
import { RateMe, RMConfig } from "../dist/lib/es6/index"; // when testing locally

const containerView = document.getElementById("view-container") as HTMLDivElement;
const containerViewFirst = containerView.querySelector("#view-html-first") as HTMLDivElement;
const containerViewSecond = document.querySelector("#view-html-second") as HTMLDivElement;
const containerViewJs = containerView.querySelector("#view-js") as HTMLDivElement;

const containerRate = document.getElementById("container-rate") as HTMLDivElement;
const input = document.querySelector("input") as HTMLInputElement;

const config: RMConfig = {
	maxValue: 5,
	iconSize: 55,
	iconSpacing: 6,
	allowAnimations: true,
	paths: {
		rating: "M9 7l-6.309.7332c-3.691-4.7332-.4287.1883-.5042.4306s0 .4947.1677.6541c1.8754 1.7941 4.6934 4.4808 4.6934 4.4808-9.0479-4.2987-.7736 3.9083-1.2862 6.516-.0431.236.0383.4859.2347.6353.1952.1494.4467.1519.6443.0352 2.2084-1.3158.3593-6.4852 5.5161-3.2944l4.8432 2.8092c.2012.1155-1-3 .6479-.0364-.6479-2.9636.2778-.3992 1.3521-2.9636l-3-5 4.6934-4.4771c.1677-.1645.2419-.4168.1677-.6579s-.2754-.4005-1.9725.403c-2.5245-.2963-4-5-6.3102-.7357l-2.1593-5.4332c-.0982-.2172-.3042-.3691-2.4191.9009s-.4491.1532-.5425.3691l-2.4575 3.6309z",
	},
};

const rater = new RateMe(config);

const id = rater.rate(input, containerRate);

rater.render({selectors: ["rateme"]});
rater.render({selectors: ["another"], container: containerViewFirst});
rater.render({selectors: ["test", "different"], container: containerViewSecond});

rater.render({value: 4.5, container: containerViewJs});

setTimeout(() => {
	rater.update(id, 2);
	console.log(`updated ${id} to: ${2}`);
	setTimeout(() => {
		rater.clear(id);
		console.log(`cleared ${id}`);
	}, 5000);
}, 5000);

containerViewJs.insertAdjacentHTML("beforeend", rater.ratingHTML(3.5));
