import path from 'path'
import fs from 'fs'
import ejs from 'ejs'

const contributorsFolder = path.join(__dirname, '../contributors')
const templateFile = path.join(__dirname, '../templates/main.ejs')
const template = fs.readFileSync(templateFile, 'utf8')

export default function main () {
  console.log('todo')
}

export function getAllFileNames (folder) {
  return fs.readdirSync(folder)
}

export function getAllContributorsData (folder = contributorsFolder) {
  return getAllFileNames(folder)
    .filter(name => name !== '.gitkeep')
    .map(filename => path.join(folder, filename))
    .map(fullPath => ({
      fullPath,
      data: fs.readFileSync(fullPath, 'utf8')
    }))
}

export function parseContributor (fullPath, rawContributor) {
  if (typeof rawContributor !== 'string') {
    throw new Error(`Invalid ${fullPath} type`)
  }

  const lines = rawContributor.split('\n')

  if (lines.length !== 3) {
    throw new Error(`Contributor ${fullPath} should have 3 lines. Has ${lines.length}`)
  }

  if (lines.some(line => !line.length)) {
    throw new Error(`Contributor ${fullPath} should not have empty lines.`)
  }

  const [name, username, message] = lines

  if (!username.startsWith('@')) {
    throw new Error(`Contributor ${fullPath} username (second line) should start with @.`)
  }

  if (message.length > 140) {
    throw new Error(`Contributor ${fullPath} message is too long (> 140 characters).`)
  }

  return {
    name,
    username: username.slice(1), // remove @
    message
  }
}

export function getValidContributors (folder) {
  return getAllContributorsData(folder)
    .map(({ fullPath, data }) => parseContributor(fullPath, data))
}

export function renderTemplate (users) {
  return ejs.render(template, { users })
}
