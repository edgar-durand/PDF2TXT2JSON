const {generateFile} = require("./generateFile");
const {parseJson} = require("./parseJson");

/**
 * PROCESS:  PDF --> TXT --> JSON --> API
 */
generateFile()
    .then(({url, data}) => {
            parseJson(data, url)
                .then(json =>{
                    // TODO: SEND TO API
                    console.log(json);
                })
                .catch(err => console.error(err))
        }
    )

