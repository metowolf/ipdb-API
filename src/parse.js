
class Parse {
  constructor(filename, options = {}) {
    const data = filename
    const metaLen = data.readInt32BE(0)
    const meta = data.slice(4, 4 + metaLen)

    this.meta = JSON.parse(meta.toString())
    this.data = data.slice(4 + metaLen)

    if (options.patches) {
      this.patches = options.patches
    }

    if (this.meta.v4node === undefined && this.meta.ip_version & 0x01) {
      this._initv4node()
    }
  }

  _initv4node() {
    let node = 0
    for (let i = 0; i < 80; i += 1) {
      node = this._node(node, 0)
    }

    for (let i = 80; i < 96; i += 1) {
      node = this._node(node, 1)
    }

    this.meta.v4node = node
  }

  find(ip, options = {}) {
    const result = {}
    try {
      result.data = this._find(ip, options.language)
      result.code = 0
      if (this.patches || options.patches) {
        const patches = options.patches || this.patches
        for (const patch of patches) {
          patch(result.data)
        }
      }
    } catch (error) {
      result.code = -1
      result.message = error.message
    }

    return result
  }

  _find(ip, language) {
    const bits = this._toBits(ip)
    let node = bits.length === 32 ? this.meta.v4node : 0
    let cidr = 0

    while (cidr < bits.length) {
      node = this._node(node, bits[cidr])
      cidr += 1
      if (node >= this.meta.node_count) {
        break
      }
    }

    const data = this._resolve(node)

    let offset = 0
    if (this.meta.languages[language]) {
      offset = this.meta.languages[language]
    }

    const result = {}
    for (let i = 0; i < this.meta.fields.length; i += 1) {
      result[this.meta.fields[i]] = data[offset + i]
    }

    result.ip = ip
    result.bitmask = cidr

    return result
  }

  _resolve(node) {
    const offset = node + (this.meta.node_count << 3) - this.meta.node_count
    const len = this.data.readUInt16BE(offset)
    const buf = this.data.slice(offset + 2, offset + 2 + len)
    return buf.toString().split('\t')
  }

  _node(id, idx) {
    return this.data.readUInt32BE((id << 3) | (idx << 2))
  }

  _toBits(ip) {
    return ip.includes(':') ? this._toBits6(ip) : this._toBits4(ip)
  }

  _toBits4(ip) {
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

  _toBits6(ip) {
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
}

export default Parse