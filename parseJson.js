const {saveToPath} = require('./generateFile');
/**
 *                       JSON BUILDER
 * @param txtFile
 */
const parseJson = (txtFile) => {
    /*****************************************************
     *                 REGULAR EXPRESSIONS
     *
     * @type {RegExp}
     ******************************************************/
    const ARTICLES = /(ARTÍCULO.+|Artículo.+)\.[-]\s(.*)/;     // ex. 'ARTÍCULO 82'
    const PAGE_BREAK = /---------------Page.*/gi;        // ex. ----------------Page (434) Break----------------
    const BLANKS = /\s+|[\r]|[\n]|[\r][\n]|[♦]/gu;
    const BLANKS_START_END = /^(\s+?)?(\S.+\S)(\s)?$/g;
    const ARTICLE_DATE = /(\d+?)\sde\s(\S.+\S)\sde(\S\d+)/gi;
    /** ***************************************************/


    /********************************************************
     *                  LOCAL VARIABLES
     ********************************************************/
    const EXTRACT_DATE = (str) => str.replace(ARTICLE_DATE, '$3-$2-$1')
    const noBlanks = (str) => str.replace(BLANKS_START_END, '$2');
    const sanitizer = (str) => {
        const NO_BLANKS = str.replace(BLANKS, ' ')
        return noBlanks(NO_BLANKS)
    };
    const json = {};
    /** *****************************************************/


    const LINE_BY_LINE = txtFile.split('\r\n')
        .map((ln) => {
            if (!PAGE_BREAK.test(ln) && ln !== ' ')
                return sanitizer(ln)
        })
        .filter((ln) => typeof ln !== 'undefined' && ln !== ' ')

    console.log(LINE_BY_LINE)


    const executeExpression = (string) => {
        // if (!ARTICLES.test(string)) return;
        // const [_, article, value] = ARTICLES.exec(string);
        // if (VALUE_BREAK.test(value)) {
        //     const [_, subArticle, subValue] = ARTICLES.exec(value);
        //     const [__, articleValue, second] = VALUE_BREAK.exec(value);
        //     json[article] = articleValue;
        //     console.log({article, subArticle});
        //     return
        // }
        // return executeExpression(value);
    }

    console.time('generate-json')
    // executeExpression(oneLine);
    // saveToPath('./json.json', JSON.stringify(json), () => console.timeEnd('generate-json'));

}
module.exports = {parseJson}