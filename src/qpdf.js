/* eslint-env browser */

(function () {
// The QPDF Module
  function QPDF (options) {
    const {
      logger = console.log.bind(console),
      ready
    } = options;
    let worker = new Worker('qpdf-worker.js');

    const listeners = {};
    let nListeners = 0;
    const addListener = function (id, fn) {
      listeners[id] = fn;
      nListeners += 1;
    };
    const callListener = function (id, err, arg) {
      const fn = listeners[id];
      if (fn) {
        delete listeners[id];
        fn(err, arg);
      }
      nListeners -= 1;

      if (nListeners === 0) {
        setTimeout(function () {
        // No new commands after 1 second?
        // Then we terminate the worker.
          if (worker !== null && nListeners === 0) {
            worker.terminate();
            worker = null;
          }
        }, 1000);
      }
    };

    const qpdf = {
      save (filename, arrayBuffer, callback) {
        if (!worker) { return callback(new Error('worker terminated')); }
        addListener(filename, callback);
        worker.postMessage({
          type: 'save',
          filename,
          arrayBuffer
        });
      },
      load (filename, callback) {
        if (!worker) { return callback(new Error('worker terminated')); }
        addListener(filename, callback);
        worker.postMessage({
          type: 'load',
          filename
        });
      },
      execute (args, callback) {
        if (!worker) { return callback(new Error('worker terminated')); }
        addListener('execute', callback);
        worker.postMessage({
          type: 'execute',
          args
        });
      }
    };

    worker.onmessage = function (event) {
      const message = event.data;

      switch (message.type) {
        case 'ready': {
          logger('[qpdf] ready');
          if (ready) {
            ready(qpdf);
          }
          break;
        }

        case 'stdout':
          logger('[qpdf.worker] ' + message.line);
          break;

        case 'saved': {
          const filename = message.filename;
          logger('[qpdf] ' + filename + ' saved');
          callListener(filename, null);
          break;
        }

        case 'loaded': {
          const { filename, arrayBuffer } = message;
          logger('[qpdf] ' + filename + ' loaded (' + arrayBuffer.length + ')');
          if (arrayBuffer) {
            callListener(filename, null, arrayBuffer);
          } else {
            callListener(filename, new Error('File not found'));
          }
          break;
        }

        case 'executed': {
          const { status } = message;
          logger('[qpdf] exited with status ' + status);
          if (status !== 0) {
            callListener('execute', new Error('QPDF exited with status ' + status));
          } else {
            callListener('execute', null);
          }
          break;
        }
      }
    };
  }

  QPDF.encrypt = function ({
    logger,
    arrayBuffer,
    userPassword,
    ownerPassword,
    keyLength,
    callback
  }) {
    const safeCallback = function (err, arg) {
      if (callback) {
        if (err || arg) {
          callback(err, arg);
          callback = null;
        }
      }
    };
    QPDF({
      logger,
      ready: function (qpdf) {
        qpdf.save('input.pdf', arrayBuffer, safeCallback);
        qpdf.execute([
          '--encrypt',
          userPassword || '',
          ownerPassword || '',
          String(keyLength || 256),
          '--',
          'input.pdf',
          'output.pdf'
        ], safeCallback);
        qpdf.load('output.pdf', safeCallback);
      }
    });
  };

  QPDF.help = function (logger) {
    QPDF({
      logger,
      ready: function (qpdf) {
        qpdf.execute(['--help']);
      }
    });
  };

  QPDF.base64ToArrayBuffer = function (base64) {
    const binary = window.atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  };

  QPDF.arrayBufferToBase64 = function (buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  window.QPDF = QPDF;
})();
