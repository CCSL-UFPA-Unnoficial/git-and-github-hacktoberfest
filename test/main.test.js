// TODO
import path from 'path'

import {
  getAllFileNames,
  getAllContributors,
  parseContributor
} from '..'

const contributorsFolder = path.join(__dirname, './fixtures/contributors')

test('getAllFileNames', () => {
  const got = getAllFileNames(contributorsFolder)
  const expected = [
    '.gitkeep',
    'a',
    'b',
    'c'
  ]
  expect(got).toEqual(expected)
})

test('getAllContributors', () => {
  const got = getAllContributors(contributorsFolder)
  expect(got.length).toBe(3)
})

test('parseContributor invalid', () => {
  const fakePath = '/path/'
  const contributor = {}

  const got = () => parseContributor(fakePath, contributor)
  expect(got).toThrowError(/invalid/i)
})

test('parseContributor no lines', () => {
  const fakePath = '/path/'
  const contributor = ''

  const got = () => parseContributor(fakePath, contributor)
  expect(got).toThrowError(/should have 3 lines/)
})

test('parseContributor wrong line count', () => {
  const fakePath = '/path/'
  const contributor = [
    'Lubien',
    '@lubien'
  ].join('\n')

  const got = () => parseContributor(fakePath, contributor)
  expect(got).toThrowError(/should have 3 lines/)
})

test('parseContributor empty lines', () => {
  const fakePath = '/path/'
  const contributor = [
    '',
    '',
    ''
  ].join('\n')

  const got = () => parseContributor(fakePath, contributor)
  expect(got).toThrowError(/should not have empty lines/)
})

test('parseContributor invalid username', () => {
  const fakePath = '/path/'
  const contributor = [
    'Lubien',
    'lubien',
    'My Message'
  ].join('\n')

  const got = () => parseContributor(fakePath, contributor)
  expect(got).toThrowError(/username \(second line\) should start with @/)
})

test('parseContributor message too long', () => {
  const fakePath = '/path/'
  const contributor = [
    'Lubien',
    '@lubien',
    Array.from(Array(141), () => 'a')
  ].join('\n')

  const got = () => parseContributor(fakePath, contributor)
  expect(got).toThrowError(/message is too long/)
})

test('parseContributor valid', () => {
  const fakePath = '/path/'
  const contributor = [
    'Lubien',
    '@lubien',
    'Hello World'
  ].join('\n')

  const got = parseContributor(fakePath, contributor)
  const expected = {
    name: 'Lubien',
    username: 'lubien',
    message: 'Hello World'
  }
  expect(got).toEqual(expected)
})
