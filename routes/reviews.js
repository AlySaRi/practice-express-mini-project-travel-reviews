import express from "express";
import db from "../db/connection.js";
import crypto from "crypto";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

const router = express.Router();

/* CLOUDINARY CONFIG */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/* MULTER CONFIG (MEMORY STORAGE) */
const upload = multer({ storage: multer.memoryStorage() });

/* subir imagen a Cloudinary desde Buffer */
async function uploadToCloudinary(fileBuffer) {
  return await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "travel-reviews" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(fileBuffer);
  });
}

/* LISTA */
router.get("/", async (req, res) => {
  await db.read();
  res.render("reviews/list", { reviews: db.data.reviews || [] });
});

/* NEW FORM */
router.get("/new", (req, res) => {
  res.render("reviews/new");
});

/* DETALLE */
router.get("/:id", async (req, res) => {
  await db.read();
  const review = db.data.reviews.find(r => r.id === req.params.id);
  if (!review) return res.status(404).send("Review no encontrada");
  res.render("reviews/detail", { review });
});


/* CREAR NUEVO */
router.post("/new", upload.single("image"), async (req, res) => {
  try {
    await db.read();

    let img = null;
    if (req.file) img = await uploadToCloudinary(req.file.buffer);

    const newReview = {
      id: crypto.randomUUID(),
      destination: req.body.destination,
      title: req.body.title,
      comment: req.body.comment,
      rating: req.body.rating,
      imageUrl: resultado_de_cloudinary.secure_url,
      imagePublicId: resultado_de_cloudinary.public_id
    };

    db.data.reviews.push(newReview);
    await db.write();

    res.redirect(`/reviews/${newReview.id}`);

  } catch (err) {
    console.error("Error creando reseña:", err);
    res.status(500).send("Error al crear reseña");
  }
});

/* EDIT FORM */
router.get("/:id/edit", async (req, res) => {
  await db.read();
  const review = db.data.reviews.find(r => r.id === req.params.id);
  if (!review) return res.status(404).send("Review no encontrada");
  res.render("reviews/edit", { review });
});

/* ACTUALIZAR */
router.post("/:id", upload.single("image"), async (req, res) => {
  try {
    await db.read();
    const id = req.params.id;
    const index = db.data.reviews.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).send("Review no encontrada");

    let old = db.data.reviews[index];
    let imageUrl = old.imageUrl;
    let imagePublicId = old.imagePublicId;

    if (req.file) {
      if (imagePublicId) await cloudinary.uploader.destroy(imagePublicId);
      const img = await uploadToCloudinary(req.file.buffer);
      imageUrl = img.secure_url;
      imagePublicId = img.public_id;
    }

    db.data.reviews[index] = {
      ...old,
      destination: req.body.destination,
      title: req.body.title,
      comment: req.body.comment,
      rating: req.body.rating,
      imageUrl,
      imagePublicId
    };

    await db.write();

    res.redirect(`/reviews/${id}`);

  } catch (err) {
    console.error("Error actualizando:", err);
    res.status(500).send("Error al actualizar");
  }
});

/* DELETE */
router.post("/:id/delete", async (req, res) => {
  try {
    await db.read();

    const id = req.params.id;
    const index = db.data.reviews.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).send("Review no encontrada");

    const pubId = db.data.reviews[index].imagePublicId;

    if (pubId) await cloudinary.uploader.destroy(pubId);

    db.data.reviews.splice(index, 1);
    await db.write();

    res.redirect("/reviews");

  } catch (err) {
    console.error("Error eliminando:", err);
    res.status(500).send("Error al eliminar");
  }
});

export default router;
