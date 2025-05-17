import dotenv from "dotenv";

dotenv.config();

import app from "./server";

const PORT = 3000;

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on http://localhost:${PORT}`);
});
