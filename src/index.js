const express = require("express");
const path = require('path') //nn to install expliclitly
const app = express();
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public') //joining path
console.log(publicDirectoryPath);
app.use(express.static(publicDirectoryPath));

app.listen(port, () => {
    console.log(`server is up on port ${port}`)
})