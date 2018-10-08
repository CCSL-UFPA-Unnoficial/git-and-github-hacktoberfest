// TODO
import path from 'path'

import {
  getAllFileNames,
  getAllContributorsData,
  parseContributor,
  getValidContributors,
  renderTemplate
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

test('getAllContributorsData', () => {
  const got = getAllContributorsData(contributorsFolder)
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

test('getValidContributors', () => {
  const got = getValidContributors(contributorsFolder)
  const expected = [
    {
      name: 'Foo',
      username: 'foo',
      message: 'Lorem Ipsum'
    },
    {
      name: 'Bar',
      username: 'bar',
      message: 'Lorem Ipsum'
    },
    {
      name: 'Baz',
      username: 'baz',
      message: 'Lorem Ipsum'
    }
  ]
  expect(got).toEqual(expected)
})

test('renderTemplate', () => {
  const contributors = getValidContributors(contributorsFolder)

  const got = renderTemplate(contributors)

  for (let contributor of contributors) {
    expect(got).toEqual(expect.stringMatching(contributor.name))
    expect(got).toEqual(expect.stringMatching(contributor.username))
    expect(got).toEqual(expect.stringMatching(contributor.message))
  }
})
