let anc = document.getElementById("anc");
let disabled = document.getElementById("disabled");
let transparence = document.getElementById("transparence");

let stream;

let ancEnabled = true;

anc.addEventListener("click", function () {
    if (ancEnabled) {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(newStream => {
                stream = newStream;
                const audioContext = new AudioContext();
                const source = audioContext.createMediaStreamSource(stream);
                const noiseSuppressor = audioContext.createScriptProcessor(4096, 1, 1);

                noiseSuppressor.onaudioprocess = function (event) {
                    const inputData = event.inputBuffer.getChannelData(0);
                    const outputData = event.outputBuffer.getChannelData(0);

                    // Aplicar la función de cancelación de ruido aquí

                    for (let i = 0; i < inputData.length; i++) {
                        outputData[i] = inputData[i];
                    }
                };

                source.connect(noiseSuppressor);
                noiseSuppressor.connect(audioContext.destination);
            })
            .catch(console.error);
    }
});

disabled.addEventListener("click", function () {
    ancEnabled = !ancEnabled;
    if (!ancEnabled && stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
});

transparence.addEventListener("click", ActivarTRANS);
