

const spoken_result = document.getElementById('spoken_result'); //text area v katerega vpisujemo 
var field_idx = 0
var ans_type = null;

function init() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
        let speech = {
            enabled: true,
            listening: false,
            recognition: new window.SpeechRecognition(),
            text: ''
        }
        speech.recognition.continuous = true; // true - To allow to continously listen , false - to speed up
        speech.recognition.interimResults = true; // To return interim results to a transcript area
        speech.recognition.lang = 'sl-SI'; // language set to slovenian
        
        //The result event of the Web Speech API is fired when the speech recognition service returns a result — a word or phrase has been positively recognized and this has been communicated back to the app
        speech.recognition.addEventListener('result', (event) => {
            const audio = event.results[event.results.length - 1];
            speech.text = audio[0].transcript;
            console.log(speech.text);
                
            const tag = document.activeElement.nodeName;
            document.getElementById('isFinal').innerText = audio.isFinal;
            console.log(audio);
            if (audio.isFinal){
                if(ans_type == null){
                    spoken_result.value += speech.text
                    console.log(spoken_result.value)
                    console.log("##############################################                  ")
                    if (speech.text.search("izbriši") > -1){
                        console.log("IZBRISI TEXT");
                        spoken_result.value = "";
                        
                    } else if (speech.text.search("naprej") > -1) {
                        console.log("NAPREJ");
                        addAnswerJSON(spoken_result.value.replace("naprej", ""));
                    }
                } else if (Array.isArray(ans_type)){
                    ans_type.forEach((item) => {
                        if (speech.text.includes(item.toLowerCase())){
                            addAnswerJSON(item)
                        }
                    });
                } else {
                    console.log("ERROR: wrong ans_type")
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

        //next button adds content in the text box to the json
        next.addEventListener('click', () => {
            answ = spoken_result.value.replace("naprej", "");
            if(answ.length < 1){
                answ = speech.text
            }
            addAnswerJSON(answ);
        })
    } else {
        document.getElementById('isFinal').innerText = "Not supported by your browser"
    }
  }

function loadQuestion(){
    field_name = json_data[field_idx].field_name;
    answer_type = json_data[field_idx].expected_answer_type; // None (vpisi text) ali pa list[str] (izberi moznost)

    console.log(field_name, answer_type);

    document.getElementById('question').innerText = field_name;
    if(Array.isArray(answer_type)){
                    
        list = document.getElementById("mozniOdgovori");
        instructions = document.createElement("label");
        instructions.innerText = "recite eno od spodnjih možnosti";
        answer_type.forEach((item) => {
            let li = document.createElement("li");
            li.innerText = item;
            list.appendChild(li);
        });
    } else {
        //izbrisi seznam moznosti, ki si (morda) napisal v prejsnjem vprasanju
        list = document.getElementById("mozniOdgovori");
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
    }
    ans_type = answer_type;
}

function addAnswerJSON(answer){
    if(answer.length < 1){
        answer = "N/A"
    }
    json_data[field_idx].answer = answer;
    console.log("-----------------answer:")
    console.log(json_data[field_idx].answer)
    spoken_result.value = "";
    field_idx += 1;
    if(field_idx >= json_data.length){
        console.log(json_data);
        return 0;
        // TODO: pojdi na naslednjo spletno stran
    }
    console.log(field_idx);
    loadQuestion(field_idx);
}

loadQuestion(field_idx);
init();