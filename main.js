const anc = document.getElementById("anc");
const disabled = document.getElementById("disabled");
const transparence = document.getElementById("transparence");

let stream;
let audioContext;
let noiseSuppressor;

let ancEnabled = true;

async function startNoiseCancellation() {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createMediaStreamSource(stream);
    noiseSuppressor = audioContext.createScriptProcessor(4096, 1, 1);

    noiseSuppressor.onaudioprocess = function (event) {
        const inputData = event.inputBuffer.getChannelData(0);
        const outputData = event.outputBuffer.getChannelData(0);

        // Amplificar la señal recibida aquí
        const gain = 10;
        const amplifiedData = inputData.map(x => x * gain);

        // Aplicar la función de cancelación de ruido aquí
        for (let i = 0; i < amplifiedData.length; i++) {
            outputData[i] = amplifiedData[i] - noiseData[i];
        }
    };

    source.connect(noiseSuppressor);
    noiseSuppressor.connect(audioContext.destination);
}

anc.addEventListener("click", async function () {
    if (ancEnabled) {
        await startNoiseCancellation();
    }
});

disabled.addEventListener("click", function () {
    ancEnabled = !ancEnabled;
    if (!ancEnabled && stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        noiseSuppressor.disconnect();
    }
});

transparence.addEventListener("click", ActivarTRANS);
