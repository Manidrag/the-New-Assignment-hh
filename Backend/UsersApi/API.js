// hhhhhhh
const express = require("express");
const app = express();
const { Generatetoken, Authenticator } = require("./TheMiddleware");
const { User, Note } = require("../Database/schema.js");
const jwt = require("jsonwebtoken");
const cors=require("cors")
app.use(cors());
app.use(express.json());

app.post("/signup", function (req, res) {
  req.body.email;
  req.body.password;
  if (req.body.email && req.body.password) {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
    });
    user.save().then(() => {
      res.json({ message: "user created" });
    });
  }
});//b
app.post("/login", async function (req, res) {
  if (req.body.email) {
    const datass=await User.findOne({email:req.body.email})
      if (datass) {
        if (datass.password === req.body.password) {
          const tkn = Generatetoken(req.body.email);
        
          res.json({ message: "login success", token: tkn });
        }
       else {
        res.json({ message: "login failed not correct email or password" });
      }
    }
}
    else {
      res.json({ message: "user not found" });
    }   
    });

app.post("/notes/add", Authenticator,async function (req, res) {
  try { 
    const note = new Note({
      title: req.body.title,
      text: req.body.text,
      transcription: req.body.transcription,
      image: req.body.image,
      audio: req.body.audio,
      user: req.data,
    });
    note.save().then(() => {
      res.json({ message: "note added" });
    });
  } catch (e) {
    res.json({ message: e.message });
  }
});
app.get("/notes",Authenticator,async function (req, res) {
  try {
    const notes = await Note.find({ user: req.data });
   
    res.set("Content-Type", "image/jpeg","audio/mp3"); 
    res.json(notes);
  } catch (e) {
    res.json({ message: e.message });
  }
});
app.post("/notes/favourite/:id",Authenticator, async (req, res) => {
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
app.post("/notes/unfavourite/:id",Authenticator, async (req, res) => {
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

app.get("/notes/favourites/:user",Authenticator, async (req, res) => {
  try {
    const favNotes = await Note.find({ user: req.params.user, favourite: true });
    res.json(favNotes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
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

app.get("/notes/:title", Authenticator, async function (req, res) {
    try {
        const note = await Note.findOne({ title: req.params.title });
        res.json(note);
    } catch (e) {   
        res.json({ message: e.message });}})

        app.delete("/notes/:_id", Authenticator, async function (req, res) {
            try {
                await Note.deleteOne({ _id: req.params._id });
                res.json({ message: "note deleted" });
            } catch (e) {
                res.json({ message: e.message });
            }
        });

        app.put("/notes/:_id", Authenticator, async function (req, res) {
            try {
                await Note.updateOne({ _id: req.params._id }, { $set: req.body });
                res.json({ message: "note updated" });
            } catch (e) {
                res.json({ message: e.message });
            }
        });


app.listen(3000, function () {
  console.log("server is running");
});


