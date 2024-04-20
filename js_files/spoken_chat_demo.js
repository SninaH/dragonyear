//button for starting speech recognition
const startButton = document.getElementById('startButton');
const recogn_status = document.getElementById('recogn_status');
const spoken_result = document.getElementById('spoken_result');
let ws;
let recognition;


function startRecognition() {
    if (('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.lang = "sl-SI"; //set language to slovenian
        // recognition.interimResults = false; //default je false

        recognition.onstart = () => {
            recogn_status.innerText = 'Speech recognition is on. Speak into the microphone.';
        };

        recognition.onresult = (event) => {
            let transcript = event.results[event.resultIndex][0].transcript;
            // Stop text-to-speech
            window.speechSynthesis.cancel();
            spoken_result.innerText = transcript;
            ws.send(transcript);
        };

        recognition.onerror = (event) => {
            recogn_status.innerText = 'Speech recognition error: ' + event.error;
        };

        recognition.onend = () => {
            recognition.start(); //start recording voice again automatically
        };

        recognition.start();
    } else {
        recogn_status.innerText = 'Your browser does not support Web Speech API.';
    }
}

function speakText(text) {
    let speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}

startButton.onclick = () => {
    ws = new WebSocket('wss://127.0.0.1:8000/ws');
    ws.onopen = () => {
        startRecognition();
    };
    ws.onmessage = (event) => {
        speakText(event.data);
    };
    ws.onerror = (event) => {
        console.error('WebSocket error:', event);
    };
    ws.onclose = () => {
        recognition.stop();
        recogn_status.innerText = 'WebSocket disconnected.';
    };
};

/*

// Script.js 
// Adding event listener to the form element 
document 
	.getElementById("surveyForm") 
	.addEventListener( 
		"submit", 
		function (event) { 
			// PreventDefault() is used to avoid 
			// Refreshing of browser while submit 
			event.preventDefault(); 

			let nameField = 
				document.getElementById( 
					"name"
				); 
			let ageField = 
				document.getElementById( 
					"age"
				); 
			let errorText = 
				document.getElementById( 
					"errorText"
				); 

			let name = nameField.value; 
			let age = ageField.value; 

			// Creating a regular expression for 
			// Name field 
			let Regex = /^[A-Za-z ]+$/; 

			// If name does not matches the 
			// Regular expression 
			if (!name.match(Regex)) { 
				nameField.classList.add( 
					"error"
				); 
				errorText.innerHTML = 
					`Name field should only contain 
					English alphabets and spaces`; 
				errorText.classList.add( 
					"errorText"
				); 
				return; 
			} 

			// Check whether age is between 1 and 150 
			else if ( 
				isNaN(age) || 
				age < 1 || 
				age > 150 
			) { 
				ageField.classList.add( 
					"error"
				); 
				errorText.innerHTML = 
					`Age should only contain valid 
					values ( 1 - 150 )`; 
				errorText.classList.add( 
					"errorText"
				); 
				return; 
			} 

			// Removing red border in name field 
			if ( 
				nameField.classList.contains( 
					"error"
				) 
			) 
				nameField.classList.remove( 
					"error"
				); 

			// Removing red border in age field 
			if ( 
				ageField.classList.contains( 
					"error"
				) 
			) 
				ageField.classList.remove( 
					"error"
				); 

			// Adding success message and styles 
			errorText.innerHTML = 
				"Submitted Successfully"; 
			errorText.classList.add( 
				"successText"
			); 

			const formData = 
				new FormData( 
					event.target 
				); 
			const formValues = {}; 

			// Storing each values in the object 
			formData.forEach( 
				(value, key) => { 
					formValues[key] = 
						value; 
				} 
			); 

			// Calling convert function 
			const csvContent = 
				convertToCSV( 
					formValues 
				); 
			const blob = new Blob( 
				[csvContent], 
				{ type: "text/csv" } 
			); 

			// Creating a link for downloading 
			// Excel sheet 
			const link = 
				document.createElement( 
					"a"
				); 
			link.href = 
				window.URL.createObjectURL( 
					blob 
				); 
			link.download = 
				"survey_data.csv"; 
			link.click(); 

			// Reseting the form after certain 
			// Timeout 2000ms => 2s 
			setTimeout( 
				document 
					.getElementById( 
						"surveyForm"
					) 
					.reset(), 
				2000 
			); 
		} 
	); 

// Function to convert object to csv 
function convertToCSV(objArr) { 
	const array = 
		typeof objArr !== "object"
			? JSON.parse(objArr) 
			: objArr; 
	let result = ""; 

	// Add commas to make it as csv 
	const header = 
		Object.keys(array).join(",") + 
		"\n"; 
	result += header; 

	for (const item in array) { 
		if ( 
			array.hasOwnProperty(item) 
		) { 
			result += array[item] + ","; 
		} 
	} 
	result = result.slice(0, -1); 
	result += "\n"; 

	return result; 
}

*/