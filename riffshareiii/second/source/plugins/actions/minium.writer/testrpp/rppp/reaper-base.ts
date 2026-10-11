type Stringable = {
  toString: ToString;
};
type ToString = () => string;
type ReaData = {
  /**
   * Reaper token such as VST, TRACK, or NAME
   */
  token: string;
  /**
   * ex. ["hi", 5000]]
   */
  params: (number | string)[];
  contents: (ReaData | ReaperBase)[];
  /**
   * each element is a string or an
   * object with a toString() method
   */
  b64Chunks: (string | Stringable)[];
  /**
   * ex. [42, "hi", "okay"]
   */
  jsfxData: (number | string)[];
};

/**
 * @callback ToString
 * @returns {string}
 */

/**
 * @typedef {Object} Stringable
 * @property {ToString} toString
 */

/**
 * A interface for the Reaper object that can represent both:
 * - structs (which have no .contents, .b64Chunks, or .jsfxData)
 * - objects (which do have .contents, and may have .b64Chunks or .jsfxData)
 *
 * Objects may be represented by instances of the ReaperBase class, while
 * structs shouldn't be. This may change in the future.
 *
 * The ReaData type is suitable for passing in to the ReaperBase constructor
 * @typedef {Object} ReaData
 * @property {string} token Reaper token such as VST, TRACK, or NAME
 * @property {(number|string)[]} [params=[]] ex. ["hi", 5000]]
 * @property {(ReaData|ReaperBase)[]} [contents=[]]
 * @property {(string|Stringable)[]} [b64Chunks=[]] each element is a string or an
 * object with a toString() method
 * @property {(number|string)[]} [jsfxData=[]] ex. [42, "hi", "okay"]
 */

//const { splitBase64String } = require('./base64')
/*
type ReaperBaseParam = {
  token: string;
  params: string[];
  contents: string[];
  b64Chunks: string[];
  jsfxData: string
};*/
/**
 * The parser will return ReaperBase instances for all objects it detects. It
 * the consuming code may use rppp.specialize on these instances in order to
 * access helper methods.
 */
class ReaperBase {
  /**
   * @param {ReaData} obj
   */
  params: (number | string)[];
  token: string;
  contents: (ReaData | ReaperBase)[];
  b64Chunks: (string | Stringable)[];
  jsfxData: (number | string)[];
  //constructor ({ token, params = [], contents = [], b64Chunks = [], jsfxData = [] } = {}) {
  constructor(reparam: ReaData) {
    if (!reparam.token) throw new TypeError('ReaperBase needs a .token string')
    if (typeof reparam.token !== 'string') throw new TypeError('ReaperBase .token must be a string')
    if (!Array.isArray(reparam.params)) throw new TypeError('ReaperBase .params must be an Array')
    if (!Array.isArray(reparam.contents)) throw new TypeError('ReaperBase .contents must be a Array')
    if (!Array.isArray(reparam.b64Chunks)) throw new TypeError('ReaperBase .b64Chunks must be a Array')

    /**
     * @member {string} token A .RPP token, for example: VST, TRACK, or NAME
     */
    this.token = reparam.token

    /**
     * @member {(number|string)[]} params Strings or numbers that follow the token
     */
    this.params = reparam.params;

    /**
     * @member {(ReaperBase|ReaData)[]} contents All children as structured data
     */
    this.contents = reparam.contents

    /**
     * @member {(string|Stringable)[]} b64Chunks[] Each item in the array will
     * represent a b64 chunk. When an object has multiple chunks (VSTs have 3),
     * each chunk will be stored as a single string even if it's textual
     * representation spans multiple lines. The dump method is responsible for
     * splitting up long b64 strings.
     *
     * IMPORTANT: Any objects in .b64Chunks MUST have a .toString() method.
     */
    this.b64Chunks = reparam.b64Chunks

    /**
     * @member {(number|string)[]} jsfxData Strings or numbers that follow the token
     */
    this.jsfxData = reparam.jsfxData
  }

  /**
   * Gets the `index`'th struct with token `token` and returns the object.
   * If the `index`'th struct was not found, returns undefined.
   * @param {string} token
   * @param {number} index
   * @returns {ReaperBase|ReaData|undefined}
   */
  getStructByToken(token, index = 0) {
    let found = 0
    for (const obj of this.contents) {
      if (obj.token === token) {
        if (found === index) {
          return obj
        }
        found += 1
      }
    }
    return undefined
  }

