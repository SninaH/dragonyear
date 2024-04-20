

const spoken_result = document.getElementById('spoken_result'); //text area v katerega vpisujemo 
const JSONfileName = "image"
var field_idx = 0

function init() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      let speech = {
        enabled: true,
        listening: false,
        recognition: new window.SpeechRecognition(),
        text: ''
      }
      speech.recognition.continuous = true; // To allow to continously listen
      speech.recognition.interimResults = true; // To return interim results to a transcript area
      speech.recognition.lang = 'sl-SI'; // language set to slovenian
      
      //The result event of the Web Speech API is fired when the speech recognition service returns a result — a word or phrase has been positively recognized and this has been communicated back to the app
      speech.recognition.addEventListener('result', (event) => {
        const audio = event.results[event.results.length - 1];
        speech.text = audio[0].transcript;
        console.log(speech.text);
        
        const tag = document.activeElement.nodeName;
        if (audio.isFinal){
            if (tag === 'INPUT' || tag === 'TEXTAREA') {
            
                document.activeElement.value += speech.text;
            
            }
            
                spoken_result.value += speech.text
                console.log(spoken_result.value)
                console.log("##############################################                  ")
                if (speech.text.search("izbriši") > -1){
                    console.log("IZBRISI TEXT");
                    spoken_result.innerText = "";
                    console.log(audio);
                }
        }
        
        result.innerText = speech.text;
      });
  
      toggle.addEventListener('click', () => {
        speech.listening = !speech.listening;
        if (speech.listening) {
          toggle.classList.add('listening');
          toggle.innerText = 'Listening ...';
          speech.recognition.start();
        }
        else {
          toggle.classList.remove('listening');
          toggle.innerText = 'Toggle listening';
          speech.recognition.stop();
        }
      })
    }
  }

function loadQuestion(field_idx){
    field_name = json_data[field_idx].field_name;
    answer_type = json_data[field_idx].expected_answer_type; // None (vpisi text) ali pa list[str] (izberi moznost)

    console.log(field_name, answer_type);

    return [field_name, answer_type]; 
}

function addAnswerJSON(field_idx, answer){
    json_data[field_idx].answer = answer;
}


init();