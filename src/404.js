import CodeWriter from "./classes/CodeWriter";
import './assets/404.scss'
import './assets/dank-mono.css'

const onLoad = () => {
    document.querySelectorAll('pre')
        .forEach(pre => {
            pre.innerHTML = pre.innerHTML.replace(/NOTFOUND/, window.location.pathname.substr(1))
        })

    const cw = new CodeWriter(document.querySelector('pre.command'), 250, 100)
    cw.index = 2 // show "$ " to start
    cw.run()
        .then(el => {
            el.lastElementChild.style.opacity = 0
            setTimeout(() => {
                document.querySelector('pre.output').style.opacity = 1
            }, 250)
        })
}

if (document.readyState === 'loading') {
    window.addEventListener('load', onLoad)
} else {
    onLoad()
}