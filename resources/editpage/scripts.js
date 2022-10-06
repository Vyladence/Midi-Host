function checkFalse(string) {
	if (string == "false" || string == "") {
		return false
	} else {
		return true
	}
}

function selectSong(div) {
	songID = div.dataset.songid
	songName = div.dataset.songname
	artistName = div.dataset.artistname
	fileName = div.dataset.filename
	accordion = div.dataset.accordion
	guitar = div.dataset.guitar
	organ = div.dataset.organ
	fiddle = div.dataset.fiddle
	piano = div.dataset.piano
	harmonica = div.dataset.harmonica
	trumpet = div.dataset.trumpet
	banjo = div.dataset.banjo
	highlighted = div.dataset.highlighted
	
	songIdInputBox = document.getElementById("IDInputBox")
	songNameInputBox = document.getElementById("songNameInputBox")
	artistNameInputBox = document.getElementById("artistNameInputBox")
	fileNameInputBox = document.getElementById("fileNameInputBox")
	banjo_applicability = document.getElementById("banjo_applicability")
	fiddle_applicability = document.getElementById("fiddle_applicability")
	guitar_applicability = document.getElementById("guitar_applicability")
	organ_applicability = document.getElementById("organ_applicability")
	accordion_applicability = document.getElementById("accordion_applicability")
	piano_applicability = document.getElementById("piano_applicability")
	harmonica_applicability = document.getElementById("harmonica_applicability")
	trumpet_applicability = document.getElementById("trumpet_applicability")
	highlightedbox = document.getElementById("highlighted")

	songIdInputBox.value = songID
	songNameInputBox.value = songName
	artistNameInputBox.value = artistName
	fileNameInputBox.value = fileName

	banjo_applicability.checked = checkFalse(banjo)
	fiddle_applicability.checked = checkFalse(fiddle)
	guitar_applicability.checked = checkFalse(guitar)
	organ_applicability.checked = checkFalse(organ)
	accordion_applicability.checked = checkFalse(accordion)
	piano_applicability.checked = checkFalse(piano)
	harmonica_applicability.checked = checkFalse(harmonica)
	trumpet_applicability.checked = checkFalse(trumpet)
	highlightedbox.checked = checkFalse(highlighted)
}

function clearBoxes () {
	document.getElementById("IDInputBox").value = ""
	document.getElementById("songNameInputBox").value = ""
	document.getElementById("artistNameInputBox").value = ""
	document.getElementById("fileNameInputBox").value = ""

	document.getElementById("banjo_applicability").checked = false
	document.getElementById("fiddle_applicability").checked = false
	document.getElementById("guitar_applicability").checked = false
	document.getElementById("organ_applicability").checked = false
	document.getElementById("accordion_applicability").checked = false
	document.getElementById("piano_applicability").checked = false
	document.getElementById("harmonica_applicability").checked = false
	document.getElementById("trumpet_applicability").checked = false
	document.getElementById("highlighted").checked = false
}

async function deleteFile() {
	fileName = document.getElementById('fileNameInputBox').value
	deleteButton = document.getElementById("deleteButton")

	if (fileName == "") {
		deleteButton.textContent = "Select an item to delete first dipshit"
		setTimeout(() => {deleteButton.textContent = "Delete this Item"}, 2000)
	} else {
		if (deleteButton.textContent == "Are you sure? (Click to confirm)") {
			data = {
				"fileName": fileName,
			}
		
			await fetch("/delete", {
				method: 'POST',
				mode: 'cors',
				cache: 'no-cache',
				credentials: 'same-origin',
				redirect: 'follow',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data)
			})
			.then(() => { location.reload() })
		} else {
			deleteButton.textContent = "Are you sure? (Click to confirm)"
		}
	}
}

window.onload = clearBoxes