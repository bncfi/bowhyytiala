//const { Tone } = require("tone/build/esm/core/Tone");

//const { Tone } = require("tone/build/esm/core/Tone");



const sounds =  ['MaxV - Conga Hi.wav', 'MaxV - Conga Lo.wav', 'MaxV - Conga Mi.wav',
    'MaxV - Tom Hi.wav', 'MaxV - Tom Lo.wav', 'MaxV - Tom Mi.wav', 'MaxV - Kick2.wav', 'MaxV - Kick1.wav','MaxV - Snare1.wav', 'MaxV - Snare2.wav'];

function addPlayers(soundArray, kit) {
    for(let i=0; i < soundArray.length; i++) {
        kit.add("kit"+i,"sounds/"+soundArray[i]);
        kit.player("kit"+i).connect(pitchShift);
        kit.player("kit"+i).connect(panner);
        //kit.player("kit"+i).connect(shift);
        //kit.player("kit"+i).connect(vibrato);
        //kit.player("kit"+i).connect(autoPanner);
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  

const pitchShift = new Tone.PitchShift(4).toDestination();
const autoPanner = new Tone.AutoPanner("4n").toDestination();
const panner = new Tone.Panner(1).toDestination();
//const shift = new Tone.FrequencyShifter(42).toDestination();
const vibrato = new Tone.Vibrato(3).toDestination();


const loop = new Tone.Loop((time)=> {
    var randomPlayer = "kit"+Math.floor(Math.random()*sounds.length);
    kit.player(randomPlayer).start();
    loop.interval = getRandomArbitrary(0.3,0.7);
    pitchShift.pitch = Math.floor(Math.random()*36);
    //shift.frequency = getRandomArbitrary(-400,400);
    panner.pan.setValueAtTime(getRandomArbitrary(-1,1), 0.25);    
    //console.log(loop);
}, Math.random()).start(0);


var kit = new Tone.Players({}).toDestination();
addPlayers(sounds, kit);

var plantIco = document.getElementById('plantIco');
var matchIco = document.getElementById('matchIco');


async function startAudio() {
    try {
        plantIco.style.display = "none";
        matchIco.style.display = "block";
        await Tone.start()
        Tone.loaded().then(()=> {
            Tone.Transport.start();
        });
        console.log('audio and transport on')
    }catch(err) {
        console.log("Error: ", err.message)
    }
};

function stopAudio() {
    plantIco.style.display = "block";
    matchIco.style.display = "none";
    Tone.Transport.stop();
	console.log('audio and transport off')
}

function consoleLogMouse() {
    console.log("mouseclick");
}
function consoleLogTouch() {
    console.log("touchstart");
}

var el = document.getElementById("container");
console.log(el);
el.addEventListener("ontouchstart",consoleLogTouch,false);
el.addEventListener("click",consoleLogMouse,false);





