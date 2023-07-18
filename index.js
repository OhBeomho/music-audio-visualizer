const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const fileInput = document.querySelector("input[type=file]")

const audio = document.querySelector("audio")
let audioCtx, analyser, source
let bufferLen, dataArr
let gap

function draw() {
  if (bufferLen) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    analyser.getByteFrequencyData(dataArr)

    let px, py, px2, py2

    for (let i = 0; i < bufferLen; i++) {
      const freq = dataArr[i]

      const x = canvas.width / 2 - gap * i
      const x2 = canvas.width / 2 + gap * i
      const y = canvas.height / 2 - freq / 2
      const y2 = canvas.height / 2 + freq / 2

      ctx.strokeStyle = `hsl(${90 + freq * 0.6}, 80%, 50%)`
      ctx.lineWidth = 1.5

      ctx.beginPath()
      ctx.moveTo(px ?? x, py ?? y)
      ctx.lineTo(x, y)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(px ?? x, py2 ?? y2)
      ctx.lineTo(x, y2)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(px2 ?? x2, py ?? y)
      ctx.lineTo(x2, y)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(px2 ?? x2, py2 ?? y2)
      ctx.lineTo(x2, y2)
      ctx.stroke()

      px = x
      py = y
      px2 = x2
      py2 = y2
    }
  }

  requestAnimationFrame(draw)
}

function loadAudio(file) {
  audio.src = URL.createObjectURL(file)

  audioCtx = new AudioContext()
  analyser = audioCtx.createAnalyser()
  source = audioCtx.createMediaElementSource(audio)

  analyser.fftSize = 256
  bufferLen = analyser.frequencyBinCount
  dataArr = new Uint8Array(bufferLen)
  gap = canvas.width / bufferLen / 2

  source.connect(analyser)
  analyser.connect(audioCtx.destination)
}

fileInput.addEventListener("change", () => {
  if (!fileInput.files.length) {
    return
  }

  loadAudio(fileInput.files[0])
})

if (fileInput.files.length) {
  loadAudio(fileInput.files[0])
}

draw()
