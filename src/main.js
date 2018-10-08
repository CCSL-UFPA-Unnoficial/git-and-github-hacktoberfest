import path from 'path'
import fs from 'fs'

const contributorsFolder = path.join(__dirname, '../contributors')

export default function main () {
  console.log('todo')
}

export function getAllFileNames (folder) {
  return fs.readdirSync(folder)
}

export function getAllContributors (folder = contributorsFolder) {
  return getAllFileNames(folder)
    .filter(name => name !== '.gitkeep')
    .map(filename => path.join(folder, filename))
    .map(fullPath => fs.readFileSync(fullPath, 'utf8'))
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
    username: username.slice(1),  // remove @
    message
  }
}
