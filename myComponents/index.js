import './lib/webaudio-controls.js';

const getBaseURL = () => {
	return new URL('.', import.meta.url);
};
class myComponent extends HTMLElement {    
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.src = this.getAttribute('src');
  }

  connectedCallback() {
    // Do something
    this.shadowRoot.innerHTML = `
        <style>
        div audio {
          display: block;
          margin-bottom:10px;
        }
      
        #myCanvas {
        margin-bottom:10px;
        border:1px solid;
        }
        .eq {
        margin: 32px;
        border:1px solid;
        border-radius:15px;
        background-color:lightGrey;
        padding:10px;
        width:300px;
        box-shadow: 10px 10px 5px grey;
        text-align:center;
        font-family: "Open Sans";
        font-size: 12px;
        }
        
        
        div.controls:hover {
        color:blue;
        font-weight:bold;
        }
        div.controls label {
        display: inline-block;
        text-align: center;
        width: 50px;
        }
        
        div.controls label, div.controls input, output {
            vertical-align: middle;
            padding: 0;
            margin: 0;
            font-family: "Open Sans",Verdana,Geneva,sans-serif,sans-serif;
        font-size: 12px;
        }
        
        .main {
            margin: 32px;
            border: 1px solid;
            border-radius: 15px;
            background-color: lightGrey;
            padding: 10px;
            width: 400px;
            box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.6);
            text-align: center;
            font-family: "Open Sans";
            font-size: 12px;
        }
        </style>

        <div class="main">

        <canvas id="myCanvas" ></canvas>

        <center><audio id="player" src="${this.src}" controls hidden="hidden"></audio></center>
        <br>

        <webaudio-switch midilearn="1" id="PlayPause"
          src="./assets/knobs/PowerSwitchRedux.png" 
          diameter="40" tooltip="Play / Pause" value="0">
        </webaudio-switch>

        <webaudio-knob 
          id="volumeKnob" 
          src="./assets/knobs/Clean_Small_BW_Knob.png" 
          value="0.5" min="0" max="1" step="0.1"  
          diameter="40" valuetip="0" tooltip="Volume : %s">
        </webaudio-knob>

        <webaudio-knob 
          id="balanceKnob" 
          src="./assets/knobs/Clean_Small_BW_Knob.png" 
          value="0" min="-1" max="1" step="0.1"  
          diameter="40" valuetip="0" tooltip="Balance : %s">
        </webaudio-knob>

        <webaudio-switch midilearn="1" id="moindix"
          src="./assets/knobs/S_Arrow2-L.png" 
          diameter="40" tooltip="Backward 10 seconds" type="kick" >
       </webaudio-switch>

       <webaudio-switch midilearn="1" id="stop"
          src="./assets/knobs/Stop_button.png" 
          diameter="40" tooltip="Stop" type="kick" >
       </webaudio-switch>
       
        <webaudio-switch midilearn="1" id="plusdix"
          src="./assets/knobs/S_Arrow2-R.png" 
          diameter="40" tooltip="Forward 10 seconds" type="kick">
        </webaudio-switch>
        <br>
        <br>
        <div>
        <h3>Equalizer</h3>

        <webaudio-knob 
          id="sixtyknob" 
          src="./assets/knobs/freq.png" 
          value="0" min="-100" max="100" step="0.1"  
          diameter="40" valuetip="0" tooltip="60hz: %s">
        </webaudio-knob>

        <webaudio-knob 
          id="two"
          src="./assets/knobs/freq.png" 
          value="0" min="-100" max="100" step="0.1"  
          diameter="40" valuetip="0" tooltip="170hz: %s">
        </webaudio-knob>

        <webaudio-knob 
          id="three" 
          src="./assets/knobs/freq.png" 
          value="0" min="-100" max="100" step="0.1"  
          diameter="40" valuetip="0" tooltip="350hz: %s">
        </webaudio-knob>

        <webaudio-knob 
          id="four" 
          src="./assets/knobs/freq.png" 
          value="0" min="-100" max="100" step="0.1"  
          diameter="40" valuetip="0" tooltip="1000hz: %s">
        </webaudio-knob>

        <webaudio-knob 
          id="five" 
          src="./assets/knobs/freq.png" 
          value="0" min="-100" max="100" step="0.1"  
          diameter="40" valuetip="0" tooltip="3500hz: %s">
        </webaudio-knob>

        <webaudio-knob 
          id="six" 
          src="./assets/knobs/freq.png" 
          value="0" min="-100" max="100" step="0.1"  
          diameter="40" valuetip="0" tooltip="10000hz: %s">
        </webaudio-knob>
        <br>
        <div>
        <span style="font-family: Georgia, serif;"> &nbsp;&nbsp;&nbsp;60&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span>
        <span style="font-family: Georgia, serif;"> &nbsp;&nbsp;&nbsp;&nbsp;170&nbsp;&nbsp; </span>
        <span style="font-family: Georgia, serif;"> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;350&nbsp;&nbsp; </span>
        <span style="font-family: Georgia, serif;"> &nbsp;&nbsp;&nbsp;1000&nbsp; </span>
        <span style="font-family: Georgia, serif;"> &nbsp;&nbsp;&nbsp;&nbsp;3500&nbsp; </span>
        <span style="font-family: Georgia, serif;"> &nbsp;&nbsp;&nbsp;10000 </span>
        </div>
        </div>
        
        
    `;
    ''
    this.fixRelativeURLs();

    this.player = this.shadowRoot.querySelector('#player');

    this.player.src = this.getAttribute("src");

    this.ctx = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new this.ctx();
    //new lines that may break my code que dieu soi avec moi
    this.canvas=this.shadowRoot.querySelector("#myCanvas");
    this.canvasHeight=this.canvas.height;
    this.canvasWidth=this.canvas.width;
    this.canvasContext = this.canvas.getContext('2d');
    console.log(this.canvasContext);
    this.buildAudioGraphPanner();
    this.buildAudioGraphEqualizer();
    //end new lines that hopefully didnt break my code
    this.defineListeners();
    //requestAnimationFrame(this.visualize(this.bufferLength,this.dataArray, this.analyser, this.canvasContext, this.canvasWidth, this.canvasHeight));
  } 
  
  visualize(bufferLength,dataArray, analyser, canvasContext, width, height) {
    // clear the canvas

    canvasContext.clearRect(0, 0, width, height);
    
    // Or use rgba fill to give a slight blur effect
    //this.canvasContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
    //this.canvasContext.fillRect(0, 0, width, height);
    
    // Get the analyser data
    analyser.getByteFrequencyData(dataArray);
  
     var barWidth = width / bufferLength;
        var barHeight;
        var x = 0;
     
        // values go from 0 to 256 and the canvas heigt is 100. Let's rescale
        // before drawing. This is the scale factor
        var heightScale = height/128;
    
        for(var i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];
  
  
          canvasContext.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
          barHeight *= heightScale;
          canvasContext.fillRect(x, height-barHeight/2, barWidth, barHeight/2);
  
          // 2 is the number of pixels between bars
          x += barWidth + 1;
        }
    
    // call again the visualize function at 60 frames/s
    requestAnimationFrame(this.visualize(bufferLength,dataArray, analyser, canvasContext, width, height));
  }

  buildAudioGraphPanner() {
    // create source and gain node
    this.source = this.audioContext.createMediaElementSource(this.player);
    this.pannerNode = this.audioContext.createStereoPanner();
    // connect nodes together
    this.source.connect(this.pannerNode);
    this.pannerNode.connect(this.audioContext.destination);

    //god is good
    this.analyser = this.audioContext.createAnalyser();
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    //yes he is
  }

  buildAudioGraphEqualizer() {
    // create the equalizer. It's a set of biquad Filters
    this.filters = [];
    // Set filters
    const freqs = [60, 170, 350, 1000, 3500, 10000];
    freqs.forEach((freq, index) => {
      var eq = this.audioContext.createBiquadFilter();
      eq.frequency.value = freq;
      eq.type = "peaking";
      eq.gain.value = 0;
      this.filters.push(eq);
    });
    // Connect filters in serie
    this.source.connect(this.filters[0]);
    for(var i = 0; i < this.filters.length - 1; i++) {
      this.filters[i].connect(this.filters[i+1]);
    }
    // connect the last filter to the speakers
    this.filters[this.filters.length - 1].connect(this.audioContext.destination);
  }

  fixRelativeURLs() {
    const baseURL = getBaseURL();
    console.log('baseURL', baseURL);
    const switchs = this.shadowRoot.querySelectorAll('webaudio-switch');
    const knobs = this.shadowRoot.querySelectorAll('webaudio-knob');

    for (const knob of knobs) {
      console.log("fixing " + knob.getAttribute('src'));

      const src = knob.src;
      knob.src =  baseURL  + src;

      console.log("new value : " + knob.src);
    }
    for (const sw of switchs) {
      console.log("fixing " + sw.getAttribute('src'));

      const src = sw.src;
      sw.src =  baseURL  + src;

      console.log("new value : " + sw.src);
    }
  }

  defineListeners() {

    this.shadowRoot.querySelector('#stop').addEventListener('click', () => {
      this.player.pause();
      this.player.currentTime = 0;
    });
    this.shadowRoot.querySelector('#plusdix').addEventListener('click', () => {
      this.player.currentTime = this.player.currentTime+5;
    });
    this.shadowRoot.querySelector('#moindix').addEventListener('click', () => {
      this.player.currentTime = this.player.currentTime-5;
    });
    this.shadowRoot.querySelector('#volumeKnob').addEventListener('input', (evt) => {
      this.player.volume = evt.target.value;
    });
    let i=0;
    this.shadowRoot.querySelector('#PlayPause').addEventListener('click', (evt) => {
      if(evt.target.value == 1){
        this.player.play();
      }
      else{
        this.player.pause();
      } 
    });
    this.shadowRoot.querySelector('#balanceKnob').addEventListener('input', (evt) => {
      this.pannerNode.pan.value = evt.target.value;
    });
    this.shadowRoot.querySelector('#sixtyknob').addEventListener('input', (evt) => {
      this.filters[0].gain.value = evt.target.value;
    });
    this.shadowRoot.querySelector('#two').addEventListener('input', (evt) => {
      this.filters[1].gain.value = evt.target.value;
    } );
    this.shadowRoot.querySelector('#three').addEventListener('input', (evt) => {
      this.filters[2].gain.value = evt.target.value;
    } );
    this.shadowRoot.querySelector('#four').addEventListener('input', (evt) => {
      this.filters[3].gain.value = evt.target.value;
    } );
    this.shadowRoot.querySelector('#five').addEventListener('input', (evt) => {
      this.filters[4].gain.value = evt.target.value;
    } );
    this.shadowRoot.querySelector('#six').addEventListener('input', (evt) => {
      this.filters[5].gain.value = evt.target.value;
    } );
  }
}

customElements.define("my-audio", myComponent);