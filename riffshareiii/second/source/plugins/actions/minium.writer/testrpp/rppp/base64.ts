function splitBase64String(b64: (string | Stringable)[]) {
  const numSubStrings = Math.max(1, Math.ceil(b64.length / 128))
  let start = 0
  let end = 128
  const lines: (string | Stringable)[] = []
  for (let i = 0; i < numSubStrings; i++) {
    end = Math.min(end, b64.length)
    //let tt = b64.slice(start, end);
    //lines.push(tt);
    lines.push(b64.slice(start, end))
    start += 128
    end += 128
  }
  return lines
}

function base64StringByteLength(str) {
  let delta = 0
  if (str.slice(-2) === '==') delta = -2
  else if (str.slice(-1) === '=') delta = -1
  return Math.round(str.length / 4 * 3) + delta
}
/*
module.exports = {
  splitBase64String,
  base64StringByteLength
}
  */
