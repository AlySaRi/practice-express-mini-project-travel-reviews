import "dotenv/config";
import express from "express";
import { engine } from "express-handlebars";

const app = express();
const PORT = process.env.PORT || 3000;

app.engine("handlebars", engine());
app.set("view engine", "handlebars");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

import reviewsRouter from "./routes/reviews.js";
app.use("/reviews", reviewsRouter);

app.get("/", (req, res) => res.redirect("/reviews"));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
