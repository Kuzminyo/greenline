class Header {
    selectors = {
      root: '[data-js-header]',
      overlay: '[data-js-header-overlay]',
      burgerButton: '[data-js-header-burger-button]',
    }
  
    stateClasses = {
      isActive: 'is-active',
      isLock: 'is-lock',
      isScrolled: 'is-scrolled',
    }

    constructor() {
      this.rootElement = document.querySelector(this.selectors.root)
      this.overlayElement = this.rootElement.querySelector(this.selectors.overlay)
      this.burgerButtonElement = this.rootElement.querySelector(this.selectors.burgerButton)
      this.bindEvents()
      this.onScroll()
    }

    onBurgerButtonClick = () => {
      this.burgerButtonElement.classList.toggle(this.stateClasses.isActive)
      this.overlayElement.classList.toggle(this.stateClasses.isActive)
      document.documentElement.classList.toggle(this.stateClasses.isLock)
    }

    onScroll = () => {
      this.rootElement.classList.toggle(this.stateClasses.isScrolled, window.scrollY > 8)
    }

    bindEvents() {
      this.burgerButtonElement.addEventListener('click', this.onBurgerButtonClick)
      window.addEventListener('scroll', this.onScroll, { passive: true })
    }
  }
  
  export default Header