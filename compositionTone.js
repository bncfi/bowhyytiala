//const { Tone } = require("tone/build/esm/core/Tone");

//const { Tone } = require("tone/build/esm/core/Tone");

//const { Tone } = require("tone/build/esm/core/Tone");


//DEBUG & FUNCTIONS

window.addEventListener("load", midiToPart);

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function openModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
}

function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

//VARIABLES

let playState = false;
var animationState = false;
var part;


//AUDIO

/*
const sounds =  ['Bass1.wav', 'Bass2.wav', 'Bass3.wav',
    'Bass4.wav', 'Bass5.wav', 'Bass6.wav', 'Bass7.wav',
    'Bass8.wav', 'Bass9.wav', 'Bass10.wav', 'Bass11.wav',
    'Bass12.wav', 'Bass13.wav', 'Snare1.wav', 'Tom1.wav',
    'Tom2.wav', 'Tom3.wav', 'Tom4.wav', 'Tom5.wav', 'Tom6.wav'];*/
/*
const sounds =  ['bd1.mp3', 'bd2.mp3', 'bd3.mp3', 'bd4.mp3', 'bd5.mp3',
    'bd6.mp3', 'bd7.mp3', 'bd8.mp3', 'bd9.mp3', 'bd10.mp3', 'sn1.mp3',
    'sn2.mp3', 'sn3.mp3', 'sn4.mp3', 'sn5.mp3', 'sn6.mp3', 'sn7.mp3', 'sn8.mp3'];
*/
const sounds =  ['puu1.mp3','puu2.mp3','puu3.mp3','puu4.mp3','puu5.mp3','puu6.mp3','puu7.mp3','puu8.mp3','puu9.mp3',
'puu10.mp3','puu11.mp3','puu12.mp3','puu13.mp3','puu14.mp3','puu15.mp3','puu16.mp3','puu17.mp3','puu18.mp3',
'puu19.mp3','puu20.mp3','puu21.mp3','puu22.mp3','puu23.mp3','puu24.mp3','puu25.mp3',
'puu26.mp3','puu27.mp3','puu28.mp3','puu29.mp3','puu30.mp3','puu31.mp3','puu32.mp3',
'puu33.mp3','puu34.mp3','puu35.mp3','puu36.mp3','puu37.mp3','puu38.mp3','puu39.mp3',
'puu40.mp3','puu41.mp3','puu42.mp3','puu43.mp3','puu44.mp3','puu45.mp3','puu46.mp3',
'puu47.mp3','puu48.mp3','puu49.mp3','puu50.mp3','puu51.mp3','puu52.mp3']

const lauri = ['lauri1.mp3','lauri2.mp3','lauri3.mp3','lauri4.mp3','lauri5.mp3']


//DATAHOMMA

const treeData = [227.283,171.886,184.856,193.719,188.63,168.122,173.443,154.718,194.537,156.738,
184.409,147.117,172.134,158.851,170.125,154.674,146.361,154.456,148.934,
149.102,130.71,144.738,144.284,169.505,139.793,143.333,148.264,132.936]

var timerInterval;

function readTreeData(tonePlayer) {
    console.log("intervalli kutsuttu")
    var arvo = treeData[Math.floor(getRandomArbitrary(0,treeData.length))]
    console.log(arvo)
    if(arvo>180) {
        tonePlayer.start()
    }
}

var dataLuku = new Tone.Player("./sounds/puukaatuu.mp3").toDestination();
dataLuku.loop = false;
dataLuku.autostart = false;
dataLuku.volume.value = -15;


//KITTI

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

//LAURIN TAUSTALOOP
//var bgLoop = new Tone.Player("./sounds/manty.mp3").toDestination();
var bgLoop = new Tone.Player("./sounds/"+lauri[Math.floor(getRandomArbitrary(0,lauri.length))]).toDestination();
bgLoop.loop = true;
bgLoop.volume.value = -5;




//MIDI


