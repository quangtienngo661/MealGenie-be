const app = require("./app");
require("dotenv").config();

const PORT = process.env.BE_PORT;

app.listen(PORT, () => {
    console.log("Server is listening on port " + PORT);
})