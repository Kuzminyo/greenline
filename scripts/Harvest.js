// Лінійні анімовані сцени для блоку-ілюстрації.
// Сцена обирається через атрибут data-js-harvest="combine|truck|silo|mill|sacks|conveyor".
// Порожнє значення (як на головній) = combine.
class Harvest {
    selectors = {
        target: '[data-js-harvest]',
    }

    config = {
        cycle: 11, // тривалість проїзду, с
        portion: 0.8, // частина циклу, коли комбайн рухається
        driveFrom: 360, // старт: за кадром справа
        driveTo: -300, // фініш: за кадром зліва (їде вліво)
        headerX: 24, // локальна X жатки/мотовила
        ground: 150,
        width: 360,
        stalkXs: [20, 58, 96, 134, 172, 210, 248, 286, 324],
    }

    constructor() {
        this.targets = document.querySelectorAll(this.selectors.target)
        this.targets.forEach((el) => this.build(el))
    }

    build(el) {
        const scene = (el.dataset.jsHarvest || 'combine').trim()
        el.innerHTML = this.svg(this.sceneInner(scene))
    }

    svg(inner) {
        return `<svg class="harvest__scene" viewBox="0 0 360 180" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${inner}</svg>`
    }

    sceneInner(scene) {
        switch (scene) {
            case 'truck':
                return this.truckScene()
            case 'silo':
                return this.siloScene()
            case 'mill':
                return this.millScene()
            case 'sacks':
                return this.sacksScene()
            case 'conveyor':
                return this.conveyorScene()
            default:
                return this.combineScene()
        }
    }

    // Потік зерна: дрібні крапки, що сиплються (або підіймаються — від'ємний drop)
    grain({ x, y, drop, count = 6, dur = 1.2, spread = 2.5 }) {
        let dots = ''
        for (let i = 0; i < count; i++) {
            const delay = (-(i * dur) / count).toFixed(2)
            const dx = ((i % 3) - 1) * spread
            dots += `<circle class="hv-grain" cx="${(x + dx).toFixed(1)}" cy="${y}" r="1.7" style="--drop:${drop}px;animation-delay:${delay}s;animation-duration:${dur}s" />`
        }
        return `<g class="hv-pour">${dots}</g>`
    }

    groundLine() {
        return `<path class="hv-furrow" d="M0 ${this.config.ground} L${this.config.width} ${this.config.ground}" />`
    }

    // ── Сцена 1: комбайн на полі (головна) ─────────────────────────────
    combineScene() {
        return `${this.field()}<g class="harvest__stalks">${this.stalks()}</g>${this.combine()}`
    }

    // ── Сцена 2: зерно пересипається у фуру ────────────────────────────
    truckScene() {
        const chute = `<g class="hv-chute">
            <path d="M170 44 L250 44 L226 72 L194 72 Z" />
            <path d="M210 44 L210 32 M150 32 L270 32" />
        </g>`

        const truck = `<g class="hv-bob">
            <path d="M120 96 L120 132 L250 132 L250 96" />
            <path d="M120 132 L300 132" />
            <path d="M250 132 L250 104 L276 104 L290 120 L300 120 L300 132" />
            <path d="M256 110 L272 110 L280 120 L256 120 Z" />
            <path d="M126 112 Q186 98 244 112" />
            <g transform="translate(160,140)"><circle r="11" /><circle r="3.5" /></g>
            <g transform="translate(210,140)"><circle r="11" /><circle r="3.5" /></g>
            <g transform="translate(282,140)"><circle r="11" /><circle r="3.5" /></g>
        </g>`

        return this.groundLine() + chute + truck + this.grain({ x: 210, y: 74, drop: 34, count: 7, dur: 1.1 })
    }

    // ── Сцена 3: елеватор / силоси (зберігання) ────────────────────────
    siloScene() {
        const silo = (x) => `<g>
            <path d="M${x} 148 L${x} 78 M${x + 54} 148 L${x + 54} 78" />
            <path d="M${x} 78 Q${x + 27} 50 ${x + 54} 78" />
            <path d="M${x} 148 L${x + 54} 148" />
            <path d="M${x + 6} 98 L${x + 48} 98 M${x + 6} 118 L${x + 48} 118" />
        </g>`

        const leg = `<g>
            <path d="M250 148 L250 44 L276 44 L276 148" />
            <path d="M250 44 Q263 32 276 44" />
            <path d="M252 56 L150 56 L150 70" />
            <g transform="translate(263,138)"><circle r="9" /><g class="hv-reel"><path d="M-9 0 L9 0 M0 -9 L0 9 M-6 -6 L6 6 M6 -6 L-6 6" /></g></g>
        </g>`

        const rise = this.grain({ x: 263, y: 142, drop: -90, count: 7, dur: 1.7, spread: 3 })
        const fill = this.grain({ x: 150, y: 72, drop: 24, count: 5, dur: 1.2 })

        return this.groundLine() + silo(40) + silo(110) + leg + rise + fill
    }