  /**
   * Gets the `index`'th struct with token `token` and returns the object.
   * If the `index`'th struct was not found, then create a token and push
   * it to the end of the contents array.
   * @param {string} token
   * @param {number} index
   * @returns {ReaperBase|ReaData}
   */
  getOrCreateStructByToken(token, index = 0) {
    const struct = this.getStructByToken(token, index)
    return struct || this.createStruct(token, this.contents.length)
  }

  /**
   * Creates a struct with token `token` at index `index`.
   * @param {string} token
   * @param {number} index
   */
  createStruct(token, index = 0) {
    //const obj = { token: token, params: [] }
    const obj: ReaData = { token: token, params: [], contents: [], b64Chunks: [], jsfxData: [] }
    this.contents.splice(index, 0, obj)
    return this.contents[index]
  }

  /**
   * Adds a ReaData object to the contents array of this object.
   * @param {ReaData} obj
   */
  add(obj) {
    if (!obj) throw new Error('An argument is needed to be added to the contents array')
    this.contents.push(obj)
    return this
  }

  dump(indent = 0) {
    const start = '  '.repeat(indent) + '<' + ReaperBase.dumpStruct(this.token, this.params) + '\n'
    let body = ''
    // Output Sub Objects
    for (const o of this.contents) {
      if (o.contents) {
        //body += o.dump(indent + 1) + '\n'
        body += (o as ReaperBase).dump(indent + 1) + '\n'
      } else {
        body += ReaperBase.dumpStruct(o.token, o.params, indent + 1) + '\n'
      }
    }

    body += this.dumpB64Chunks(indent + 1)
    body += this.dumpJsfxData(indent + 1)

    const end = '  '.repeat(indent) + '>'
    return start + body + end
  }

  dumpB64Chunks(indent = 0) {
    let body = ''

    // Output base64 chunks, splitting long lines if needed
    if (this.b64Chunks.length) {
      const indentStr = '  '.repeat(indent)/*
      const b64Lines = this.b64Chunks
        .map(b64 => splitBase64String(typeof b64 === 'string' ? b64 : b64.toString()))
        .flat()
*/
      let b64Lines = this.b64Chunks
        .map((b64: string | Stringable) => {
          //return splitBase64String(typeof b64 === 'string' ? b64 : b64.toString())

          if (typeof b64 === 'string') {
            return b64;
          } else {
            return b64.toString();
          }

        })
        .flat();
      body += indentStr + b64Lines.join('\n' + indentStr) + '\n'
    }

    return body
  }

  dumpJsfxData(indent = 0) {
    let body = ''
    if (this.jsfxData.length) {
      const strings = this.jsfxData.map(value => {
        if (typeof value === 'string') return ReaperBase.dumpString(value)
        if (value === null) return '-'
        return value.toString()
      })

      body = '  '.repeat(indent) + strings.join(' ') + '\n'
    }

    return body
  }

  static dumpNum(i) {
    if (typeof i !== 'number') throw new TypeError('dumpNum was not passed a number')
    return i.toString()
  }

  static dumpString(s) {
    if (typeof s !== 'string') throw new TypeError('dumpString was not passed a string')

    if (s.includes(' ') || s.length === 0 || s[0] === '"' || s[0] === '`' || s[0] === "'") {
      if (s.includes('"')) {
        if (s.includes("'")) {
          if (s.includes('`')) {
            return '`' + s.replace(/`/g, "'") + '`'
          }
          return '`' + s + '`'
        }
        return "'" + s + "'"
      }
      return '"' + s + '"'
    }
    return s
  }

  static dumpParams(params:(number|string)[]) {
    let out = ''
    for (const param of params) {
      if (typeof param === 'number') out += ' ' + ReaperBase.dumpNum(param)
      else out += ' ' + ReaperBase.dumpString(param)
    }
    return out
  }

  static dumpStruct(token, params:(number|string)[], indent = 0) {
    const findSpecialStrings = function (params) {
      const specialStrings:string[] = []
      for (const param of params) {
        if (typeof param === 'string' && param.includes('"') && param.includes("'") && param.includes('`')) {
          specialStrings.push(param)
        }
      }
      return specialStrings
    }

    const dumpSpecialStrings = function (token, special, indent) {
      let res = ''
      for (const s of special) {
        const start = '\n  '.repeat(indent) + '<' + token + '\n'
        const body = '  '.repeat(indent + 1) + '|' + s + '\n'
        const end = '  '.repeat(indent) + '>'
        res += start + body + end
      }
      return res
    }

    const specialStrings = findSpecialStrings(params)
    const sparams = ReaperBase.dumpParams(params)
    let res = '  '.repeat(indent) + token + sparams

    res += dumpSpecialStrings(token, specialStrings, indent + 1)

    return res
  }
}

//module.exports = ReaperBase
