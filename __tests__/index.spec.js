const { writeFileSync } = require('fs')
const { chdir } = require('process')
const { rollup } = require('rollup')
const { fileSync, setGracefulCleanup } = require('tmp')
const test = require('ava')
const toml = require('../dist/index.js')

const bundle = async (rollupConfig) => {
  const bundle = await rollup(rollupConfig)
  const { output } = await bundle.generate({ format: 'esm' })
  const [{ code }] = output
  return code
}

chdir(__dirname)

test('can transform Key/Value Pair to JavaScript', async (t) => {
  const code = await bundle({
    input: './fixtures/keys/index.mjs',
    plugins: [toml()],
  })

  const tmpFile = fileSync({ postfix: '.mjs' })
  writeFileSync(tmpFile.name, code)

  const data = JSON.parse(JSON.stringify(await import(tmpFile.name))).default

  setGracefulCleanup()

  t.deepEqual(data.key, 'value')
  t.deepEqual(data.bare_key, 'value')
  t.deepEqual(data['bare-key'], 'value')
  t.deepEqual(data[1234], 'value')
  t.deepEqual(data['127.0.0.1'], 'value')
  t.deepEqual(data['character encoding'], 'value')
  t.deepEqual(data['ʎǝʞ'], 'value')
  t.deepEqual(data.physical, {
    color: 'orange',
    shape: 'round',
  })
  t.deepEqual(data.site, {
    'google.com': true,
  })
  t.deepEqual(data[''], 'blank')

  t.snapshot(data)
})

test('can transform String to JavaScript', async (t) => {
  const code = await bundle({
    input: './fixtures/string/index.mjs',
    plugins: [toml()],
  })

  const tmpFile = fileSync({ postfix: '.mjs' })
  writeFileSync(tmpFile.name, code)

  const data = JSON.parse(JSON.stringify(await import(tmpFile.name))).default

  setGracefulCleanup()

  t.deepEqual(data, {
    str: `I'm a string. "You can quote me". Name\tJosé\nLocation\tSF.`,
    str1: 'Roses are red\nViolets are blue',
    str2: 'Roses are red\nViolets are blue',
    str3: 'The quick brown fox jumps over the lazy dog.',
    str4: 'The quick brown fox jumps over the lazy dog.',
    str5: 'Here are two quotation marks: "". Simple enough.',
    str6: 'Here are three quotation marks: """.',
    str7: 'Here are fifteen quotation marks: """"""""""""""".',
    winpath: 'C:\\Users\\nodejs\\templates',
    winpath2: '\\\\ServerX\\admin$\\system32\\',
    quoted: 'Tom "Dubs" Preston-Werner',
    regex: '<\\i\\c*\\s*>',
    regex2: "I [dw]on't need \\d{2} apples",
    lines:
      'The first newline is\n' +
      'trimmed in raw strings.\n' +
      '   All other whitespace\n' +
      '   is preserved.\n',
    quot15: 'Here are fifteen quotation marks: """""""""""""""',
  })

  t.snapshot(data)
})

test('can transform Number to JavaScript', async (t) => {
  const code = await bundle({
    input: './fixtures/number/index.mjs',
    plugins: [toml()],
  })

  const tmpFile = fileSync({ postfix: '.mjs' })
  writeFileSync(tmpFile.name, code)

  const data = JSON.parse(JSON.stringify(await import(tmpFile.name))).default

  setGracefulCleanup()

  t.deepEqual(data, {
    int1: 99,
    int2: 42,
    int3: 0,
    int4: -17,
    int5: 1000,
    int6: 5349221,
    int7: 5349221,
    int8: 12345,
    hex1: 3735928559,
    hex2: 3735928559,
    hex3: 3735928559,
    oct1: 342391,
    oct2: 493,
    bin1: 214,
    flt1: 1,
    flt2: 3.1415,
    flt3: -0.01,
    flt4: 5e22,
    flt5: 1000000,
    flt6: -0.02,
    flt7: 6.626e-34,
    flt8: 224617.445991228,
    sf1: null,
    sf2: null,
    sf3: null,
    sf4: null,
    sf5: null,
    sf6: null,
  })

  t.snapshot(data)
})

