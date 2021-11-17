const {generateFile} = require("./generateFile");
const {parseJson} = require("./parseJson");

generateFile()
    .then(({url, data}) => {
            parseJson(data)
        }
    )

