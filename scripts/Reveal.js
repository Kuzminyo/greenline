// Плавна поява елементів під час прокручування (scroll-reveal).
// Працює на всіх сторінках: автоматично знаходить контент за селекторами,
// тож окремі правки в HTML кожної сторінки не потрібні.
class Reveal {
    selectors =
        '.section__title, .section__main, .section__image, .products__title, .products__subtitle, .product-card'

    stateClasses = {
        reveal: 'reveal',
        isVisible: 'is-visible',
    }

    constructor() {
        // Поважаємо налаштування "зменшити рух" і старі браузери без IntersectionObserver
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        if (!('IntersectionObserver' in window)) return

        this.elements = [...document.querySelectorAll(this.selectors)]
        if (!this.elements.length) return

        // Ховаємо лише після того, як JS точно працює (інакше контент лишиться видимим)
        this.elements.forEach((el) => el.classList.add(this.stateClasses.reveal))

        this.observer = new IntersectionObserver(this.onIntersect, {
            threshold: 0.15,
            rootMargin: '0px 0px -8% 0px',
        })

        this.elements.forEach((el) => this.observer.observe(el))
    }

    onIntersect = (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return

            entry.target.classList.add(this.stateClasses.isVisible)
            this.observer.unobserve(entry.target)
        })
    }
}

export default Reveal
