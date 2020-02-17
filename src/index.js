import './assets/dank-mono.css'
import './assets/styles.scss'
import './classes/ViewHeightObserver'
import CodeWriter from "./classes/CodeWriter";
import { mdiChevronDoubleDown as chevron } from "@mdi/js";

const onLoad = () => {
    if (process.env.NODE_ENV === 'production') {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
        }
    }

    document.querySelector('svg path').setAttribute('d', chevron)

    const observer = new IntersectionObserver((sections) => {
        sections.forEach(section => {
            if (section.isIntersecting && !section.target.classList.contains('shown')) {
                section.target.classList.add('shown')
                section.target.codeWriter.run()
                section.target.querySelector('h2')
            }
        })
    }, {
        rootMargin: '0px 0px -25% 0px',
        root: null,
        threshold: 0.01,
    })

    document.querySelectorAll('section.language')
        .forEach(section => {
            // wrap each pre block in a div.
            // if there is a public GitHub source, append a link to that div.

            const pre = section.querySelector('pre.code')
            const container = document.createElement('div')
            container.classList.add('code-container')
            pre.parentNode.replaceChild(container, pre)
            container.appendChild(pre)

            const src = pre.getAttribute('data-src')
            if (src) {
                const a = container.appendChild(document.createElement('a'))
                a.href = src
                const i = a.appendChild(document.createElement('i'))
                i.classList.add('fas', 'fa-code-branch')

                const span = a.appendChild(document.createElement('span'))
                span.classList.add('view-source')
                span.textContent = `View Source`
            }

            section.codeWriter = new CodeWriter(section.querySelector('pre'))
            observer.observe(section)
        })
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', onLoad)
} else {
    onLoad()
}
