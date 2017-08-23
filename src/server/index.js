const Promise = require('bluebird');
const retry = require('bluebird-retry');
const http = require('http');
const express = require('express');
const path = require('path');
const config = require('config');
const debug = require('debug')('affichage-photos-jackpot:index');
const socketIo = require('socket.io');
const appRoot = require('app-root-path');
const chokidar = require('chokidar');

const PORT = process.env.PORT || config.get('server.port');
const IMAGES_PATH = path.join(appRoot.path, 'images')

let app;
let server;
let io;
let uids;
let scanStarted;

function start() {
  debug('Starting server...');

  debug('Modules initialized.', path.join(appRoot.path, 'dist'));
  app = express();
  app.use(express.static(path.join(appRoot.path, 'dist')));
  app.use('/images',express.static(IMAGES_PATH));

  server = http.Server(app);
  io = socketIo(server);
  io.on('connection', onConnection);

  server.listen(PORT, () => {
    debug(`App listening on port ${PORT}`);
  });

  var dirWatcher = chokidar.watch(IMAGES_PATH, {ignored: /^\./, persistent: true});
  dirWatcher
    .on('add', function(path) {
      debug('File', path, 'has been added');
      io.sockets.emit('imageAdded', { id: path.replace(/^.*[\\\/]/, '').replace('.png','') });
    })
    //.on('change', function(path) {console.log('File', path, 'has been changed');})
    //.on('unlink', function(path) {console.log('File', path, 'has been removed');})
    //.on('error', function(error) {console.error('Error happened', error);})

}

function onConnection(socket) {
  debug('Client socket connected');
  io.sockets.emit('news', { hello: 'world' });
}

module.exports = {
  start,
}
