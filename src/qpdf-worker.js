/* eslint-env worker */
/* global FS */

function stdout (txt) {
  postMessage({
    type: 'stdout',
    line: txt
  });
}

var Module = {
  noInitialRun: true,
  // 'noFSInit' : true
  printErr: stdout,
  print: stdout
};

importScripts('qpdf-lib.js');

function getFileData (fileName) {
  var file = FS.root.contents[fileName];
  if (!file) { return null; }
  return file.contents;
  // return new Uint8Array(file.contents).buffer;
}

onmessage = function (event) {
  var message = event.data;

  switch (message.type) {
    case 'save': {
      const filename = message.filename;
      const arrayBuffer = message.arrayBuffer;
      stdout('saving ' + filename + ' (' + arrayBuffer.length + ')');
      const data = new Uint8Array(arrayBuffer);
      FS.createDataFile('/', filename, data, true, false);
      postMessage({
        type: 'saved',
        filename
      });
      break;
    }

    case 'load': {
      const filename = message.filename;
      stdout('loading ' + filename);
      postMessage({
        type: 'loaded',
        filename,
        arrayBuffer: getFileData(filename)
      });
      break;
    }

    case 'execute': {
      const args = message.args;
      stdout('$ qpdf ' + args.join(' '));
      let exitStatus = -1;
      Module.onExit = function (status) {
        exitStatus = status;
      };
      Module.callMain(args);
      postMessage({
        type: 'executed',
        status: exitStatus
      });
      break;
    }
  }
};

postMessage({
  type: 'ready'
});
