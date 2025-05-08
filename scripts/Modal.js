class Modal {
    selectors = {
        root: '[data-js-modal]',
        openButton: '[data-js-open-modal]',
        closeButton: '[data-js-close-modal]',
    }

    stateClasses = {
        isActive: 'is-active',
        isLock: 'is-lock',
    }

    constructor() {
        this.rootElement = document.querySelector(this.selectors.root)
        this.openButtonElement = document.querySelector(this.selectors.openButton)
        this.closeButtonElement = document.querySelector(this.selectors.closeButton)
        this.bindEvents()
    }

    onOpenButtonClick = () => {
        this.rootElement.classList.add(this.stateClasses.isActive)
        document.documentElement.classList.add(this.stateClasses.isLock)
    }

    onCloseButtonClick = () => {
        this.rootElement.classList.remove(this.stateClasses.isActive)
        document.documentElement.classList.remove(this.stateClasses.isLock)
    }

    bindEvents() {
        this.openButtonElement.addEventListener('click', this.onOpenButtonClick)
        this.closeButtonElement.addEventListener('click', this.onCloseButtonClick)
    }
}

export default Modal