    // ── Сцена 4: млин / вальці (переробка) ─────────────────────────────
    millScene() {
        const hopper = `<path d="M120 42 L240 42 L196 78 L164 78 Z" />`
        const housing = `<path d="M120 86 L240 86 L240 126 L120 126 Z" />`
        const rollers = `
            <g transform="translate(162,106)"><circle r="15" /><g class="hv-reel"><path d="M-15 0 L15 0 M0 -15 L0 15 M-11 -11 L11 11 M11 -11 L-11 11" /></g></g>
            <g transform="translate(200,106)"><circle r="15" /><g class="hv-reel hv-reel--rev"><path d="M-15 0 L15 0 M0 -15 L0 15 M-11 -11 L11 11 M11 -11 L-11 11" /></g></g>`
        const pulley = `<g transform="translate(266,104)"><circle r="16" /><g class="hv-reel"><path d="M-16 0 L16 0 M0 -16 L0 16" /></g></g>
            <path d="M240 96 L252 96 M240 116 L252 116" />`
        const pile = `<path d="M150 150 Q181 132 212 150" />`

        const feed = this.grain({ x: 180, y: 80, drop: 8, count: 4, dur: 1.0 })
        const out = this.grain({ x: 180, y: 128, drop: 20, count: 6, dur: 1.1 })

        return this.groundLine() + hopper + housing + rollers + pulley + feed + out + pile
    }

    // ── Сцена 5: фасування у мішки (пакування) ─────────────────────────
    sacksScene() {
        const spout = `<path d="M150 42 L230 42 L206 66 L174 66 Z" />
            <path d="M190 42 L190 32 M150 32 L230 32" />`
        const platform = `<path d="M150 146 L228 146 M168 138 L168 146 M210 138 L210 146 M156 138 L222 138" />`
        const filling = `<g class="hv-bob">
            <path d="M168 138 L166 92 Q166 84 176 84 L204 84 Q214 84 212 92 L210 138 Z" />
            <path d="M176 84 L176 78 L204 78 L204 84" />
        </g>`
        const full = `<g>
            <path d="M262 148 L260 104 Q260 96 270 96 L294 96 Q304 96 302 104 L300 148 Z" />
            <path d="M270 96 L266 88 L298 88 L294 96" />
            <path d="M281 88 L283 88" />
        </g>`

        const pour = this.grain({ x: 190, y: 70, drop: 22, count: 6, dur: 1.0 })

        return this.groundLine() + spout + platform + filling + full + pour
    }

    // ── Сцена 6: конвеєр (від поля до бізнесу) ─────────────────────────
    conveyorScene() {
        const belt = `<path d="M70 92 L290 92 M70 124 L290 124" />
            <g transform="translate(70,108)"><circle r="16" /><g class="hv-reel"><path d="M-16 0 L16 0 M0 -16 L0 16 M-11 -11 L11 11 M11 -11 L-11 11" /></g></g>
            <g transform="translate(290,108)"><circle r="16" /><g class="hv-reel"><path d="M-16 0 L16 0 M0 -16 L0 16 M-11 -11 L11 11 M11 -11 L-11 11" /></g></g>
            <path d="M88 124 L88 148 M272 124 L272 148 M70 148 L290 148" />`

        let beads = ''
        for (let i = 0; i < 6; i++) {
            const delay = (-i * 0.7).toFixed(2)
            beads += `<circle class="hv-grain hv-convey" cx="0" cy="88" r="2.1" style="animation-delay:${delay}s" />`
        }

        const drop = this.grain({ x: 300, y: 96, drop: 40, count: 5, dur: 0.9 })
        const pile = `<path d="M286 150 Q303 134 320 150" />`

        return this.groundLine() + belt + `<g>${beads}</g>` + drop + pile
    }

