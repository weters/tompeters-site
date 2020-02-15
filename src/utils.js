/**
 * This function returns a promise that will execute after X ms.
 * @param ms Time to utils
 * @returns {Promise<Boolean>} True
 */
export const sleep = ms =>
    new Promise(resolve => setTimeout(() => resolve(true), ms))

/**
 * Non-destructive shuffle
 * @param list
 * @returns {*[]}
 */
export const shuffle = list => {
    const listCopy = [...list]
    for (let j = list.length-1; j > 0; j--) {
        const i = Math.floor(Math.random() * (j+1))
        const tmp = listCopy[i]
        listCopy[i] = listCopy[j]
        listCopy[j] = tmp
    }

    return listCopy
}
