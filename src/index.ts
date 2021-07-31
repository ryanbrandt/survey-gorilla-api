import { app } from "./app";

import "./db/config/modelInitialization";

app.listen(process.env.APP_PORT, () =>
  console.log(`Started API on ${process.env.APP_URL}:${process.env.APP_PORT}`)
);
