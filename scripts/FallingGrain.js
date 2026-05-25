class FallingGrain {
    selectors = {
        field: '.grain-field',
    }

    // Теплі відтінки зерна для природного різнобарв'я
    palette = ['#c8a24b', '#b8893b', '#a9762b', '#d8be7a']

    constructor(count = 24) {
        // Поважаємо налаштування "зменшити рух" — тоді анімацію не створюємо взагалі
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return
        }

        this.count = count
        this.render()
    }

    createGrain() {
        const grain = document.createElement('span')
        grain.className = 'grain'

        const size = 4 + Math.random() * 5 // 4–9px
        const left = Math.random() * 100 // %
        const duration = 9 + Math.random() * 9 // 9–18s
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
        field.className = 'grain-field'
        field.setAttribute('aria-hidden', 'true')

        const fragment = document.createDocumentFragment()

        for (let i = 0; i < this.count; i++) {
            fragment.appendChild(this.createGrain())
        }

        field.appendChild(fragment)
        document.body.appendChild(field)
    }
}

export default FallingGrain
