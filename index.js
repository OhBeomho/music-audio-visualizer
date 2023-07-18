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

const barWidth = canvas.width / bufferLen / 2

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  analyser.getByteFrequencyData(dataArr)

  let px, py, px2, py2

  for (let i = 0; i < bufferLen; i++) {
    const freq = dataArr[i]
    ctx.strokeStyle = `hsl(${90 + freq * 0.6}, 80%, 50%)`
    ctx.lineWidth = 1.5

    const x = canvas.width / 2 - barWidth * i
    const x2 = canvas.width / 2 + barWidth * i
    const y = canvas.height / 2 - freq / 2
    const y2 = canvas.height / 2 + freq / 2

    ctx.beginPath()
    ctx.moveTo(px || x, py || y)
    ctx.lineTo(x, y)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(px || x, py2)
    ctx.lineTo(x, y2)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(px2, py || y)
    ctx.lineTo(x2, y)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(px2, py2)
    ctx.lineTo(x2, y2)
    ctx.stroke()

    px = x
    py = y
    px2 = x2
    py2 = y2
  }

  requestAnimationFrame(draw)
}

fileInput.addEventListener("change", () => {
  if (fileInput.files.length === 0) {
    return
  }

  audio.src = URL.createObjectURL(fileInput.files[0])
  audio.load()
  audio.play()
})

if (fileInput.files.length !== 0) {
  audio.src = URL.createObjectURL(fileInput.files[0])
}

draw()
