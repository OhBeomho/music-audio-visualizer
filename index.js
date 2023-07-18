const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const fileInput = document.querySelector("input[type=file]")

const audio = document.querySelector("audio")
const audioCtx = new AudioContext()
const analyser = audioCtx.createAnalyser()
const source = audioCtx.createMediaElementSource(audio)

analyser.fftSize = 256

source.connect(analyser)
analyser.connect(audioCtx.destination)

const bufferLen = analyser.frequencyBinCount
const dataArr = new Uint8Array(bufferLen)

const barWidth = 3

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  analyser.getByteFrequencyData(dataArr)

  for (let i = bufferLen - 1; i >= 0; i--) {
    const freq = dataArr[i]
    ctx.fillStyle = `hsl(${80 + freq / 2}, 80%, 50%)`
    ctx.fillRect(
      canvas.width / 2 - barWidth * i,
      canvas.height / 2 - freq / 2 - 1.5,
      barWidth,
      3 + freq
    )
  }
  for (let i = 0; i < bufferLen; i++) {
    const freq = dataArr[i]
    ctx.fillStyle = `hsl(${80 + freq / 2}, 80%, 50%)`
    ctx.fillRect(
      canvas.width / 2 + barWidth * i,
      canvas.height / 2 - freq / 2 - 1.5,
      barWidth,
      3 + freq
    )
  }

  requestAnimationFrame(draw)
}

fileInput.addEventListener("change", () => {
  if (fileInput.files.length === 0) {
    return
  }

  audio.src = URL.createObjectURL(fileInput.files[0])
})

if (fileInput.files.length !== 0) {
  audio.src = URL.createObjectURL(fileInput.files[0])
}

draw()
