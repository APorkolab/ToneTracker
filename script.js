let generatedColor;
let startTime;
let score = 0;
let tipCount = 0;
let timerInterval;
let computerTipCount = 0;
let isGameActive = false;

document.getElementById('colorInput').addEventListener('input', function () {
	if (!isGameActive) return;
	let userColor = '#' + document.getElementById('colorInput').value.replace('#', '');
	if (isValidHexColor(userColor)) {
		document.getElementById('userColor').style.backgroundColor = userColor;
	}
});

function startTimer() {
	if (timerInterval) {
		clearInterval(timerInterval);
	}
	timerInterval = setInterval(function () {
		let elapsedTime = Math.floor((Date.now() - startTime) / 1000);
		document.getElementById('timer').textContent = formatTime(elapsedTime);
	}, 1000);
}

document.getElementById('colorAdjust').addEventListener('input', function () {
	if (!isGameActive) return;
	let userColor = document.getElementById('colorAdjust').value.replace('#', '');
	if (isValidHexColor(userColor)) {
		document.getElementById('colorInput').value = userColor;
		document.getElementById('userColor').style.backgroundColor = '#' + userColor;

		let feedbackMessage = compareColors(userColor, generatedColor);
		document.getElementById('feedback').textContent = feedbackMessage;

		updateComponentButtonsState(userColor);
	}
});

document.getElementById('plusRedButton').addEventListener('click', function () {
	adjustColor('r', 1);
});

document.getElementById('minusRedButton').addEventListener('click', function () {
	adjustColor('r', -1);
});

document.getElementById('plusGreenButton').addEventListener('click', function () {
	adjustColor('g', 1);
});

document.getElementById('minusGreenButton').addEventListener('click', function () {
	adjustColor('g', -1);
});

document.getElementById('plusBlueButton').addEventListener('click', function () {
	adjustColor('b', 1);
});

document.getElementById('minusBlueButton').addEventListener('click', function () {
	adjustColor('b', -1);
});

function adjustHexColor(hex, component, value) {
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}

	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);

	switch (component) {
		case 'r':
			r = Math.min(255, Math.max(0, r + value));
			break;
		case 'g':
			g = Math.min(255, Math.max(0, g + value));
			break;
		case 'b':
			b = Math.min(255, Math.max(0, b + value));
			break;
	}

	return [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

function updateComponentButtonsState(hex) {
	let r = parseInt(hex.substring(0, 2), 16);
	let g = parseInt(hex.substring(2, 4), 16);
	let b = parseInt(hex.substring(4, 6), 16);

	document.getElementById('plusRedButton').disabled = r >= 255;
	document.getElementById('minusRedButton').disabled = r <= 0;

	document.getElementById('plusGreenButton').disabled = g >= 255;
	document.getElementById('minusGreenButton').disabled = g <= 0;

	document.getElementById('plusBlueButton').disabled = b >= 255;
	document.getElementById('minusBlueButton').disabled = b <= 0;
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
			guess = "#FFFFFF";
			break;
	}

	document.getElementById('colorInput').value = guess.replace('#', '');
	document.getElementById('userColor').style.backgroundColor = guess;
	document.getElementById('feedback').textContent = randomMessage.text;
	computerTipCount--;
	updateTipButton();
}

function generateCloseColor() {
	let offset = Math.floor(Math.random() * 20) - 10; // Kis eltérés +/- 10
	let r = Math.min(255, Math.max(0, parseInt(generatedColor.substring(1, 3), 16) + offset));
	let g = Math.min(255, Math.max(0, parseInt(generatedColor.substring(3, 5), 16) + offset));
	let b = Math.min(255, Math.max(0, parseInt(generatedColor.substring(5, 7), 16) + offset));

	return `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`;
}

function endGame(isCorrect) {
	clearInterval(timerInterval);
	isGameActive = false;

	if (isCorrect) {
		document.getElementById('feedback').textContent = "Gratulálok! Eltaláltad!";
		playSound('correct'); // Játékélmény növelése hanggal
	} else {
		document.getElementById('feedback').textContent = "Sajnálom, nem találtad el.";
		playSound('wrong'); // Játékélmény növelése hanggal
	}

	document.getElementById('correctColorCode').textContent = generatedColor;

	if (typeof $ !== 'undefined' && $.fn.modal) {
		$('#resultModal').modal('show');
	} else {
		alert("A helyes színkód: " + generatedColor);
	}

	document.querySelector(".btn-primary").disabled = true;
	document.querySelector(".btn-warning").disabled = true;
	document.querySelectorAll(".btn-secondary").forEach(btn => btn.disabled = true);
}

function checkColor() {
	if (!isGameActive) return;

	let userColor = '#' + document.getElementById('colorInput').value.replace('#', '');
	if (userColor.toUpperCase() === generatedColor) {
		endGame(true);
	} else {
		tipCount--;
		if (tipCount > 0) {
			let feedbackMessage = `Próbáld újra! Még ${tipCount} tippelési lehetőséged van. `;
			feedbackMessage += compareColors(userColor, generatedColor);
			document.getElementById('feedback').textContent = feedbackMessage;
			updateTipButton();
		} else {
			endGame(false);
		}
	}
}

