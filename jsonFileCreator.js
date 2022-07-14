const fs = require("fs");
exports.jsonFilecreator = (data, fileName) => {
  try {
    const stringifyData = JSON.stringify(data);
    fs.writeFile(`${fileName}.json`, stringifyData, (err) => {
      if (err) {
        throw err;
      } else {
        console.log(`${fileName} has been saved`);
      }
    });
  } catch (e) {
    console.log(e);
  }
};
