import CodeWriter from "./classes/CodeWriter";
import {sleep, shuffle} from './utils'
import './assets/404.scss'

const onLoad = () => {
    const path = window.location.pathname.substr(1)
    document.querySelectorAll('pre')
        .forEach(pre => pre.innerHTML = pre.innerHTML.replace(/NOTFOUND/g, path))

    const items = document.querySelectorAll('div.item')
    items.forEach(item => item.style.display = 'none')

    const shuffledItems = shuffle(items)
    startAnimations(-1, shuffledItems)
}

const startAnimations = (index, items) => {
    if (index >= 0) {
        items[index].style.display = 'none'
    }

    index = ++index % items.length

    animateItem(items[index])
        .then(() => sleep(3000))
        .then(() => startAnimations(index, items))
}

const animateItem = item => {
    item.querySelector('pre.output').style.opacity = 0
    item.style.display = 'block'

    const prev = item.querySelector('.code-writer')
    if (prev) {
        prev.remove()
    }

    const command = item.querySelector('pre.command')
    command.style.display = 'none'
    const commandClone = command.cloneNode(true)
    commandClone.style.display = 'block'
    commandClone.classList.add('code-writer')
    command.parentElement.insertBefore(commandClone, command)

    const codeWriter = new CodeWriter(commandClone, 20, 50)
    codeWriter.index = 2 // start with "$ " already showing
    return codeWriter.run()
        .then(elem => {
            elem.lastElementChild.style.opacity = 0
            return sleep(200)
        })
        .then(() => item.querySelector('pre.output').style.opacity = 1)
}

if (document.readyState === 'loading') {
    window.addEventListener('load', onLoad)
} else {
    onLoad()
}