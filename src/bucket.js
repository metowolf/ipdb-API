import fs from 'node:fs'

class BucketObject {
  constructor(buffer) {
    this.buffer = buffer
  }

  async arrayBuffer() {
    return this.buffer
  }
}

class Bucket {
  constructor() {
    this.data = {}
  }

  async put(key, value) {
    this.data[key] = value
  }

  async get(key) {
    return this.data[key]
  }
}

let globalTimer = null, globalBucket = null
const scanPath = async (path) => {
  const files = fs.readdirSync(path)
  for (const file of files) {
    if (!file.endsWith('.ipdb')) {
      continue
    }
    const buffer = fs.readFileSync(`${path}/${file}`)
    await globalBucket.put(file, new BucketObject(buffer))
  }
}

export default async (path) => {
  globalBucket = new Bucket()
  await scanPath(path)

  globalTimer = setInterval(() => {
    scanPath(path)
  }, 1000 * 2)

  return globalBucket
}