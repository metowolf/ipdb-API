const toBin = ip => {
  return toBin4(ip)
}

const toBin4 = ip => {
  const result = []
  const items = ip.split('.')
  for (const item of items) {
    const num = parseInt(item, 10)
    for (let i = 7; i >= 0; i -= 1) {
      result.push((num >> i) & 1)
    }
  }

  return result
}

const toBin6 = ip => {
  const result = [[], []]
  const parts = ip.split('::', 2)
  for (let index = 0; index < 2; index += 1) {
    if (parts[index]) {
      const items = parts[index].split(':')
      for (const item of items) {
        const num = parseInt(item, 16)
        for (let i = 15; i >= 0; i -= 1) {
          result[index].push((num >> i) & 1)
        }
      }
    }
  }

  const pad = 128 - result[0].length - result[1].length
  return [...result[0], ...(new Array(pad).fill(0)), ...result[1]]
}

const toIp = ip => {
  return ip.length === 32 ? toIp4(ip) : toIp6(ip)
}

const toIp4 = ip => {
  const result = []
  for (let i = 0; i < 4; i += 1) {
    let t = 0
    for (let j = 0; j < 8; j += 1) {
      t = (t << 1) | ip[(i << 3) | j]
    }

    result.push(t.toString())
  }

  return result.join('.')
}

const toIp6 = ip => {
  const result = []
  for (let i = 0; i < 8; i += 1) {
    let t = 0
    for (let j = 0; j < 16; j += 1) {
      t = (t << 1) | ip[(i << 4) | j]
    }

    result.push(t.toString(16))
  }

  return result.join(':')
}

const toLower = (ip, mask) => {
  for (let i = mask; i < ip.length; i += 1) {
    ip[i] = 0
  }

  return toIp(ip)
}

const toUpper = (ip, mask) => {
  for (let i = mask; i < ip.length; i += 1) {
    ip[i] = 1
  }

  return toIp(ip)
}

const toNext = (ip, mask) => {
  for (let i = mask; i < ip.length; i += 1) {
    ip[i] = 0
  }

  ip[mask - 1] += 1
  for (let i = mask - 1; i >= 0; i -= 1) {
    if (ip[i] === 2) {
      ip[i] = 0
      if (i) {
        ip[i - 1] += 1
      }
    }
  }

  return toIp(ip)
}

const patch = data => {
  if (!data.range) {
    const bin = toBin(data.ip)
    data.range = {
      from: toLower(bin, data.bitmask),
      to: toUpper(bin, data.bitmask),
      next: toNext(bin, data.bitmask)
    }
  }

  return data
}

export default patch