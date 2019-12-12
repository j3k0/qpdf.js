# QPDF.js

> A pure javascript library based on [QPDF](http://qpdf.sourceforge.net/).

## Features

- create web-optimized PDF files
- encrypt and password-protect PDF files
- merge and split PDFs

## Usage



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

## License and Copyright

QPDF.js is distributed under the same licensing terms as the
QPDF command line tool.

The Apache License Version 2.0