test('can transform Boolean to JavaScript', async (t) => {
  const code = await bundle({
    input: './fixtures/boolean/index.mjs',
    plugins: [toml()],
  })

  const tmpFile = fileSync({ postfix: '.mjs' })
  writeFileSync(tmpFile.name, code)

  const data = JSON.parse(JSON.stringify(await import(tmpFile.name))).default

  setGracefulCleanup()

  t.deepEqual(data.bool1, true)
  t.deepEqual(data.bool2, false)

  t.snapshot(data)
})

test('can transform DateTime to JavaScript', async (t) => {
  const code = await bundle({
    input: './fixtures/dateTime/index.mjs',
    plugins: [toml()],
  })

  const tmpFile = fileSync({ postfix: '.mjs' })
  writeFileSync(tmpFile.name, code)

  const data = JSON.parse(JSON.stringify(await import(tmpFile.name))).default

  setGracefulCleanup()

  t.deepEqual(data, {
    odt1: '1979-05-27T07:32:00.000Z',
    odt2: '1979-05-27T07:32:00.000Z',
    odt3: '1979-05-27T07:32:00.999Z',
    odt4: '1979-05-27T07:32:00.000Z',
    ldt1: '1979-05-27T07:32:00.000Z',
    ldt2: '1979-05-27T00:32:00.999Z',
    ld1: '1979-05-27T00:00:00.000Z',
    lt1: '0000-01-01T07:32:00.000Z',
  })

  t.snapshot(data)
})

test('can transform Array to JavaScript', async (t) => {
  const code = await bundle({
    input: './fixtures/array/index.mjs',
    plugins: [toml()],
  })

  const tmpFile = fileSync({ postfix: '.mjs' })
  writeFileSync(tmpFile.name, code)

  const data = JSON.parse(JSON.stringify(await import(tmpFile.name))).default

  setGracefulCleanup()

  t.deepEqual(data, {
    bool1: true,
    bool2: false,
    integers: [1, 2, 3],
    colors: ['red', 'yellow', 'green'],
    nested_arrays_of_ints: [
      [1, 2],
      [3, 4, 5],
    ],
    nested_mixed_array: [
      [1, 2],
      ['a', 'b', 'c'],
    ],
    string_array: ['all', 'strings', 'are the same', 'type'],
    integers2: [1, 2, 3],
    integers3: [1, 2],
  })

  t.snapshot(data)
})

test('can transform Table to JavaScript', async (t) => {
  const code = await bundle({
    input: './fixtures/table/index.mjs',
    plugins: [toml()],
  })

  const tmpFile = fileSync({ postfix: '.mjs' })
  writeFileSync(tmpFile.name, code)

  const data = JSON.parse(JSON.stringify(await import(tmpFile.name))).default

  setGracefulCleanup()

  t.deepEqual(data, {
    'table-1': { key1: 'some string', key2: 123 },
    'table-2': { key1: 'another string', key2: 456 },
    dog: { 'tater.man': { type: { name: 'pug' } } },
    products: [
      { name: 'Hammer', sku: 738594937 },
      {},
      { name: 'Nail', sku: 284758393, color: 'gray' },
    ],
  })

  t.snapshot(data)
})

test('can transform Rust Config to JavaScript', async (t) => {
  const code = await bundle({
    input: './fixtures/main/index.mjs',
    plugins: [toml()],
  })

  const tmpFile = fileSync({ postfix: '.mjs' })
  writeFileSync(tmpFile.name, code)

  const data = JSON.parse(JSON.stringify(await import(tmpFile.name))).default

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

  t.deepEqual(data.title, 'TOML Example')
  t.deepEqual(data.owner, {
    name: 'Tom Preston-Werner',
    dob: '1969-03-09T10:00:00.000Z',
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

  t.snapshot(data)
})
