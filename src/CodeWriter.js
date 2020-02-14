export default class CodeWriter {
    constructor(elem) {
        this.elem = elem
        this.text = elem.textContent
        this.index = 0
        this.elem.style.display = 'none'
        this.ready = false
        this.fontSize = null

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

            window.addEventListener("resize", () => this.resizePre())
        })
    }

    resizePre() {
        const fontSize = getComputedStyle(this.elem).fontSize
        if (this.fontSize !== fontSize) {
            const temp = this.elem.parentNode.appendChild(document.createElement('pre'))
            temp.textContent = this.text
            this.elem.style.height = temp.clientHeight + 'px'
            temp.remove()

            this.fontSize = fontSize
        }
    }

    run() {
        if (!this.ready) {
            window.requestAnimationFrame(() => this.run())
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
            // 85% of the time, we'll use a delay of 10-40ms.
            // 15% of the time, we'll use a delay of 10-125ms

            let maxVal = 30

            if (Math.floor(Math.random() * 100) < 15) {
                maxVal = 125
            }

            const delay = Math.floor(Math.random() * maxVal) + 10
            setTimeout(() => this.run(), delay)
        }
    }
}
