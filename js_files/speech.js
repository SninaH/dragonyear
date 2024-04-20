const startButton = document.getElementById('startButton');
const status = document.getElementById('status');
let ws;
let recognition;

function startRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onstart = () => {
            status.innerText = 'Speech recognition is on. Speak into the microphone.';
        };

        recognition.onresult = (event) => {
            let transcript = event.results[event.resultIndex][0].transcript;
            // Stop text-to-speech
            window.speechSynthesis.cancel();
            ws.send(transcript);
        };

        recognition.onerror = (event) => {
            status.innerText = 'Speech recognition error: ' + event.error;
        };

        recognition.onend = () => {
            recognition.start();
        };

        recognition.start();
    } else {
        status.innerText = 'Your browser does not support Web Speech API.';
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
        status.innerText = 'WebSocket disconnected.';
    };
};