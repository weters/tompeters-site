/**
 * Class provides capability for simulating a user typing
 */
export default class CodeWriter {
    /**
     * Creates a new CodeWriter object. The element passed in will have it's text content
     * typed out to the screen as if a user is typing—albeit quickly—in real-time.
     * @param elem {Element} The element to type out
     * @param minMS {Number} The minimum ms between key presses
     * @param baseMS {Number} Max ms between key presses
     */
    constructor(elem, minMS = 10, baseMS = 30) {
        this.elem = elem
        this.text = elem.textContent
        this.index = 0
        this.elem.style.display = 'none'
        this.fontSize = null
        this.ready = false
        this.promise = null
        this.minMS = minMS
        this.baseMS = baseMS

        // set the height of the element to the final code block
        // note: the display change is to get around an iOS safari bug where
        // the height is calculated without the media query font-size applied
        window.requestAnimationFrame(() => {
            // ready prevents run() from running before we can set the final height
            this.ready = true
            this.elem.style.display = 'block'
            this.elem.style.height = this.elem.clientHeight + 'px'
            this.elem.innerHTML = ''
            this.fontSize = getComputedStyle(this.elem).fontSize

            window.addEventListener("resize", () => this.resizeElement())
        })
    }

    /**
     * Resize the element.
     * This method will usually be called when the screen is resized.
     */
    resizeElement() {
        const fontSize = getComputedStyle(this.elem).fontSize
        if (this.fontSize !== fontSize) {
            const temp = this.elem.parentNode.appendChild(document.createElement('pre'))
            temp.textContent = this.text
            this.elem.style.height = temp.clientHeight + 'px'
            temp.remove()

            this.fontSize = fontSize
        }
    }

    /**
     * Call this method to starting the typing simulation.
     * This method will call itself until this.ready is true
     */
    run() {
        if (this.promise) {
            return this.promise
        }

        return this.promise = new Promise(resolve => {
            this._type(resolve)
        })
    }

    /**
     * Simulate the typing to the screen
     * Each pass-through will output one letter. This method is recursively called
     * until all letters have been typed. Once, typing is finished, the resolve
     * function will be called.
     *
     * @param resolve {Function} The resolve function
     * @private
     */
    _type(resolve) {
        if (!this.ready) {
            window.requestAnimationFrame(() => this._type(resolve))
            return
        }

        const textPart = this.text.substr(this.text, this.index++)
        this.elem.innerHTML = ''
        textPart.split(/\n/)
            .forEach(textSegment => {
                if (textSegment.match(/^#/) || textSegment.match(/^\/\//)) {
                    // is comment
                    const em = this.elem.appendChild(document.createElement('em'))
                    em.textContent = textSegment
                } else {
                    // else, it's just a normal statement
                    const span = this.elem.appendChild(document.createElement('span'))
                    span.textContent = textSegment
                }

                // always append a newline. We'll strip out the newline from the last statement
                // at the end
                const span = this.elem.appendChild(document.createElement('span'))
                span.textContent = "\n"
            })

        // remove last newline. Append a cursor
        this.elem.lastElementChild.textContent = this.elem.lastElementChild.textContent.substring(0, -1)
        const span = this.elem.appendChild(document.createElement('span'))
        span.textContent = "\u258f"
        span.classList.add('cursor')

        // check to see if there's more text to output
        if (this.index <= this.text.length) {
            // 85% of the time, we'll use our base delay
            // 15% of the time, we'll use a base*4 delay

            let maxVal = this.baseMS

            if (Math.floor(Math.random() * 100) < 15) {
                maxVal *= 4
            }

            const delay = Math.floor(Math.random() * maxVal) + this.minMS
            setTimeout(() => this._type(resolve), delay)

            return
        }

        resolve(this.elem)
        return
    }
}
