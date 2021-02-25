'use strict'

const Programme = require('./Programme').Programme
const ProgrammeFileLoader = require('./ProgrammeFileLoader')
const ProgrammeChangeWatcher = require('./ProgrammeChangeWatcher')
const ProgrammeFileWriter = require('./ProgrammeFileWriter')

module.exports = {
    Programme: Programme,
    ProgrammeFileLoader: ProgrammeFileLoader,
    ProgrammeChangeWatcher: ProgrammeChangeWatcher,
    ProgrammeFileWriter: ProgrammeFileWriter
}
