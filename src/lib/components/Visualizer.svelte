<script lang="ts">
  let canvas: HTMLCanvasElement;

  export function animate(state: Spotify.PlaybackState) {
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const audioContext = new window.AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const audioElement = new Audio();
    audioElement.crossOrigin = 'anonymous';
    audioElement.src = `https://api.spotify.com/v1/tracks/${state.track_window.current_track.id}`;

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    audioElement.play();

    function draw() {
      requestAnimationFrame(draw);
      if (ctx) {
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];

          const r = barHeight + 25 * (i / bufferLength);
          const g = 250 * (i / bufferLength);
          const b = 50;

          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(
            x,
            canvas.height - barHeight / 2,
            barWidth,
            barHeight / 2
          );

          x += barWidth + 1;
        }
      }
    }

    draw();
  }
</script>

<div class="mt-5 h-80 border border-spotify-black">
  <canvas bind:this={canvas}></canvas>
</div>
