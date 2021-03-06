import type { Plugin } from 'rollup'
import type { FilterPattern } from '@rollup/pluginutils'
import { createFilter, dataToEsm } from '@rollup/pluginutils'
import { parse } from '@iarna/toml'

export interface Options {
  include?: FilterPattern
  exclude?: FilterPattern
}

export default function toml(options: Options = {}): Plugin {
  const ext = /\.toml$/
  const filter = createFilter(options.include, options.exclude)

  return {
    name: 'toml',
    transform(code, id) {
      if (!ext.test(id) || !filter(id)) return null

      try {
        const parsed = parse(code)

        return {
          code: dataToEsm(parsed, {
            preferConst: true,
            namedExports: false,
            objectShorthand: true,
          }),
          map: { mappings: '' },
        }
      } catch (err) {
        const { message, col: column, line } = err
        const loc = {
          column,
          line
        }
        this.error({ message, id, loc })
      }
    },
  }
}
