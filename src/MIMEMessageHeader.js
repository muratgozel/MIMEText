import MIMETextError from './MIMETextError.js'

/*
* Headers are based on: https://www.rfc-editor.org/rfc/rfc4021#section-2.1
* (Some are ignored as they can be added later or as a custom header.)
*/

export default class MIMEMessageHeader {
  constructor(placement) {
    this.placement = placement
    this.store = [
      {
        placement: 'header',
        name: 'Date',
        // value property is what user sets for this header
        value: null,
        // the generator function generates a value for this header unless
        // user specified a value or user disabled this property
        generator: () => (new Date().toGMTString()).replace(/GMT|UTC/gi, '+0000'),
        disabled: false,
        dump: (v) => {
          return v
        }
      },
      {
        placement: 'header',
        name: 'From',
        // required property indicates that this property must be set
        required: true,
        dump: (v) => {
          return v.dump()
        }
      },
      {
        placement: 'header',
        name: 'Sender',
        dump: (v) => {
          return v.dump()
        }
      },
      {
        placement: 'header',
        name: 'Reply-To',
        dump: (v) => {
          return v
        }
      },
      {
        placement: 'header',
        name: 'To',
        required: true,
        dump: (vs) => {
          return vs.map(v => v.dump()).join(', ')
        }
      },
      {
        placement: 'header',
        name: 'Cc',
        dump: (vs) => {
          return vs.map(v => v.dump()).join(', ')
        }
      },
      {
        placement: 'header',
        name: 'Bcc',
        dump: (vs) => {
          return vs.map(v => v.dump()).join(', ')
        }
      },
      {
        placement: 'header',
        name: 'Message-ID',
        disabled: false,
        generator: (ctx) => {
          const datestr = Date.now().toString()
          const randomstr = Math.random().toString(36).slice(2)
          const domain = ctx.store.filter(item => item.name == 'From')[0].value.getAddrDomain()
          return '<' + randomstr + '-' + datestr + '@' + domain + '>'
        },
        dump: (v) => {
          return v
        }
      },
      {
        placement: 'header',
        name: 'Subject',
        required: true,
        dump: (v, ctx) => {
          return '=?utf-8?B?' + ctx.toBase64(v) + '?='
        }
      },
      {
        placement: 'header',
        name: 'MIME-Version',
        generator: () => '1.0',
        dump: (v) => {
          return v
        }
      },
      {
        placement: 'content',
        name: 'Content-ID',
        dump: (v) => {
          return v
        }
      },
      {
        placement: 'content',
        name: 'Content-Type',
        dump: (v) => {
          return v
        }
      },
      {
        placement: 'content',
        name: 'Content-Transfer-Encoding',
        dump: (v) => {
          return v
        }
      },
      {
        placement: 'content',
        name: 'Content-Disposition',
        dump: (v) => {
          return v
        }
      }
    ]
  }

  set(name, value) {
    for (const item of this.store) {
      if (item.name.toLowerCase() == name.toLowerCase()) {
        item.value = value
        return item
      }
    }

    const newHeader = {
      custom: true,
      placement: this.placement,
      name: name,
      value: value,
      dump: (v) => {
        return v
      }
    }

    this.store.push(newHeader)

    return newHeader
  }

  get(name) {
    for (const item of this.store) {
      if (item.name.toLowerCase() == name.toLowerCase()) {
        return item.value
      }
    }
    return undefined
  }

  toObject() {
    return this.store.reduce((memo, item) => {
      memo[item.name] = item.value
      return memo
    }, {})
  }

  dump(envctx) {
    const ctx = {
      toBase64: envctx.toBase64,
      store: this.store
    }

    let lines = ''
    for (const item of this.store) {
      if (item.placement != this.placement) continue;

      const v = item.value
        ? item.value
        : !item.disabled && typeof item.generator == 'function'
          ? item.generator(ctx)
          : null

      if (!v && item.required) {
        throw new MIMETextError('MISSING_HEADER', `The "${item.name}" header is required.`)
      }

      if (!v) continue;

      lines += `${item.name}: ${item.dump(v, ctx)}\r\n`
    }

    return lines.slice(0, -2)
  }
}
