/**
 * Class provides capability for simulating a user typing
 */
export default class CodeWriter {
    /**
     * Creates a new CodeWriter object. The element passed in will have it's text content
     * typed out to the screen as if a user is typing—albeit quickly—in real-time.
     * @param elem The element to type out
     */
    constructor(elem) {
        this.elem = elem
        this.text = elem.textContent
        this.index = 0
        this.elem.style.display = 'none'
        this.fontSize = null
        this.ready = false
        this.isTyping = false

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
        if (!this.ready) {
            window.requestAnimationFrame(() => this.run())
            return
        }

        if (!this.isTyping) {
            this._type()
        }
    }

    /**
     * Simulate the typing to the screen
     * Each pass-through will output one letter. This method is recursively called
     * until all letters have been typed.
     */
    _type() {
        this.isTyping = true

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
            // 85% of the time, we'll use a delay of 10-40ms.
            // 15% of the time, we'll use a delay of 10-125ms

            let maxVal = 30

            if (Math.floor(Math.random() * 100) < 15) {
                maxVal = 125
            }

            const delay = Math.floor(Math.random() * maxVal) + 10
            setTimeout(() => this._type(), delay)
        }
    }
}
