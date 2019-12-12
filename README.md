# QPDF.js

> A pure javascript library based on [QPDF](http://qpdf.sourceforge.net/).

## Features

- create web-optimized PDF files
- encrypt and password-protect PDF files
- merge and split PDFs

## Example Usage

#### encrypt a PDF file

```js
QPDF.encrypt({
  arrayBuffer: data,
  password: 'hardtoguess',
  callback: function (err, arrayBuffer) {
    if (err) {
      alert(err.message);
    } else {
      sendFile(arrayBuffer);
    }
  }
});
```

#### execute custom QPDF commands

List QPDF command line arguments:

```js
QPDF({
  logger: function (text) {
    console.log(text);
  },
  ready: function (qpdf) {
    qpdf.execute(['--help']);
  }
});
```

Decrypt a PDF file:

```js
QPDF({
  ready: function (qpdf) {
    qpdf.save('input.pdf', arrayBuffer);
    qpdf.execute(['--decrypt', '--password', 'hardtoguess', '--', 'input.pdf', 'output.pdf']);
    qpdf.load('output.pdf', function (err, arrayBuffer) {
      if (err) {
        alert(err.message);
      } else {
        sendFile(arrayBuffer);
      }
    });
  }
});
```

## Installation

Copy `src/*.js` to some directory. Import qpdf.js from your
HTML.

```html
<script type="text/javascript" src="/path/to/qpdf.js"></script>
```

## Description

### What is QPDF?

_(extracted from the QPDF website)_

QPDF is a command-line program that does structural,
content-preserving transformations on PDF files. It could have
been called something like pdf-to-pdf. It also provides many
useful capabilities to developers of PDF-producing software or
for people who just want to look at the innards of a PDF file
to learn more about how they work.

QPDF is capable of creating linearized (also known as
web-optimized) files and encrypted files. It is also capable
of converting PDF files with object streams (also known as
compressed objects) to files with no compressed objects or to
generate object streams from files that don't have them (or
even those that already do). QPDF also supports a special mode
designed to allow you to edit the content of PDF files in a
text editor. For more details, please see the documentation
links below.

QPDF includes support for merging and splitting PDFs through
the ability to copy objects from one PDF file into another and
to manipulate the list of pages in a PDF file. The QPDF
library also makes it possible for you to create PDF files
from scratch. In this mode, you are responsible for supplying
all the contents of the file, while the QPDF library takes
care off all the syntactical representation of the objects,
creation of cross references tables and, if you use them,
object streams, encryption, linearization, and other syntactic
details.

QPDF is not a PDF content creation library, a PDF viewer, or a
program capable of converting PDF into other formats. In
particular, QPDF knows nothing about the semantics of PDF
content streams. If you are looking for something that can do
that, you should look elsewhere. However, once you have a
valid PDF file, QPDF can be used to transform that file in
ways perhaps your original PDF creation can't handle. For
example, programs generate simple PDF files but can't
password-protect them, web-optimize them, or perform other
transformations of that type.

### What is QPDF.js?

QPDF.js provides a simple high level interface to perform
operations on PDF files, as well as a low level access
interface to execute any QPDF command.

QPDF.js embeds the QPDF full command line tools in a library
compiled with [emscripten](https://emscripten.org/).

The command line tool is ran from a separate thread (a web
worker).

The version distributed with this library has been compiled by
@jrmuizel and pulled from [this
repository](https://github.com/jrmuizel/qpdf.js).

Unfortunately it's not the latest version.

## API

### QPDF.encrypt(options)

> Create an ecrypted version of a PDF document

Options:

- `logger`: A `function(txt)` used for logging QPDF output.
- `arrayBuffer`: Input PDF data encoded in an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).
- `userPassword`: The user password _(default: empty string)_.
- `ownerPassword`: The owner password _(default: empty string)_.
- `keyLength`: may be `40`, `128`, or `256` _(default)_.
- `callback`: A `function(err, arrayBuffer)` called when processing is done.

Either or both of the user password and the owner password may be
empty strings.

**Example:**

```js
QPDF.encrypt({
  arrayBuffer: new Uint8Array(someData).buffer,
  userPassword: 'hardtoguess',
  ownerPassword: 'hardtoguess',
  callback: function (err, arrayBuffer) {
    if (err) {
      alert(err.message);
    } else {
      sendFile(arrayBuffer);
    }
  }
});
```

### QPDF(options)

> Start QPDF

`options` is an object with 2 fields:

- `ready`: Function called when QPDF is ready to receive commands.
- `logger`: A customer logger for QPDF output _(default to console.log)_

The `ready` callback takes a qpdf instance as its argument,
which you will use to send commands, such as `qpdf.load()`,
`qpdf.save()` and `qpdf.execute()` (see below).

In most common cases, you'll want to first *save* a file into
QPDF's execution environment, then *execute* QPDF with some
arguments, then *load* the resulting file.

Commands are run sequencially, in the same order as they are
emitted, so you don't have to wait for the previous command to
finish before sending the next one.

**Example:**

```js
QPDF({
  ready: function (qpdf) {
    qpdf.save('input.pdf', arrayBuffer);
    qpdf.execute(['--some-arguments', '--', 'input.pdf', 'output.pdf']);
    qpdf.load('output.pdf', function (err, arrayBuffer) {
      ...
    });
  }
});
```

### qpdf.save(filename, arrayBuffer, callback)

> Saves a file to QPDF's virtual file system.

Data has to be provided as an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

The callback is optional.

**Example:**

```js
qpdf.save('file.pdf', arrayBuffer, function(err) {
  if (err)
    alert(err.message);
  else
    console.log('file saved');
});
```

### qpdf.execute([args], callback)

> Execute a command with QPDF.

`args` is an array of strings, containing the arguments to
pass the QPDF command line tool.

The callback is optional.

**Example:**

```js
qpdf.execute(['--help'], function(err) {
  if (err)
    alert(err.message);
});
```

### qpdf.load(filename, callback)

> Loads a file from QPDF's virtual file system.

Data will be provided to the callback as an
[ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

**Example:**

```js
qpdf.load('output.pdf', function (err, arrayBuffer) {
  if (err) {
    alert(err.message);
  } else {
    console.log('it worked');
    sendFile(arrayBuffer);
  }
});
```

### QPDF.base64ToArrayBuffer(base64)

> Convert a base64 string to an
> [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer).

### QPDF.arrayBufferToBase64(arrayBuffer)

> Convert an [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
> to a base64 string.

## License and Copyright

QPDF.js is distributed under the same licensing terms as the
QPDF command line tool.

The Apache License Version 2.0

