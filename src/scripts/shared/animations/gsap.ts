import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import GSDevTools from "gsap/GSDevTools";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(GSDevTools);

export { gsap, ScrollTrigger, GSDevTools };
