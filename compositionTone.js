//const { Tone } = require("tone/build/esm/core/Tone");

//const { Tone } = require("tone/build/esm/core/Tone");

//const { Tone } = require("tone/build/esm/core/Tone");


//DEBUG & FUNCTIONS

window.addEventListener("load", midiToPart);

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

//VARIABLES

let playState = false;
var animationState = false;
var part;


//AUDIO


const sounds =  ['Bass1.wav', 'Bass2.wav', 'Bass3.wav',
    'Bass4.wav', 'Bass5.wav', 'Bass6.wav', 'Bass7.wav',
    'Bass8.wav', 'Bass9.wav', 'Bass10.wav', 'Bass11.wav',
    'Bass12.wav', 'Bass13.wav', 'Snare1.wav', 'Tom1.wav',
    'Tom2.wav', 'Tom3.wav', 'Tom4.wav', 'Tom5.wav', 'Tom6.wav'];


function addPlayers(soundArray, kit) {
    for(let i=0; i < soundArray.length; i++) {
        kit.add("kit"+i,"sounds/"+soundArray[i]);
        kit.player("kit"+i).connect(pitchShift);
        kit.player("kit"+i).connect(panner);
        kit.player("kit"+i).connect(stereoWidener);
    }
}

const pitchShift = new Tone.PitchShift(4).toDestination();
const autoPanner = new Tone.AutoPanner("4n").toDestination();
const panner = new Tone.Panner(1).toDestination();
const vibrato = new Tone.Vibrato(3).toDestination();
const stereoWidener = new Tone.StereoWidener(1).toDestination();

var kit = new Tone.Players({}).toDestination();
addPlayers(sounds, kit);

//MIDI


async function midiToPart() {
    try {
        const midi = await Midi.fromUrl("sounds/tikka.mid").then((midi) => {
            console.log(midi)           
            midi.tracks.forEach(track => {
                const notes = track.notes
                part = new Tone.Part(((time, note) => {
                    // the notes given as the second element in the array
                    // will be passed in as the second argument
                    const now = Tone.now() + 0.5
                    var randomPlayer = "kit"+Math.floor(Math.random()*sounds.length)
                    pitchShift.pitch = getRandomArbitrary(0.1,200.0)
                    pitchShift.feedback = getRandomArbitrary(1,2.9)
                    panner.pan.setValueAtTime(getRandomArbitrary(-1,1), 0.25);
                    var playBackRate = getRandomArbitrary(0.1,20.0)
                    kit.player(randomPlayer).playbackRate = playBackRate
                    
                    if(Math.round(Math.random())) {
                        kit.player(randomPlayer).reverse = true
                    }else {
                        kit.player(randomPlayer).reverse = false
                    }
                    
                    kit.player(randomPlayer).start(time)               
                }), notes)
                part.loop = true
                var vuosirenkaat = document.getElementById("vuosirenkaat")
                vuosirenkaat.style.display = "block"
            })
        })
    }catch(err) {
        console.log("Error in midiToPart: ", err.message)
    }
}

async function toggleTransport() {
    try{
        console.log("playstate: ", playState," animation state: ", animationState)
        if(playState) {
            part.stop(0)
            Tone.Transport.stop()
            toggleAnimation()
            playState = false
        }else {
            await Tone.start()
            Tone.loaded().then(()=> {
                part.start(0)
                Tone.Transport.bpm.value = 120
                Tone.Transport.PPQ = 64      
                console.log("bpm ", Tone.Transport.bpm.value)
                console.log("PPQ ", Tone.Transport.PPQ)
                Tone.Transport.start()
                toggleAnimation()
                playState = true
            });
        } 
    }catch(err) {
        console.log("Error in toggleTransport: ", err.message)
    }
}

function toggleAnimation() {
    try { 
        if(animationState) {
            vuosirenkaat.style.animationName = "none"
            animationState = false
        }else{
            vuosirenkaat.style.animationName = "rotation"
            animationState = true
        }
    }catch(err){
        console.log("Error in toggleAnimation: ", err.message)
    }
}
