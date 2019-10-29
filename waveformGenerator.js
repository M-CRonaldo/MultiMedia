// This object represent the waveform generator
var WaveformGenerator = {
    // The generateWaveform function takes 4 parameters:
    //     - type, the type of waveform to be generated
    //     - frequency, the frequency of the waveform to be generated
    //     - amp, the maximum amplitude of the waveform to be generated
    //     - duration, the length (in seconds) of the waveform to be generated
    generateWaveform: function(type, frequency, amp, duration) {
        var nyquistFrequency = sampleRate / 2; // Nyquist frequency
        var totalSamples = Math.floor(sampleRate * duration); // Number of samples to generate
        var result = []; // The temporary array for storing the generated samples

        switch(type) {
            case "sine-time": // Sine wave, time domain
                for(var i = 0; i < totalSamples; ++i) {
                    var currentTime = i / sampleRate;
                    result.push(amp * Math.sin(2.0 * Math.PI * frequency * currentTime));
                }
                break;

            case "clarinet-additive":

                var harmonics = [];
                for(var i = 0; i < totalSamples; ++i) {
                    var currentTime = i / sampleRate;
                    var sampleValue = 0;
                    if (1 * frequency < nyquistFrequency){
                        sampleValue += 1 * Math.sin(2.0 * Math.PI * frequency * currentTime)
                    }
                    if (3 * frequency < nyquistFrequency){
                        sampleValue += 0.75 * Math.sin(2.0 * Math.PI * 3 *frequency * currentTime)
                    }
                    if (5 * frequency < nyquistFrequency){
                        sampleValue += 0.5 * Math.sin(2.0 * Math.PI * 5 *frequency * currentTime)
                    }
                    if (7 * frequency < nyquistFrequency){
                        sampleValue += 0.14 * Math.sin(2.0 * Math.PI * 7 *frequency * currentTime)
                    }
                    if (9 * frequency < nyquistFrequency){
                        sampleValue += 0.5 * Math.sin(2.0 * Math.PI * 9 *frequency * currentTime)
                    }
                    if (11 * frequency < nyquistFrequency){
                        sampleValue += 0.12 * Math.sin(2.0 * Math.PI * 11 *frequency * currentTime)
                    }
                    if (13 * frequency < nyquistFrequency){
                        sampleValue += 0.17 * Math.sin(2.0 * Math.PI * 13 *frequency * currentTime)
                    }
                    result.push(amp * sampleValue);
                }
                break;
            case "fm": // FM
                /**
                * TODO: Complete this generator
                **/

                // Obtain all the required parameters
                var carrierFrequency = parseFloat($("#fm-carrier-frequency").val());
                var carrierAmplitude = parseFloat($("#fm-carrier-amplitude").val());
                var modulationFrequency = parseFloat($("#fm-modulation-frequency").val());
                var modulationAmplitude = parseFloat($("#fm-modulation-amplitude").val());
                var useADSR = $("#fm-use-adsr").prop("checked");
                var useFreqMultiplier = $("#fm-use-freq-multiplier").prop("checked");
                if (useFreqMultiplier) {
                    modulationFrequency = frequency * modulationFrequency;
                    carrierFrequency = frequency;
                    // TODO: Use carrierFrequency and modulationFrequency as multipliers for
                    //       the frequency value from General Settings
 
                }
                if(useADSR) { // Obtain the ADSR parameters
                    var attackDuration = parseFloat($("#fm-adsr-attack-duration").val()) * sampleRate;
                    var decayDuration = parseFloat($("#fm-adsr-decay-duration").val()) * sampleRate;
                    var releaseDuration = parseFloat($("#fm-adsr-release-duration").val()) * sampleRate;
                    var sustainLevel = parseFloat($("#fm-adsr-sustain-level").val()) / 100.0;
                    var samples = new Array(totalSamples);
                    var sustainModulationAmplitude = lerp(0, modulationAmplitude, sustainLevel);
                    for(var i = 0; i < attackDuration; ++i) {
                        var currentTime = i / sampleRate;
                        var sampleValue = 0;
                        var multiplier = i / attackDuration;
                        var modulator = modulationAmplitude * Math.sin(2 * Math.PI * modulationFrequency * currentTime);
                        samples[i] = carrierAmplitude * Math.sin(2 * Math.PI * carrierFrequency * currentTime + modulator * multiplier);
                        sampleValue = samples[i];
                        result.push(amp * sampleValue);
                    }
                    for(var i = attackDuration; i < attackDuration + decayDuration; ++i) {
                        var currentTime = i / sampleRate;
                        var sampleValue = 0;
                        var multiplier = 1.0 - (i - attackDuration) * (1.0 - sustainLevel)/decayDuration;
                        var modulator = modulationAmplitude * Math.sin(2 * Math.PI * modulationFrequency * currentTime);
                        samples[i] = carrierAmplitude * Math.sin(2 * Math.PI * carrierFrequency * currentTime + modulator * multiplier);
                        sampleValue = samples[i];
                        result.push(amp * sampleValue);
                    }
                    for(var i = attackDuration + decayDuration; i < totalSamples - releaseDuration ; ++i) {
                        var currentTime = i / sampleRate;
                        var sampleValue = 0;
                        var multiplier = sustainLevel;
                        var modulator = modulationAmplitude * Math.sin(2 * Math.PI * modulationFrequency * currentTime);
                        samples[i] = carrierAmplitude * Math.sin(2 * Math.PI * carrierFrequency * currentTime + modulator * multiplier);
                        sampleValue = samples[i];
                        result.push(amp * sampleValue);
                    }
                    for(var i = totalSamples - releaseDuration; i < totalSamples; ++i) {
                        var currentTime = i / sampleRate;
                        var sampleValue = 0;
                        var multiplier = sustainLevel - sustainLevel * (i + releaseDuration - totalSamples) /releaseDuration;
                        var modulator = modulationAmplitude * Math.sin(2 * Math.PI * modulationFrequency * currentTime);
                        samples[i] = carrierAmplitude * Math.sin(2 * Math.PI * carrierFrequency * currentTime + modulator * multiplier);
                        sampleValue = samples[i];
                    // TODO: Complete the FM waveform generator
                    // Hint: You can use the function lerp() in utility.js 
                    //       for performing linear interpolation

                        result.push(amp * sampleValue);
                    }

                }
                if(!useADSR){
                    var samples = new Array(totalSamples);
                    for(var i = 0; i < totalSamples; ++i) {
                        var currentTime = i / sampleRate;
                        var sampleValue = 0;
                        var modulator = modulationAmplitude * Math.sin(2 * Math.PI * modulationFrequency * currentTime);
                        samples[i] = carrierAmplitude * Math.sin(2 * Math.PI * carrierFrequency * currentTime + modulator);
                        sampleValue = samples[i];
                    // TODO: Complete the FM waveform generator
                    // Hint: You can use the function lerp() in utility.js 
                    //       for performing linear interpolation

                        result.push(amp * sampleValue);
                    }    
                }

                
                break;


            case "karplus-strong": // Karplus-Strong algorithm
                /**
                * TODO: Complete this generator
                **/

                // Obtain all the required parameters
                var base = $("#karplus-base>option:selected").val();
                var b = parseFloat($("#karplus-b").val());
                var delay = parseInt($("#karplus-p").val());

                // Find p from frequency
                var useFreq = $("#karplus-use-freq").prop("checked");
                if (useFreq) {
                    delay = parseInt(sampleRate / frequency);
                    // TODO: Determine the delay automatically using
                    //       the frequency value from General Settings

                }
               
                var samples = new Array(totalSamples);// Fill the sound
                if(base == 'white-noise'){
                    for(var i = 0; i < totalSamples; i++) {
                        var sampleValue = 0;
                        var t = Math.random(); 
                     //if (base = 'White Noise'){
                        if (i <= delay)
                            {samples[i] = 2 * Math.random() - 1;}
                        else if (t < b){
                                samples[i] = 0.5 * (samples[i - delay] + samples[i - delay - 1]);
                            }
                            else{
                                samples[i] = -0.5 * (samples[i - delay] + samples[i - delay - 1]);
                            }
                        sampleValue = samples[i];
                   // }
                    // TODO: Complete the Karplus-Strong generator
                    // The first period of the result would be either
                    // white noise or a single cycle of sawtooth
                        result.push(amp * sampleValue);
                    }
                }
                if(base == 'sawtooth'){
                    var onecycle=  sampleRate / frequency;            
                    for(var i = 0; i < totalSamples; i++) {
                        var sampleValue = 0; 
                        var t = Math.random();
                        if (i <= delay){
                            var whereInthecycle = i%parseInt(onecycle);
                            var fractioninthecycle = whereInthecycle / onecycle;
                            samples[i] = 2 * (1.0 - fractioninthecycle) - 1;
                        }                        
                        else if (t < b){
                                samples[i] = 0.5 * (samples[i - delay] + samples[i - delay - 1]);
                            }
                            else{
                                samples[i] = -0.5 * (samples[i - delay] + samples[i - delay - 1]);
                            }
                        sampleValue = samples[i];
                    result.push(amp * sampleValue);
                    }
                }
                break;

            default:
                break;
        }

        return result;
    }
};
