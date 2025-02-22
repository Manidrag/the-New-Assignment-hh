const express = require("express");
const app = express();
const { Generatetoken, Authenticator } = require("./TheMiddleware");
const { User, Note } = require("../Database/schema.js");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
require('dotenv').config();
app.use(cors());
app.use(express.json());
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage for image and audio files separately
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "image") {
      cb(null, "uploads/images"); // Folder for images
    } else if (file.fieldname === "audio") {
      cb(null, "uploads/audio"); // Folder for audio files
    }
  },
  filename: function (req, file, cb) {
    // Use the current timestamp plus the original file name to avoid collisions
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders: (res, path, stat) => {
    res.set('Accept-Ranges', 'bytes');
  }
}));

app.use((err, req, res, next) => {
  if (err.status === 416) {
    res.status(416).send('Range Not Satisfiable');
  } else {
    next(err);
  }
});

// Use upload.fields to handle multiple file fields:
app.post(
  "/notes/add",
  Authenticator,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  async function (req, res) {
    try {
      // Ensure required fields exist
      if (!req.body.title || !req.body.text) {
        return res.status(400).json({ message: "Title and text are required" });
      }

      const imagePath = req.files?.image
        ? req.files.image[0].path.replace(/\\/g, "/")
        : null;
      const audioPath = req.files?.audio
        ? req.files.audio[0].path.replace(/\\/g, "/")
        : null;

      const note = new Note({
        title: req.body.title,
        text: req.body.text,
        transcription: req.body.transcription,
        image: imagePath ? `http://localhost:3000/${imagePath}` : null, // Set to `null` if no image
        audio: audioPath ? `http://localhost:3000/${audioPath}` : null, // Set to `null` if no audio
        user: req.data.email, // Ensure user is set correctly
      });
      await note.save();
      res.json({ message: "Note added", note });
    } catch (e) {
      console.error("Error creating note:", e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

app.post("/signup", async function (req, res) {
  if (req.body.email && req.body.password) {
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      const user = new User({
        email: req.body.email,
        password: await bcryptjs.hash(req.body.password, 13),
        profile: req.body.name
      });
      await user.save();
      res.json({ message: "user created" });
    } else {
      res.json({ message: "Use another email" });
    }
  }
});

app.post("/login", async function (req, res) {
  if (req.body.email) {
    const datass = await User.findOne({ email: req.body.email });
    if (datass) {
      if (await bcryptjs.compare(req.body.password, datass.password)) {
        const tkn = Generatetoken(req.body.email);
        res.json({ message: "login success", token: tkn, name: datass.profile});
      } else {
        res.json({ message: "login failed not correct email or password" });
      }
    } else {
      res.json({ message: "user not found" });
    }
  }
});

app.get("/notes", Authenticator, async function (req, res) {
  try {
    const notes = await Note.find({ user: req.data.email });
    
    const updatedNotes = notes.map((note) => ({
      ...note._doc,
      image: note.image ? note.image : null,
      audio: note.audio ? note.audio : null,
    }));
     
     
    res.json(updatedNotes);
  } catch (e) {
    console.error("Error fetching notes:", e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/notes/favourite/:id", Authenticator, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { favourite: true },
      { new: true }
    );
    res.json({ message: "Note marked as favourite", note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/notes/unfavourite/:id", Authenticator, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { favourite: false },
      { new: true }
    );
    res.json({ message: "Note removed from favourites", note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/notes/favourites/:user", Authenticator, async (req, res) => {
  try {
    const favNotes = await Note.find({
      user: req.params.user,
      favourite: true,
    });
    res.json(favNotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put(
  "/notes/:id",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "audio", maxCount: 1 },
  ]),
  async function (req, res) {
    try {
      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }

      const updateFields = {
        title: req.body.title || note.title,
        text: req.body.text || note.text,
        transcription: req.body.transcription || note.transcription,
      };

      if (req.files?.image) {
        updateFields.image = `http://localhost:3000/${req.files.image[0].path.replace(
          /\\/g,
          "/"
        )}`;
      }

      if (req.files?.audio) {
        updateFields.audio = `http://localhost:3000/${req.files.audio[0].path.replace(
          /\\/g,
          "/"
        )}`;
      }

      note = await Note.findByIdAndUpdate(req.params.id, updateFields, {
        new: true,
      });

      res.json({ message: "Note updated", note });
    } catch (e) {
      console.error("Error updating note:", e);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

app.delete("/notes/:id", async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted", note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(process.env.PORT||3000, function () {
  console.log("server is running");
});