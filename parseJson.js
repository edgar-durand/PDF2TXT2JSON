const {saveToPath} = require('./generateFile');
const {months} = require('./dates');
/**
 *                               JSON BUILDER
 * @param txtFile
 * @param path
 */
const parseJson = (txtFile, path) => {
    console.time('generate-json')
    return new Promise((resolve, reject) => {
        try {
            /*****************************************************
             *
             *                 REGULAR EXPRESSIONS
             *
             * @type {RegExp}
             ******************************************************/
            const ARTICLES = /(ARTÍCULO)\s(\S.+?)\.[-]\s(.*)/i;     // ex. 'ARTÍCULO 82'
            const PAGE_BREAK = /---------------Page.*/gi;        // ex. ----------------Page (434) Break----------------
            const BLANKS = /\s+|[\r]|[\n]|[\r][\n]|[♦]/gu;
            const BLANKS_START_END = /^(\s+?)?(\S.+\S)(\s)?$/g;
            const ARTICLE_DATE = /(\d{2})\sde\s(.+?\S)\s(de|del)\s(\d{4})/i;
            const versiones = [];
            /** ***************************************************/


            /********************************************************
             *
             *                  LOCAL VARIABLES
             *
             ********************************************************/
            const EXTRACT_DATE = (str) => {
                const [_, day, month,de, year] = ARTICLE_DATE.exec(str);
                return `${year}-${months[month.toLowerCase()]}-${day}`;
            }

            const noBlanks = (str) => str.replace(BLANKS_START_END, '$2');

            const sanitizer = (str) => {
                // You can add here more clean up criteria ex. clean (...) or whatever
                const NO_BLANKS = str.replace(BLANKS, ' ')
                return noBlanks(NO_BLANKS)
            };
            const json = [];
            let articleDate = '';
            let articleContent = '';
            let currentArticle = '';
            /** *****************************************************/


            const LINE_BY_LINE = txtFile.split('\r\n')
                .map((ln) => {
                    if (!PAGE_BREAK.test(ln) && ln !== ' ')
                        return sanitizer(ln)
                })
                .filter((ln) => typeof ln !== 'undefined' && ln !== ' ')



            /**********************
             *
             *          Generate articles
             *
             * *******************/
            LINE_BY_LINE.forEach(ln => {
                /**********   SET ARTICLE DATE   ***************/
                if (ARTICLE_DATE.test(ln)){
                    const date = EXTRACT_DATE(ln)
                    if (!versiones.includes(date) && ln.includes('(REFORMADO')) versiones.push(date)
                }

                if (articleDate === '' && ARTICLE_DATE.test(ln)) {
                    articleDate = EXTRACT_DATE(ln)
                }

                if (articleDate !== '') {

                    if (ARTICLES.test(ln)) {
                        const [_, type, articleNumber, initialContent] = ARTICLES.exec(ln)

                        // When article change save the current one and reset aux variable
                        if (currentArticle !== '' && currentArticle !== articleNumber) {
                            json.push({
                                contenido: {
                                    [articleDate]: {
                                        fecha: articleDate,
                                        contenido: articleContent,
                                        file: path
                                    }
                                },
                                numero: `${currentArticle}`,
                                tipo: 'articulo'
                            })
                            articleContent = '';
                        }

                        currentArticle = articleNumber;
                        articleContent += ` ${initialContent}`;
                    } else {
                        articleContent += ` ${ln}`;
                    }
                }
            })


            /**********************
             *
             *          Generate Doc key
             *
             **********************/
            const doc = {
                path,
                version: articleDate,
                versiones
            }


            /************************
             *
             *          Save JSON to file
             *
             ************************/

            saveToPath('./json.json', JSON.stringify({ articulos: json, doc }), () => {
                console.timeEnd('generate-json');
                resolve(json)
            });
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {parseJson}