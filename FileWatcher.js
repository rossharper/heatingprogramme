'use strict'

const Chokidar = require('chokidar')

module.exports = {
    watchFile: function (file, onFileChangedCallback) {
        const watcher = Chokidar.watch(file)

        const log = console.log.bind(console)

        watcher
            .on('error', function (error) { log('Error happened', error) })

        watcher.on('ready', function () {
            log('Watching ' + file + ' for changes...')
            watcher
                .on('add', onFileChangedCallback)
                .on('change', onFileChangedCallback)
        })
    }
}
