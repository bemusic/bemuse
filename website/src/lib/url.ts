export function imgUrl(img: string) {
    return `img/${img}`
}

export function docUrl(doc: string, language?: string) {
    return `docs/${language ? language + '/' : ''}${doc}`
}

export function pageUrl(page: string, language?: string) {
    return  (language ? `${language}/` : '') + page
}
