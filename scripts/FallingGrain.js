class FallingGrain {
    // Теплі відтінки зерна для природного різнобарв'я
    palette = ['#c8a24b', '#b8893b', '#a9762b', '#d8be7a']

    constructor({ count = 24, target = document.body, className = 'grain-field' } = {}) {
        // Поважаємо налаштування "зменшити рух" — тоді анімацію не створюємо взагалі
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return
        }

        this.count = count
        this.target = target
        this.className = className

        if (!this.target) {
            return
        }

        this.render()
    }

    createGrain() {
        const grain = document.createElement('span')
        grain.className = 'grain'

        const size = 4 + Math.random() * 5 // 4–9px
        const left = Math.random() * 100 // %
        const duration = 12 + Math.random() * 12 // 12–24s
        const delay = -Math.random() * duration // одразу розподіляємо по екрану
        const drift = Math.round((Math.random() * 2 - 1) * 50) // горизонтальне погойдування
        const opacity = (0.2 + Math.random() * 0.35).toFixed(2)
        const color = this.palette[Math.floor(Math.random() * this.palette.length)]

        grain.style.cssText = `
            left: ${left}%;
            width: ${size.toFixed(1)}px;
            height: ${(size * 1.8).toFixed(1)}px;
            background-color: ${color};
            opacity: ${opacity};
            animation-duration: ${duration.toFixed(1)}s;
            animation-delay: ${delay.toFixed(1)}s;
            --drift: ${drift}px;
        `

        return grain
    }

    render() {
        const field = document.createElement('div')
        field.className = this.className
        field.setAttribute('aria-hidden', 'true')

        const fragment = document.createDocumentFragment()

        for (let i = 0; i < this.count; i++) {
            fragment.appendChild(this.createGrain())
        }

        field.appendChild(fragment)
        this.target.appendChild(field)
    }
}

export default FallingGrain