function compareColors(userColor, correctColor) {
	let userLab = rgbToLab(hexToRgb(userColor));
	let correctLab = rgbToLab(hexToRgb(correctColor));

	let deltaE = deltaE76(userLab, correctLab);
	let percentage = Math.max(0, 100 - (deltaE / 2.3) * 100); // Normalizálás 0-100%-ra
	let feedbackText = `A tipp ${percentage.toFixed(2)}%-ban helyes.`;

	if (percentage > 90) {
		feedbackText += " Nagyon közel vagy!";
	} else if (percentage > 70) {
		feedbackText += " Jó úton haladsz!";
	} else if (percentage > 50) {
		feedbackText += " Nem rossz, de még dolgoznod kell rajta.";
	} else {
		feedbackText += " Eléggé eltértél a helyes színtől.";
	}

	return feedbackText;
}

function hexToRgb(hex) {
	let bigint = parseInt(hex.replace('#', ''), 16);
	let r = (bigint >> 16) & 255;
	let g = (bigint >> 8) & 255;
	let b = bigint & 255;
	return {
		r,
		g,
		b
	};
}

function rgbToLab(rgb) {
	let xyz = rgbToXyz(rgb.r, rgb.g, rgb.b);
	return xyzToLab(xyz.x, xyz.y, xyz.z);
}

function rgbToXyz(r, g, b) {
	r = r / 255;
	g = g / 255;
	b = b / 255;

	r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
	g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
	b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

	r *= 100;
	g *= 100;
	b *= 100;

	let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
	let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
	let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

	return {
		x,
		y,
		z
	};
}

function xyzToLab(x, y, z) {
	x /= 95.047;
	y /= 100.000;
	z /= 108.883;

	x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

	let l = (116 * y) - 16;
	let a = 500 * (x - y);
	let b = 200 * (y - z);

	return {
		l,
		a,
		b
	};
}

function deltaE76(lab1, lab2) {
	return Math.sqrt(
		Math.pow(lab1.l - lab2.l, 2) +
		Math.pow(lab1.a - lab2.a, 2) +
		Math.pow(lab1.b - lab2.b, 2)
	);
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
	return Math.max(0, baseScore - time);
}

function startGame() {
	if (isGameActive) return; // Ha a játék már aktív, ne indítsuk újra
	clearInterval(timerInterval); // Több időzítő indításának megelőzése, ha már volt aktív időzítő
	isGameActive = false;
	generatedColor = generateRandomColor();

	document.getElementById('randomColor').style.backgroundColor = generatedColor;
	document.getElementById('randomColor').textContent = 'Memorizáld a színt!';

	// Visszaszámlálás a játék kezdetéig
	setTimeout(() => {
		document.getElementById('randomColor').style.backgroundColor = '#FFFFFF';
		document.getElementById('randomColor').textContent = '';
		isGameActive = true;
		playSound('start');

		// Gombok engedélyezése csak a játék kezdetén
		document.querySelector(".btn-primary").disabled = false;
		document.querySelector(".btn-warning").disabled = false;
		document.querySelectorAll(".btn-secondary").forEach(btn => btn.disabled = false);
	}, 3000);

	// Gombok tiltása a játék kezdetéig
	document.querySelector(".btn-primary").disabled = true;
	document.querySelector(".btn-warning").disabled = true;
	document.querySelectorAll(".btn-secondary").forEach(btn => btn.disabled = true);

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
}

function playSound(type) {
	let sound;
	try {
		switch (type) {
			case 'correct':
				sound = new Audio('correct.mp3');
				break;
			case 'wrong':
				sound = new Audio('wrong.mp3');
				break;
			case 'start':
				sound = new Audio('start.mp3');
				break;
		}
		if (sound) {
			sound.play();
		} else {
			console.warn("Hangfájl nem található: ", type);
			document.getElementById('feedback').textContent = "Hiba történt a hang lejátszása közben.";
		}
	} catch (error) {
		console.error("Hangfájl hiba: ", error);
		// Alternatív vizuális visszajelzés
		document.getElementById('feedback').style.color = "red";
	}
}

function adjustColor(component, value) {
	if (!isGameActive) return;
	let currentColor = document.getElementById('colorInput').value.replace('#', '');
	if (!isValidHexColor(currentColor)) {
		currentColor = "000000";
		document.getElementById('feedback').textContent = "Érvénytelen színkód, alapértelmezettre állítva.";
	}
	let adjustedColor = adjustHexColor(currentColor, component, value);
	document.getElementById('colorInput').value = adjustedColor;
	document.getElementById('userColor').style.backgroundColor = '#' + adjustedColor;
	document.getElementById('colorAdjust').value = '#' + adjustedColor;

	let feedbackMessage = compareColors(adjustedColor, generatedColor);
	document.getElementById('feedback').textContent = feedbackMessage;

	updateComponentButtonsState(adjustedColor);
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
	timeString += secondsLeft + ' másodperc';

	return timeString;
}

function isValidHexColor(hex) {
	return /^#?[0-9A-F]{6}$/i.test(hex);
}