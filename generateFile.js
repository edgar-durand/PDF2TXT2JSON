const fs = require('fs');
const PDFParser = require('pdf2json');

const saveToPath = (_PATH, STREAM, cb) => {
    fs.writeFile(_PATH, STREAM, cb);
}

const generateFile = async (

    _PATH = "./pdf.pdf",
    SAVE_TO_PATH = "./",
    SAVE_FILENAME = "test.txt"
) => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser(this, 1);
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {
            console.log(pdfData.Meta)
            saveToPath(SAVE_TO_PATH + SAVE_FILENAME, pdfParser.getRawTextContent(), () => {
                console.timeEnd('generate-pdf')
                resolve({
                    url: SAVE_TO_PATH +SAVE_FILENAME,
                    data: pdfParser.getRawTextContent(),
                    meta: {
                        title: pdfData.Meta.Title?.replace('Microsoft Word - ', ''),
                        author: pdfData.Meta.Author,
                        createDate: pdfData.Meta.Metadata['xmp:createdate'],
                        modifyDate: pdfData.Meta.Metadata['xmp:modifydate']
                    }
                })
            });
        });
        console.time('generate-pdf')
        pdfParser.loadPDF(
            _PATH);
    })
}

module.exports = { generateFile, saveToPath }
