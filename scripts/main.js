import Header from "./Header.js";
import ThemeSwitcher from "./Switch-theme.js";
import Modal from "./Modal.js";
import FallingGrain from "./FallingGrain.js";
import Harvest from "./Harvest.js";
import Reveal from "./Reveal.js";

new Header()
new ThemeSwitcher()
new Modal()
new FallingGrain()
new FallingGrain({
  target: document.querySelector('[data-js-header-overlay]'),
  className: 'header__grain',
  count: 20,
})
new Harvest()
new Reveal()