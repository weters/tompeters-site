/** Class used to monitor changes to the viewport and set a CSS property */
class ViewHeightObserver {
    /**
     * Create a ViewHeightObserver
     */
    constructor() {
        this.currentOrientation = null
        this.prevVH = null
        window.requestAnimationFrame(() => this.setViewHeight())
        window.addEventListener('resize', () => this.setViewHeight())
    }

    /**
     * setViewHeight will set the --computed-vh CSS property if the orientation changes
     * or the actual height shrinks
     */
    setViewHeight() {
        const vh = window.innerHeight * 0.01
        if (this.currentOrientation !== ViewHeightObserver.orientation() || vh < this.prevVH) {
            document.documentElement.style.setProperty('--computed-vh', `${vh}px`)
            this.currentOrientation = ViewHeightObserver.orientation()
            this.prevVH = vh
        }
    }

    /**
     * Returns the orientation of the device
     * @returns {string} Either portrait or landscape
     */
    static orientation() {
        return window.innerHeight / window.innerWidth >= 1.0 ? 'portrait' : 'landscape'
    }
}

export default new ViewHeightObserver()
