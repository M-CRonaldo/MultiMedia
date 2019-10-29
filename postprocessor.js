// This object represent the postprocessor
Postprocessor = {
    // The postprocess function takes the audio samples data and the post-processing effect name
    // and the post-processing stage as function parameters. It gathers the required post-processing
    // paramters from the <input> elements, and then applies the post-processing effect to the
    // audio samples data of every channels.
    postprocess: function(channels, effect, pass) {
        switch(effect) {
            case "no-pp":
                // Do nothing
                break;


            case "boost":
                // Find the maximum gain of all channels
                var maxGain = -1.0;
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
                    var audioSequence = channels[c].audioSequenceReference;
                    var gain = audioSequence.getGain();
                    if(gain > maxGain) {
                        maxGain = gain;
                    }
                }

                // Determine the boost multiplier
                var multiplier = 1.0 / maxGain;

                // Post-process every channels
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
                    var audioSequence = channels[c].audioSequenceReference;

                    // For every sample, apply a boost multiplier
                    for(var i = 0; i < audioSequence.data.length; ++i) {
                        audioSequence.data[i] *= multiplier;
                    }

                    // Update the sample data with the post-processed data
                    channels[c].setAudioSequence(audioSequence);
                }
                break;

            case "tremolo":
                /**
                * TODO: Complete this function
                **/

                // Obtain all the required parameters
                var tremoloFrequency = parseFloat($("#tremolo-frequency").data("p" + pass));
                var wetness = parseFloat($("#tremolo-wetness").data("p" + pass));

                // Post-process every channels
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
                    var audioSequence = channels[c].audioSequenceReference;

                    // For every sample, apply a tremolo multiplier
                    for(var i = 0; i < audioSequence.data.length; ++i) {
                        var currenttime = (i / audioSequence.data.length) * 6;
                        multiplier = (1 - wetness/2 ) + (wetness / 2) * Math.sin(2.0 * Math.PI * tremoloFrequency * currenttime - Math.PI / 2);
                        audioSequence.data[i] *= multiplier;
                        // TODO: Complete the tremolo postprocessor
                    }

                    // Update the sample data with the post-processed data
                    channels[c].setAudioSequence(audioSequence);
                }
                break;

            case "adsr":
                /**
                * TODO: Complete this function
                **/

                // Obtain all the required parameters
                var attackDuration = parseFloat($("#adsr-attack-duration").data("p" + pass)) * sampleRate;
                var decayDuration = parseFloat($("#adsr-decay-duration").data("p" + pass)) * sampleRate;
                var releaseDuration = parseFloat($("#adsr-release-duration").data("p" + pass)) * sampleRate;
                var sustainLevel = parseFloat($("#adsr-sustain-level").data("p" + pass)) / 100.0;
                for(var c = 0; c < channels.length; ++c) {
                    // Get the sample data of the channel
                    var audioSequence = channels[c].audioSequenceReference;
                    for(var i = 0; i < audioSequence.data.length; ++i) {   
                        if (i < attackDuration) {
                            var multiplier = i / attackDuration;
                            audioSequence.data[i] *= multiplier;
                        }
                        if (attackDuration - 1.0 < i && i < attackDuration + decayDuration) {
                            var multiplier = (1.0 - (i - attackDuration) * (1.0 - sustainLevel)/decayDuration);
                            audioSequence.data[i] *= multiplier;
                        }
                        if (attackDuration + decayDuration - 1.0 < i && i < audioSequence.data.length - releaseDuration) {
                            var multiplier = sustainLevel;
                            audioSequence.data[i] *= multiplier;
                        }
                        if (audioSequence.data.length - releaseDuration - 1.0 < i && i < audioSequence.data.length) {
                            var multiplier = sustainLevel - sustainLevel * (i + releaseDuration - audioSequence.data.length) /releaseDuration;
                            audioSequence.data[i] *= multiplier;
                        }
                    }

                    // Update the sample data with the post-processed data
                    channels[c].setAudioSequence(audioSequence);
                }
                break;
            
            default:
                // Do nothing
                break;
        }
        return;
    }
}
