const {generateFile} = require("./generateFile");
const {parseJson} = require("./parseJson");

/**
 * PROCESS:  PDF --> TXT --> JSON --> API
 */
generateFile()
    .then(({url, data, meta}) => {
            parseJson(data, url)
                .then(json =>{
                    // TODO: SEND TO API
                })
                .catch(err => console.error(err))
        }
    )