async function midiToPart() {
    try {
        const midi = await Midi.fromUrl("sounds/tikka.mid").then((midi) => {         
            midi.tracks.forEach(track => {
                const notes = track.notes
                part = new Tone.Part(((time, note) => {
                    // the notes given as the second element in the array
                    // will be passed in as the second argument
                    const now = Tone.now() + 0.5
                    var randomPlayer = "kit"+Math.floor(Math.random()*sounds.length)
                    pitchShift.pitch = getRandomArbitrary(0.85,7.0)
                    pitchShift.feedback = getRandomArbitrary(1,2.9)
                    panner.pan.setValueAtTime(getRandomArbitrary(-1,1), 0.5);
                    var playBackRate = getRandomArbitrary(0.85,7.0)
                    kit.player(randomPlayer).playbackRate = playBackRate
                    
                    if(Math.round(Math.random())) {
                        kit.player(randomPlayer).reverse = true
                    }else {
                        kit.player(randomPlayer).reverse = false
                    }
                    
                    kit.player(randomPlayer).start(time)               
                }), notes)
                part.loop = true
                tearMaker(20)
                var vuosirenkaat = document.getElementById("vuosirenkaat")
                vuosirenkaat.style.display = "block"
            })
        })
    }catch(err) {
        console.log("Error in midiToPart: ", err.message)
    }
}

//TRANSPORT

async function toggleTransport() {
    try{
        //console.log("playstate: ", playState," animation state: ", animationState)
        if(playState) {
            part.stop(0)
            Tone.Transport.stop()
            toggleAnimation()
            playState = false
            bgLoop.stop()
            window.clearInterval(timerInterval)
        }else {
            await Tone.start()
            Tone.loaded().then(()=> {
                part.start(0)
                bgLoop.start()
                Tone.Transport.bpm.value = 80
                Tone.Transport.PPQ = 32
                Tone.Transport.start()
                toggleAnimation()
                playState = true
                timerInterval = window.setInterval(function(){
                    var arvo = treeData[Math.floor(getRandomArbitrary(0,treeData.length))]
                    if(arvo>160) {
                        var playBackRate = getRandomArbitrary(0.85,7.0)
                        dataLuku.playbackRate = playBackRate
                        dataLuku.start()
                    }},5000)
            });
        } 
    }catch(err) {
        console.log("Error in toggleTransport: ", err.message)
    }
}

function toggleAnimation() {
    try { 
        var vuosirenkaat = document.getElementById("vuosirenkaat")
        var tears = document.querySelectorAll(".tear")
        if(animationState) {
            if(window.matchMedia('(max-width: 480px)').matches) {
                vuosirenkaat.style.animationName = "sykkivaMobile"
                vuosirenkaat.style.animationDuration= "1.5s"
            }else {
                vuosirenkaat.style.animationName = "sykkiva"
                vuosirenkaat.style.animationDuration= "1.5s"
            }
            
            tears.forEach(tear=> {
                tear.style.animationName = "none"
                tear.style.visibility = "hidden"
            })
            animationState = false

        }else{
            vuosirenkaat.style.animationName = "rotation"
            vuosirenkaat.style.animationDuration= "0.6s"
            /*vuosirenkaat.style.webkitAnimationName = "rotation"*/
            tears.forEach(tear=> {
                tear.style.animationName = "teardrop"
                tear.style.visibility = "visible"
            })
            animationState = true
        }
    }catch(err){
        console.log("Error in toggleAnimation: ", err.message)
    }
}

//TEAR

function tearMaker(tearAmount) {
    try{
        var container = document.getElementById("tearcontainer")
        for(let i =0;i <tearAmount;i++) {
            var tear = document.createElement("IMG")
            tear.setAttribute("src", "graf/kyynel_mv.png")
            tear.setAttribute("class", "tear")
            tear.style.top = Math.floor(getRandomArbitrary(10,(window.innerHeight*0.8)))+"px"
            tear.style.left = Math.floor(getRandomArbitrary(0,window.innerWidth))+"px"
            tear.style.animationDuration = getRandomArbitrary(0.5,3)+"s"
            tear.addEventListener("animationiteration", function(){
                this.style.top = Math.floor(getRandomArbitrary(10,(window.innerHeight*0.8)))+"px"
                this.style.left = Math.floor(getRandomArbitrary(0,window.innerWidth))+"px"
            });
            container.appendChild(tear)
        }
    }catch(err){
        console.log("Error in tearMaker: ", err.message)
    }
}


function newRandomPos(element) {
    console.log(element)
    /*
    element.style.top = Math.floor(getRandomArbitrary(10,(window.innerHeight*0.8)))+"px"
    element.style.left = Math.floor(getRandomArbitrary(0,window.innerWidth))+"px"*/
    console.log("kutsuttu")
}