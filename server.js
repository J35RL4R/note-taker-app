var express = require("express");
var path = require("path");
var fs = require("fs");
const { json } = require("body-parser");
const { v4: uuidv4 } = require('uuid');

var app = express();
var PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

var allNotes; 

fs.readFile("db/db.json", "utf8", (err,data) => {
    if (err) throw err;
    allNotes = JSON.parse(data); 
})
function updateDB(){
fs.writeFile("db/db.json", JSON.stringify(allNotes), (err, data) => {
    if (err) throw err;
})}
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
app.get("/api/notes", function(req, res){
    return res.json(allNotes);
})
app.post("/api/notes", function (req, res) {
    var newNote = req.body; 
    newNote.id = uuidv4(); 
    allNotes.push(newNote); 
    updateDB();
    res.json(newNote);
    return console.log("New Note Added")
});
app.delete("/api/notes/:id", function(req,res){
   var filteredNotes = allNotes.filter(note => note.id !== req.params.id);
   allNotes = filteredNotes;
   updateDB();
   res.json({ ok: true});
   return console.log("Note was deleted")
});
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
