export interface Y18NOpts {
  directory?: string;
  updateFiles?: boolean;
  locale?: string;
  fallbackToLanguage?: boolean;
}

interface Work {
  directory: string;
  locale: string;
  cb: Function
}

export interface Locale {
  [key: string]: string
}

interface CacheEntry {
  [key: string]: string;
}

export interface PlatformShim {
  fs: {
    readFileSync: Function,
    writeFile: Function
  },
  exists: Function,
  format: Function,
  resolve: Function
}

let shim: PlatformShim
class Y18N {
  directory: string;
  updateFiles: boolean;
  locale: string;
  fallbackToLanguage: boolean;
  writeQueue: Work[];
  cache: {[key: string]: {[key: string]: CacheEntry|string}};

  constructor (opts: Y18NOpts) {
    // configurable options.
    opts = opts || {}
    this.directory = opts.directory || './locales'
    this.updateFiles = typeof opts.updateFiles === 'boolean' ? opts.updateFiles : true
    this.locale = opts.locale || 'en'
    this.fallbackToLanguage = typeof opts.fallbackToLanguage === 'boolean' ? opts.fallbackToLanguage : true

    // internal stuff.
    this.cache = Object.create(null)
    this.writeQueue = []
  }

  __ (...args: (string|Function)[]): string {
    if (typeof arguments[0] !== 'string') {
      return this._taggedLiteral(arguments[0] as string[], ...arguments)
    }
    const str: string = args.shift() as string

    let cb: Function = function () {} // start with noop.
    if (typeof args[args.length - 1] === 'function') cb = (args.pop() as Function)
    cb = cb || function () {} // noop.

    if (!this.cache[this.locale]) this._readLocaleFile()

    // we've observed a new string, update the language file.
    if (!this.cache[this.locale][str] && this.updateFiles) {
      this.cache[this.locale][str] = str

      // include the current directory and locale,
      // since these values could change before the
      // write is performed.
      this._enqueueWrite({
        directory: this.directory,
        locale: this.locale,
        cb
      })
    } else {
      cb()
    }

    return shim.format.apply(shim.format, [this.cache[this.locale][str] || str].concat(args as string[]))
  }

  __n () {
    const args = Array.prototype.slice.call(arguments)
    const singular: string = args.shift()
    const plural: string = args.shift()
    const quantity: number = args.shift()

    let cb = function () {} // start with noop.
    if (typeof args[args.length - 1] === 'function') cb = args.pop()

    if (!this.cache[this.locale]) this._readLocaleFile()

    let str = quantity === 1 ? singular : plural
    if (this.cache[this.locale][singular]) {
      const entry = this.cache[this.locale][singular] as CacheEntry
      str = entry[quantity === 1 ? 'one' : 'other']
    }

    // we've observed a new string, update the language file.
    if (!this.cache[this.locale][singular] && this.updateFiles) {
      this.cache[this.locale][singular] = {
        one: singular,
        other: plural
      }

      // include the current directory and locale,
      // since these values could change before the
      // write is performed.
      this._enqueueWrite({
        directory: this.directory,
        locale: this.locale,
        cb
      })
    } else {
      cb()
    }

    // if a %d placeholder is provided, add quantity
    // to the arguments expanded by util.format.
    var values: (string|number)[] = [str]
    if (~str.indexOf('%d')) values.push(quantity)

    return shim.format.apply(shim.format, values.concat(args))
  }

  setLocale (locale: string) {
    this.locale = locale
  }

  getLocale () {
    return this.locale
  }

  updateLocale (obj: Locale) {
    if (!this.cache[this.locale]) this._readLocaleFile()

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        this.cache[this.locale][key] = obj[key]
      }
    }
  }

  _taggedLiteral (parts: string[], ...args: string[]) {
    let str = ''
    parts.forEach(function (part, i) {
      var arg = args[i + 1]
      str += part
      if (typeof arg !== 'undefined') {
        str += '%s'
      }
    })
    return this.__.apply(this, [str].concat([].slice.call(args, 1)))
  }

  _enqueueWrite (work: Work) {
    this.writeQueue.push(work)
    if (this.writeQueue.length === 1) this._processWriteQueue()
  }

  _processWriteQueue () {
    var _this = this
    var work = this.writeQueue[0]

    // destructure the enqueued work.
    var directory = work.directory
    var locale = work.locale
    var cb = work.cb

    var languageFile = this._resolveLocaleFile(directory, locale)
    var serializedLocale = JSON.stringify(this.cache[locale], null, 2)

    shim.fs.writeFile(languageFile, serializedLocale, 'utf-8', function (err: Error) {
      _this.writeQueue.shift()
      if (_this.writeQueue.length > 0) _this._processWriteQueue()
      cb(err)
    })
  }

  _readLocaleFile () {
    var localeLookup = {}
    var languageFile = this._resolveLocaleFile(this.directory, this.locale)

    try {
      localeLookup = JSON.parse(shim.fs.readFileSync(languageFile, 'utf-8'))
    } catch (err) {
      if (err instanceof SyntaxError) {
        err.message = 'syntax error in ' + languageFile
      }

      if (err.code === 'ENOENT') localeLookup = {}
      else throw err
    }

    this.cache[this.locale] = localeLookup
  }

  _resolveLocaleFile (directory: string, locale: string) {
    var file = shim.resolve(directory, './', locale + '.json')
    if (this.fallbackToLanguage && !this._fileExistsSync(file) && ~locale.lastIndexOf('_')) {
      // attempt fallback to language only
      var languageFile = shim.resolve(directory, './', locale.split('_')[0] + '.json')
      if (this._fileExistsSync(languageFile)) file = languageFile
    }
    return file
  }

  _fileExistsSync (file: string) {
    return shim.exists(file)
  }
}

export function y18n (opts: Y18NOpts, _shim: PlatformShim) {
  shim = _shim
  const y18n = new Y18N(opts)
  return {
    __: y18n.__.bind(y18n),
    __n: y18n.__n.bind(y18n),
    setLocale: y18n.setLocale.bind(y18n),
    getLocale: y18n.getLocale.bind(y18n),
    updateLocale: y18n.updateLocale.bind(y18n),
    locale: y18n.locale
  }
}
