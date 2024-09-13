import lodash from 'lodash'
export type Chunk = {
    highlight: boolean,
    start: number,
    end: number,
};
export const findAll = ({
                            autoEscape,
                            caseSensitive = false,
                            findChunks = defaultFindChunks,
                            sanitize,
                            searchWords,
                            textToHighlight
                        }: {
    autoEscape?: boolean,
    caseSensitive?: boolean,
    findChunks?: typeof defaultFindChunks,
    sanitize?: typeof defaultSanitize,
    searchWords: Array<string>,
    textToHighlight: string,
}): Array<Chunk> => (
    fillInChunks({
        chunksToHighlight: combineChunks({
            chunks: findChunks({
                autoEscape,
                caseSensitive,
                sanitize,
                searchWords,
                textToHighlight
            })
        }),
        totalLength: textToHighlight ? textToHighlight.length : 0
    })
)

export const combineChunks = ({
                                  chunks
                              }: {
    chunks: Array<Chunk>,
}): Array<Chunk> => {
    chunks = chunks
        .sort((first, second) => first.start - second.start)
        .reduce((processedChunks, nextChunk) => {
            if (processedChunks.length === 0) {
                return [nextChunk]
            } else {
                const prevChunk = processedChunks.pop()
                if (nextChunk.start <= prevChunk.end) {
                    const endIndex = Math.max(prevChunk.end, nextChunk.end)
                    processedChunks.push({highlight: false, start: prevChunk.start, end: endIndex})
                } else {
                    processedChunks.push(prevChunk, nextChunk)
                }
                return processedChunks
            }
        }, [])

    return chunks
}

const defaultFindChunks = ({
                               autoEscape,
                               caseSensitive,
                               sanitize = defaultSanitize,
                               searchWords,
                               textToHighlight
                           }: {
    autoEscape?: boolean,
    caseSensitive?: boolean,
    sanitize?: typeof defaultSanitize,
    searchWords: Array<string>,
    textToHighlight: string,
}): Array<Chunk> => {
    textToHighlight = sanitize(textToHighlight)

    return searchWords
        .filter(searchWord => defaultSanitize(searchWord))
        .reduce((chunks, searchWord) => {
            searchWord = sanitize(searchWord)

            if (autoEscape) {
                searchWord = escapeRegExpFn(searchWord)
            }

            const regex = new RegExp(searchWord, caseSensitive ? 'g' : 'gi')

            let match
            while ((match = regex.exec(textToHighlight))) {
                let start = match.index
                let end = regex.lastIndex
                if (end > start) {
                    chunks.push({highlight: false, start, end})
                }
                if (match.index === regex.lastIndex) {
                    regex.lastIndex++
                }
            }

            return chunks
        }, [])
}
export {defaultFindChunks as findChunks}

export const fillInChunks = ({
                                 chunksToHighlight,
                                 totalLength
                             }: {
    chunksToHighlight: Array<Chunk>,
    totalLength: number,
}): Array<Chunk> => {
    const allChunks = []
    const append = (start, end, highlight) => {
        if (end - start > 0) {
            allChunks.push({
                start,
                end,
                highlight
            })
        }
    }

    if (chunksToHighlight.length === 0) {
        append(0, totalLength, false)
    } else {
        let lastIndex = 0
        chunksToHighlight.forEach((chunk) => {
            append(lastIndex, chunk.start, false)
            append(chunk.start, chunk.end, true)
            lastIndex = chunk.end
        })
        append(lastIndex, totalLength, false)
    }
    return allChunks
}

export function defaultSanitize(string: string): string {
    return lodash.escapeRegExp(string)
}

function escapeRegExpFn(string: string): string {
    return lodash.escapeRegExp(string)
}
