function copyLink(div) {
	fileName = div.dataset.filename
	alert = document.getElementById(fileName+"copyAlert")

	windowUri = window.location.href
	if (windowUri.slice(-1) != "/") {
		windowUri += "/"
	}

	navigator.clipboard.writeText(window.location.href+"files/"+fileName)
	.then(alert.style.transition="100ms", alert.style.opacity="100%")
	.then(setTimeout(() => { alert.style.transition="1000ms", alert.style.opacity="0%"; }, 2000));
}

function toggleColorblindMode (value = false) {
	enabledIntruments = document.querySelectorAll('.instrumentEnabled')
	
	for (x in enabledIntruments) {
		if (enabledIntruments[x].src) {
			if (value) {
				enabledIntruments[x].style.filter = "saturate(15)"
			} else {
				enabledIntruments[x].style.filter = ""
			}
		}
	}
}

function toggleNarrowMode (value = false) {
	listContainer = document.getElementById("listContainer")
	
	if (value) {
		listContainer.style.width = "1000px"
	} else {
		listContainer.style.width = ""
	}
}

function showSwitchLabel (visible = false, element = "") {
	if (visible) {
		document.getElementById(element).style.transform = "translateX(0px)"
		document.getElementById(element).style.opacity = "100%"
	} else {
		document.getElementById(element).style.transform = ""
		document.getElementById(element).style.opacity = "0%"
	}
}

function switchesLoad () {
	colorblindCheckbox = document.getElementById("colorblindCheckbox")
	toggleColorblindMode(colorblindCheckbox.checked)

	narrowCheckbox = document.getElementById("narrowCheckbox")
	toggleNarrowMode(narrowCheckbox.checked)
}

window.onload = switchesLoad