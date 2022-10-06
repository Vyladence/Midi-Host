const express = require('express')
const fileUpload = require("express-fileupload");
const sqlite3 = require('sqlite3')
const path = require('path')
const fs = require('fs');
const { resolve } = require('path');
const app = express()

app.listen(8080);
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(fileUpload({
	useTempFiles : true,
    tempFileDir : '/tmp/'
}));

try {
	let db = new sqlite3.Database("./data/midi_files.db", (err) => {
		if (err) {console.error(err.message)}
	});
} catch {
	// TODO - Create database if it does not exist
}

function capitalize(string) {
	doNotCapitalize = ["the", "and", "as", "if", "at", "but", "by", "for", "from", "if", "in", "of", "once", "onto", "or", "over", "past", "so", "than", "that", "till", "to", "up", "upon", "with", "when", "yet"]
	string = string.trim()
	strArr = string.split(" ")

	for (var i = 0; i < strArr.length; i++) {
		if (!doNotCapitalize.includes(strArr[i].toLowerCase()) || i == 0 || i == strArr.length-1) {
			strArr[i] = strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1);
		} else {
			strArr[i] = strArr[i].toLowerCase();
		}
	}
	output = strArr.join(" ")
	return output
}

app.get(["/"], async (req, res) => {
	async function queryDatabase() {
		return new Promise((resolve, reject) => {
			db.all(`SELECT * FROM files ORDER BY Friendly_Name ASC`,(err, row) => {
				if (err) reject(err);
				resolve(row)
			})
		})
	}
	output = await queryDatabase()

	const data = output.map((files) => ({
		Name: files.Friendly_Name,
		Artist: files.Artist_Name,
		FileName: encodeURI(files.File_Name),
		Accordion_Applicability: Boolean(files.Accordion),
		Guitar_Applicability: Boolean(files.Guitar),
		Organ_Applicability: Boolean(files.Organ),
		Fiddle_Applicability: Boolean(files.Fiddle),
		Piano_Applicability: Boolean(files.Piano),
		Harmonica_Applicability: Boolean(files.Harmonica),
		Trumpet_Applicability: Boolean(files.Trumpet),
		Banjo_Applicability: Boolean(files.Banjo),
		Highlight: Boolean(files.Highlight)
	}));

	res.render("main", {
		data
	});
});

app.get(["/edit"], async (req, res) => {
	async function queryDatabase() {
		return new Promise((resolve, reject) => {
			db.all(`SELECT * FROM files ORDER BY Friendly_Name ASC`,(err, row) => {
				if (err) reject(err);
				resolve(row)
			})
		})
	}
	output = await queryDatabase()

	const data = output.map((files) => ({
		ID: files.ID,
		Name: files.Friendly_Name,
		Artist: files.Artist_Name,
		FileName: files.File_Name,
		Accordion_Applicability: Boolean(files.Accordion),
		Guitar_Applicability: Boolean(files.Guitar),
		Organ_Applicability: Boolean(files.Organ),
		Fiddle_Applicability: Boolean(files.Fiddle),
		Piano_Applicability: Boolean(files.Piano),
		Harmonica_Applicability: Boolean(files.Harmonica),
		Trumpet_Applicability: Boolean(files.Trumpet),
		Banjo_Applicability: Boolean(files.Banjo),
		Highlight: Boolean(files.Highlight)
	}));

	res.render("edit", {
		data
	});
});

app.post(["/edit"], async (req, res) => {
	songID = req.body["songId"].trim()
	songName = req.body["songName"].trim()
	artistName = req.body["artistName"].trim()
	oldFileName = req.body["fileName"].trim()

	if (req.body["banjo_applicability"]) {banjo_applicability = 1} else {banjo_applicability = 0}
	if (req.body["fiddle_applicability"]) {fiddle_applicability = 1} else {fiddle_applicability = 0}
	if (req.body["guitar_applicability"]) {guitar_applicability = 1} else {guitar_applicability = 0}
	if (req.body["organ_applicability"]) {organ_applicability = 1} else {organ_applicability = 0}
	if (req.body["accordion_applicability"]) {accordion_applicability = 1} else {accordion_applicability = 0}
	if (req.body["piano_applicability"]) {piano_applicability = 1} else {piano_applicability = 0}
	if (req.body["harmonica_applicability"]) {harmonica_applicability = 1} else {harmonica_applicability = 0}
	if (req.body["trumpet_applicability"]) {trumpet_applicability = 1} else {trumpet_applicability = 0}
	
	if (req.body["highlighted"]) {highlighted = 1} else {highlighted = 0}

	await db.all(`SELECT * FROM files WHERE ID = ${songID}`, (err, entry) => {
		db.run(`UPDATE files SET Friendly_Name = ? WHERE ID = ${songID}`, [songName], (err))
		db.run(`UPDATE files SET Artist_Name = ? WHERE ID = ${songID}`, [artistName], (err))
		db.run(`UPDATE files SET Accordion = ? WHERE ID = ${songID}`, [accordion_applicability], (err))
		db.run(`UPDATE files SET Guitar = ? WHERE ID = ${songID}`, [guitar_applicability], (err))
		db.run(`UPDATE files SET Organ = ? WHERE ID = ${songID}`, [organ_applicability], (err))
		db.run(`UPDATE files SET Fiddle = ? WHERE ID = ${songID}`, [fiddle_applicability], (err))
		db.run(`UPDATE files SET Piano = ? WHERE ID = ${songID}`, [piano_applicability], (err))
		db.run(`UPDATE files SET Harmonica = ? WHERE ID = ${songID}`, [harmonica_applicability], (err))
		db.run(`UPDATE files SET Trumpet = ? WHERE ID = ${songID}`, [trumpet_applicability], (err))
		db.run(`UPDATE files SET Banjo = ? WHERE ID = ${songID}`, [banjo_applicability], (err))
		db.run(`UPDATE files SET Highlight = ? WHERE ID = ${songID}`, [highlighted], (err))
	})

	if (fs.existsSync("./data/Midi_Files" + oldFileName)) {
		return res.send("Unable to rename, a file with that name already exists.")
	} else {
		fs.renameSync("./data/Midi_Files/"+oldFileName, "./data/Midi_Files/"+songName+" - "+artistName+".mid")
		await db.all(`SELECT * FROM files WHERE ID = ${songID}`, (err, entry) => {
			db.run(`UPDATE files SET File_Name = ? WHERE ID = ${songID}`, [songName+" - "+artistName+".mid"], (err))
		})
	}

	/////

	res.redirect("back")
})