    // ── Будівельні блоки сцени комбайна ────────────────────────────────
    // Поле: лінія землі, стерня та легка борозна
    field() {
        const { ground, width } = this.config
        let ticks = ''
        for (let x = 12; x < width; x += 15) {
            const h = 3 + (x % 3)
            ticks += `M${x} ${ground} l0 ${-h} `
        }

        return `<g class="hv-field">
            <path d="M0 ${ground} L${width} ${ground}" />
            <path class="hv-stubble" d="${ticks}" />
            <path class="hv-furrow" d="M0 ${ground + 14} L${width} ${ground + 11}" />
        </g>`
    }

    // Колосок-контур
    stalkShape() {
        return `
            <path class="hv-stem" d="M0 0 L0 -26" />
            <g transform="translate(0,-26)">
                <path d="M0 3 L0 -12" />
                <ellipse cx="-3" cy="-2" rx="2.2" ry="4.5" transform="rotate(-25 -3 -2)" />
                <ellipse cx="3"  cy="-2" rx="2.2" ry="4.5" transform="rotate(25 3 -2)" />
                <ellipse cx="-3" cy="-7" rx="2.2" ry="4.5" transform="rotate(-25 -3 -7)" />
                <ellipse cx="3"  cy="-7" rx="2.2" ry="4.5" transform="rotate(25 3 -7)" />
                <ellipse cx="0"  cy="-12" rx="2.2" ry="4.5" />
            </g>`
    }

    stalks() {
        const { cycle, portion, driveFrom, driveTo, headerX, ground, stalkXs } = this.config

        return stalkXs
            .map((x, i) => {
                const reach = (portion * (x - headerX - driveFrom)) / (driveTo - driveFrom)
                const cutDelay = ((reach - 0.1) * cycle).toFixed(2)
                const swayDelay = (-i * 0.4).toFixed(2)

                return `<g class="hv-stalk" transform="translate(${x}, ${ground})">
                    <g class="hv-stalk-sway" style="animation-delay:${swayDelay}s">
                        <g class="hv-stalk-cut" style="animation-delay:${cutDelay}s">${this.stalkShape()}</g>
                    </g>
                </g>`
            })
            .join('')
    }

    // Зернозбиральний комбайн (тільки контур), повернутий вліво
    combine() {
        return `<g class="hv-combine">
            <!-- бункер / корпус -->
            <path d="M122 94 L122 64 L136 58 L242 58 L260 78 L260 118 L122 118 Z" />
            <!-- кабіна зі склінням -->
            <path d="M58 94 L58 80 L72 60 L122 60 L122 94 Z" />
            <path d="M63 82 L73 63 L98 63 L98 84 L63 84 Z" />
            <path d="M102 63 L118 63 L118 84 L102 84 Z" />
            <!-- складений розвантажувальний шнек -->
            <path d="M150 58 L150 50 L240 50 M194 50 L194 58" />
            <!-- вихлопна труба: нахил назад, зрізаний край -->
            <path d="M128 58 L131 46 M134 58 L137 46 M127 46 L138 46" />
            <circle class="hv-puff" cx="132" cy="40" r="3.5" />
            <!-- похила частина (живильник) -->
            <path d="M58 96 L58 116 L20 134 L20 112 Z" />
            <!-- жатка біля землі -->
            <path d="M4 150 L4 136 L42 126 L42 150 Z" />
            <path d="M8 144 L38 134" />
            <!-- мотовило (обертається) -->
            <g transform="translate(24,122)">
                <g class="hv-reel">
                    <circle r="11" />
                    <line x1="-11" y1="0" x2="11" y2="0" />
                    <line x1="0" y1="-11" x2="0" y2="11" />
                    <line x1="-8" y1="-8" x2="8" y2="8" />
                    <line x1="-8" y1="8" x2="8" y2="-8" />
                </g>
            </g>
            <!-- переднє ведуче колесо -->
            <circle cx="86" cy="122" r="28" />
            <g transform="translate(86,122)">
                <g class="hv-wheelspin" style="animation-duration:2.6s">
                    <circle r="9" />
                    <path d="M0 -28 L0 28 M-28 0 L28 0 M-20 -20 L20 20 M20 -20 L-20 20" />
                </g>
            </g>
            <!-- заднє кермоване колесо -->
            <circle cx="236" cy="134" r="16" />
            <g transform="translate(236,134)">
                <g class="hv-wheelspin" style="animation-duration:1.8s">
                    <circle r="5" />
                    <path d="M0 -16 L0 16 M-16 0 L16 0" />
                </g>
            </g>
        </g>`
    }
}

export default Harvest
