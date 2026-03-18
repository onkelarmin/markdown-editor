import "./gsap";
import { initGsapDefaults, initScrollTriggerRefresh } from "./global";

export function initAnimations() {
  initGsapDefaults();
  initScrollTriggerRefresh();
}
