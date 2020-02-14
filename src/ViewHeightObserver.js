export default class ViewHeightObserver {
    constructor() {
        this.currentOrientation = null
        this.prevVH = null
        this.setViewHeight()
        window.requestAnimationFrame(() => this.setViewHeight())
        window.addEventListener('resize', () => this.setViewHeight())
    }

    orientation() {
        return window.innerHeight / window.innerWidth >= 1.0 ? 'portrait' : 'landscape'
    }

    setViewHeight() {
        const vh = window.innerHeight * 0.01
        if (this.currentOrientation !== this.orientation() || vh < this.prevVH) {
            document.documentElement.style.setProperty('--computed-vh', `${vh}px`)
            this.currentOrientation = this.orientation()
            this.prevVH = vh
        }
    }
}
