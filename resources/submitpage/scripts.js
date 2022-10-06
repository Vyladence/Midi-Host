function copyLink(div) {
	fileName = div.dataset.link
	alert = document.getElementById(fileName+"copyAlert")

	windowUri = window.location.href
	if (windowUri.slice(-1) != "/") {
		windowUri += "/"
	}

	navigator.clipboard.writeText(window.location.href+"download/"+fileName)
	.then(alert.style.transition="100ms", alert.style.opacity="100%")
	.then(setTimeout(() => { alert.style.transition="1000ms", alert.style.opacity="0%"; }, 2000));
}

function changeText(file) {
	FileButton = document.getElementById("fileUploadButton")
	submitButton = document.getElementById("fuckinsenditbutton")
	console.log(file[0].name)

	FileButton.getElementsByTagName("a")[0].textContent=file[0].name
	submitButton.disabled = false
}