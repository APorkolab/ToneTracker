let generatedColor = generateRandomColor();
let startTime = Date.now();
let score = 0;
let tipCount;
let timerInterval;
let computerTipCount;

// Input mező eseményfigyelőjének hozzáadása
document.getElementById('colorInput').addEventListener('input', function () {
	let userColor = '#' + document.getElementById('colorInput').value.replace('#', '');
	document.getElementById('userColor').style.backgroundColor = userColor;
});

function startTimer() {
	clearInterval(timerInterval); // Előző időszámláló megszüntetése
	timerInterval = setInterval(function () {
		let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
		document.getElementById('timer').textContent = formatTime(elapsedTime);
	}, 1000);
}

function adjustColor(value) {
	let currentColor = document.getElementById('colorInput').value.replace('#', '');
	if (!currentColor || currentColor.length !== 6) {
		currentColor = "000000"; // Alapértelmezett fekete, ha a bemeneti érték nem érvényes
	}
	let adjustedColor = adjustHexColor(currentColor, value);
	document.getElementById('colorInput').value = adjustedColor;
	document.getElementById('userColor').style.backgroundColor = '#' + adjustedColor;
	document.getElementById('colorAdjust').value = '#' + adjustedColor; // Frissítjük a colorAdjust elem értékét


}

document.getElementById('colorAdjust').addEventListener('input', function () {
	let userColor = document.getElementById('colorAdjust').value.replace('#', '');
	document.getElementById('colorInput').value = userColor;
	document.getElementById('userColor').style.backgroundColor = '#' + userColor;
});


document.getElementById('plusButton').addEventListener('click', function () {
	adjustColor(1);
});

document.getElementById('minusButton').addEventListener('click', function () {
	adjustColor(-1);
});

function adjustHexColor(hex, value) {
	// Kiegészítjük a rövid színkódokat
	if (hex.length < 6) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}

	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);

	r = Math.min(255, Math.max(0, r + value)).toString(16).padStart(2, '0');
	g = Math.min(255, Math.max(0, g + value)).toString(16).padStart(2, '0');
	b = Math.min(255, Math.max(0, b + value)).toString(16).padStart(2, '0');

	return r + g + b;
}


function computerGuess() {
	if (computerTipCount <= 0) return;
	let guess;
	let messages = [{
			text: "Ez közel lehet!",
			type: "close"
		},
		{
			text: "Ez csak egy tipp, ne bízz meg benne!",
			type: "wrong"
		},
		{
			text: "Ez csak vicc volt!",
			type: "silly"
		}
	];
	let randomMessage = messages[Math.floor(Math.random() * messages.length)];

	switch (randomMessage.type) {
		case "close":
			guess = generateCloseColor();
			break;
		case "wrong":
			guess = generateRandomColor();
			break;
		case "silly":
			guess = "#FFFFFF"; // például fehér szín, ami általában nem lesz közel a generált színhez
			break;
	}

	document.getElementById('colorInput').value = guess.replace('#', '');
	document.getElementById('userColor').style.backgroundColor = guess;
	document.getElementById('feedback').textContent = randomMessage.text;
	computerTipCount--;
	updateTipButton();
}

function generateCloseColor() {
	let offset = (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 16));
	let adjustedValue = parseInt(generatedColor.slice(-2), 16) + offset;
	adjustedValue = Math.max(0, Math.min(255, adjustedValue)).toString(16).padStart(2, '0');
	return generatedColor.slice(0, -2) + adjustedValue;
}

function endGame(isCorrect) {
	clearInterval(timerInterval); // Megállítjuk az időszámlálót

	if (isCorrect) {
		document.getElementById('feedback').textContent = "Gratulálok! Eltaláltad!";
	} else {
		document.getElementById('feedback').textContent = "Sajnálom, nem találtad el.";
	}

	// Megjelenítjük a helyes színkódot a modalban
	document.getElementById('correctColorCode').textContent = generatedColor;
	$('#resultModal').modal('show'); // Bootstrap modal megjelenítése

	// Letiltjuk a gombokat
	document.querySelector(".btn-primary").disabled = true; // Ellenőrzés gomb
	document.querySelector(".btn-warning").disabled = true; // Gép tippje gomb
	document.querySelectorAll(".btn-secondary").forEach(btn => btn.disabled = true); // Plusz-mínusz gombok
}


function checkColor() {
	let userColor = '#' + document.getElementById('colorInput').value.replace('#', '');
	if (userColor.toUpperCase() === generatedColor) {
		endGame(true);
	} else {
		tipCount--;
		if (tipCount > 0) {
			document.getElementById('feedback').textContent = `Próbáld újra! Még ${tipCount} tippelési lehetőséged van.`;
			updateTipButton();
		} else {
			endGame(false);
		}
	}
}

function calculateScore(time) {
	let difficulty = document.getElementById('difficulty').value;
	let baseScore;
	switch (difficulty) {
		case 'easy':
			baseScore = 100;
			break;
		case 'medium':
			baseScore = 200;
			break;
		case 'hard':
			baseScore = 300;
			break;
	}
	return baseScore - time;
}

function startGame() {
	generatedColor = generateRandomColor();
	document.getElementById('randomColor').style.backgroundColor = generatedColor;
	document.getElementById('colorInput').value = '';
	document.getElementById('userColor').style.backgroundColor = '#FFFFFF';
	document.getElementById('feedback').textContent = '';
	startTime = Date.now();
	startTimer();
	document.getElementById('timer').textContent = '0';

	let difficulty = document.getElementById('difficulty').value;
	switch (difficulty) {
		case 'easy':
			tipCount = 3;
			computerTipCount = 3;
			break;
		case 'medium':
			tipCount = 2;
			computerTipCount = 2;
			break;
		case 'hard':
			tipCount = 1;
			computerTipCount = 1;
			break;
	}
	updateTipButton();

	// Gombok engedélyezése
	document.querySelector(".btn-primary").disabled = false; // Ellenőrzés gomb
	document.querySelector(".btn-warning").disabled = false; // Gép tippje gomb
	document.querySelectorAll(".btn-secondary").forEach(btn => btn.disabled = false); // Plusz-mínusz gombok
	document.getElementById('colorAdjust').value = generatedColor;
}

function generateRandomColor() {
	let letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function updateTipButton() {
	let tipButton = document.querySelector(".btn-warning");
	if (computerTipCount > 0) {
		tipButton.disabled = false;
		tipButton.textContent = `Gép tippje (${computerTipCount} maradt)`;
	} else {
		tipButton.disabled = true;
		tipButton.textContent = "Nincs több tipp";
	}
}


function formatTime(seconds) {
	let hours = Math.floor(seconds / 3600);
	seconds %= 3600;
	let minutes = Math.floor(seconds / 60);
	let secondsLeft = seconds % 60;

	let timeString = '';
	if (hours > 0) {
		timeString += hours + ' óra ';
	}
	if (minutes > 0 || hours > 0) {
		timeString += minutes + ' perc ';
	}
	timeString += secondsLeft;

	return timeString;
}