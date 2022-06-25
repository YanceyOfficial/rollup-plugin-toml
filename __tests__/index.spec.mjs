import { writeFileSync } from 'fs'
import { chdir } from 'process'
import { rollup } from 'rollup'
import { fileSync, setGracefulCleanup } from 'tmp'
import test from 'ava'
import toml from '../dist/index.js'

const bundle = async (rollupConfig) => {
  const bundle = await rollup(rollupConfig)
  const { output } = await bundle.generate({ format: 'esm' })
  const [{ code }] = output
  return code
}

chdir(__dirname)

test('can transform TOML to JavaScript', async (t) => {
  const code = await bundle({
    input: './fixtures/above/index.mjs',
    plugins: [toml()],
  })

  const tmpFile = fileSync({ postfix: '.mjs' })
  writeFileSync(tmpFile.name, code)

  const _data = await import(tmpFile.name)
  const data = JSON.parse(JSON.stringify(_data)).default

  setGracefulCleanup()

  t.deepEqual(data.title, 'TOML Example')
  t.deepEqual(data.owner, {
    name: 'Tom Preston-Werner',
    dob: new Date(-25711200000),
  })
  t.deepEqual(data.database, {
    enabled: true,
    ports: [8001, 8001, 8002],
    data: [['delta', 'phi'], [3.14]],
    temp_targets: { cpu: 79.5, case: 72 },
  })
  t.deepEqual(data.servers, {
    alpha: { ip: '10.0.0.1', role: 'frontend' },
    beta: { ip: '10.0.0.2', role: 'backend' },
  })
})

test('can transform rust config TOML to JavaScript', async (t) => {
  const code = await bundle({
    input: './fixtures/array/index.mjs',
    plugins: [toml()],
  })

  const tmpFile = fileSync({ postfix: '.mjs' })
  writeFileSync(tmpFile.name, code)

  const _data = await import(tmpFile.name);
  const data = JSON.parse(JSON.stringify(_data)).default

  setGracefulCleanup()

  t.deepEqual(data.package, {
    name: 'toml-example',
    version: '0.1.0',
    edition: '2018',
    authors: [
      'Yancey Leo <yanceyofficial@gmail.com>',
      'YanceyOfficial <develop@yanceyleo.com>',
    ],
  })
  t.deepEqual(data.dependencies, {
    uuid: { version: '0.8.2', features: ['v4'] },
    rand: '0.8.4',
    'ferris-says': '0.2.0',
  })
})