app.get(["/resources/*"], async (req, res) => {
	urlArray = req.originalUrl.split("/")
	urlArray.splice(0,2)
	
	fileName = urlArray.join("/")

	var options = {
		root: path.join(__dirname)
	};
    
	res.sendFile(`./resources/${fileName}`, options)
});

app.get(["/submit"], async (req, res) => {
	res.render("submit")
});

app.post(["/submit"], async (req, res) => {
	if (!req.files) {
		res.status(400).send("No file uploaded!")
		return
	}

	songName = capitalize(req.body["songName"]).trim()
	artistName = capitalize(req.body["artistName"]).trim()
	file = req.files.midiFile

	if (req.body["banjo_applicability"]) {banjo_applicability = 1} else {banjo_applicability = 0}
	if (req.body["fiddle_applicability"]) {fiddle_applicability = 1} else {fiddle_applicability = 0}
	if (req.body["guitar_applicability"]) {guitar_applicability = 1} else {guitar_applicability = 0}
	if (req.body["organ_applicability"]) {organ_applicability = 1} else {organ_applicability = 0}
	if (req.body["accordion_applicability"]) {accordion_applicability = 1} else {accordion_applicability = 0}
	if (req.body["piano_applicability"]) {piano_applicability = 1} else {piano_applicability = 0}
	if (req.body["harmonica_applicability"]) {harmonica_applicability = 1} else {harmonica_applicability = 0}
	if (req.body["trumpet_applicability"]) {trumpet_applicability = 1} else {trumpet_applicability = 0}

	currentPath = __dirname + "/data/Midi_Files/"
	betterFileName = songName + " - " + artistName + "." + file.name.split(".")[file.name.split(".").length-1]

	if (fs.existsSync(currentPath + file.name)) {
		return res.send("A file by that name already exists!")
	}

	async function songID () {
		return new Promise((resolve, reject) => {
			db.all(`SELECT * FROM files ORDER BY ID DESC LIMIT 1`, [], (err, entry) => {
				if (err) {return res.status(500).send(err)}
				resolve(entry[0]["ID"] + 1)
			})
		})
	}

	newSongID = await songID()

	db.run(`INSERT INTO files(ID, Friendly_Name, Artist_Name, File_Name, Accordion, Guitar, Organ, Fiddle, Piano, Harmonica, Trumpet, Banjo, Highlight) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`, 
		[newSongID, songName, artistName, betterFileName, accordion_applicability, guitar_applicability, organ_applicability, fiddle_applicability, piano_applicability, harmonica_applicability, trumpet_applicability, banjo_applicability], (err) => {
			if (err) {throw err}
		}
	)
	
	file.mv(currentPath + file.name, (err) => {
		if (err) {
			return res.status(500).send(err)
		}
		fs.rename(currentPath + file.name, currentPath + betterFileName, () => {} )
	})

	res.send({status: "success"})
})

app.get(["/files/*"], async (req, res) => {
	urlArray = req.originalUrl.split("/")
	urlArray.splice(0,2)
	
	fileName = decodeURI(urlArray.join("/"))
	
	var options = {
		root: path.join(__dirname)
	};
    
	res.sendFile(`./data/Midi_Files/${fileName}`, options)

	console.log("Request for: " + fileName)
});


app.post(["/delete"], async (req, res) => {
	fileName = req.body["fileName"]
	
	db.all(`DELETE FROM files WHERE File_Name = ?`, [fileName])
	fs.unlink("./data/Midi_Files/"+fileName, (err) => {
		if (err) throw err;
	})

	res.end()
})
