/* eslint-env browser */
/* global emailModule */

QPDF.path = '../src/';

if (window.cordova) {
  document.addEventListener('deviceready', deviceready);
} else {
  deviceready();
}

function deviceready () {
  window.URL = window.URL || window.webkitURL;
  const consoleElement = document.getElementById('console');
  const outputElement = document.getElementById('output').children[0];
  function stdout (txt) {
    console.log('[stdout]', txt);
    consoleElement.innerHTML += txt + '\n';
  }
  window.start = start; // so the button can call it
  function start () {
    stdout('start');
    QPDF.encrypt({
      logger: stdout,
      arrayBuffer: QPDF.base64ToArrayBuffer(myPdfBase64),
      userPassword: 'testme',
      ownerPassword: 'testme',
      callback: function (err, arrayBuffer) {
        if (err) {
          alert(err.message);
        } else {
          sendFile(arrayBuffer);
        }
      }
    });
  }

  function sendFile (arrayBuffer) {
    if (window.cordova) {
      const base64 = QPDF.arrayBufferToBase64(arrayBuffer);
      const fileName = 'my-file.pdf';
      emailModule.hasEmailPlugin(function (status) {
        if (status) {
          const recipient = [];
          const subject = 'PDF File';
          const body = 'Attached is a lovely PDF file, the password is testme.';
          const attachments = ['base64:' + fileName + '//' + base64];
          emailModule.openEmail(recipient, subject, body, attachments);
        } else {
          emailModule.alertErrorEmailPermission();
        }
      });
    } else {
      const imageElement = getImage(arrayBuffer);
      imageElement.style.display = 'hidden';
      outputElement.appendChild(imageElement);
      const downloadLinkElement = document.createElement('a');
      downloadLinkElement.className = 'download';
      downloadLinkElement.download = 'my-file.pdf';
      downloadLinkElement.href = imageElement.src;
      downloadLinkElement.innerHTML = 'Download';
      document.body.appendChild(downloadLinkElement);
    }
  }

  function getImage (arrayBuffer) {
    const data = new Uint8Array(arrayBuffer).buffer;
    const blob = new Blob([data], { type: 'application/pdf' });
    const src = window.URL.createObjectURL(blob);
    const imageElement = document.createElement('img');
    imageElement.src = src;
    return imageElement;
  }

  const myPdfBase64 = 'JVBERi0xLjQKJYCAgIAKMSAwIG9iago8PC9QYWdlcyAyIDAgUiAvVmlld2VyUHJlZmVyZW5jZXMgOCAwIFIgL1R5cGUgL0NhdGFsb2cgPj4KZW5kb2JqCjIgMCBvYmoKPDwvQ291bnQgMSAvTWVkaWFCb3ggWzAgMCA1OTYgODQyIF0gL1R5cGUgL1BhZ2VzIC9SZXNvdXJjZXMgMyAwIFIgL0tpZHMgWzUgMCBSIF0gPj4KZW5kb2JqCjMgMCBvYmoKPDwvRm9udCA3IDAgUiA+PgplbmRvYmoKNCAwIG9iago8PC9GaWx0ZXIgL0ZsYXRlRGVjb2RlIC9MZW5ndGggNjAgPj4Kc3RyZWFtCnic0zdUMDZSCEnjcgrhMlQwAEKwgLm5sZ6FuZGBoUJILpeGR2pOTr5CeH5RToqipkJIFpdrCBcAWMsNBgplbmRzdHJlYW0KZW5kb2JqCjUgMCBvYmoKPDwvUGFyZW50IDIgMCBSIC9UeXBlIC9QYWdlIC9Db250ZW50cyA0IDAgUiA+PgplbmRvYmoKNiAwIG9iago8PC9CYXNlRm9udCAvQ291cmllci1Cb2xkIC9TdWJ0eXBlIC9UeXBlMSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvVHlwZSAvRm9udCA+PgplbmRvYmoKNyAwIG9iago8PC8xIDYgMCBSID4+CmVuZG9iago4IDAgb2JqCjw8L0Rpc3BsYXlEb2NUaXRsZSB0cnVlID4+CmVuZG9iago5IDAgb2JqCjw8L1N1YmplY3QgKP7/AFMAYQBtAHAAbABlACAAYQBiAG8AdQB0ACAAYQAgAHMAaQBtAHAAbABlACAAJwBoAGUAbABsAG8AIAB3AG8AcgBsAGQAJwAgAHUAcwBpAG4AZwAgAFAARABGACAAQwBsAG8AdwBuKSAvQ3JlYXRvciAo/v8AbwByAGcALgBwAGQAZgBjAGwAbwB3AG4ALgBzAGEAbQBwAGwAZQBzAC4AYwBsAGkALgBIAGUAbABsAG8AVwBvAHIAbABkAFMAYQBtAHAAbABlKSAvQXV0aG9yICj+/wBTAHQAZQBmAGEAbgBvACAAQwBoAGkAegB6AG8AbABpAG4AaSkgL0NyZWF0aW9uRGF0ZSAoRDoyMDExMDMwNTIwMDYxNSswMScwMCcpIC9Qcm9kdWNlciAo/v8AUABEAEYAIABDAGwAbwB3AG4AIABmAG8AcgAgAEoAYQB2AGEAIAAwAC4AMQAuADApIC9UaXRsZSAo/v8AUABEAEYAIABDAGwAbwB3AG4AIAAtACAASABlAGwAbABvACAAdwBvAHIAbABkACAAcwBhAG0AcABsAGUpID4+CmVuZG9iagp4cmVmCjAgMTAKMDAwMDAwMDAwMCA2NTUzNSBmDQowMDAwMDAwMDE1IDAwMDAwIG4NCjAwMDAwMDAwODggMDAwMDAgbg0KMDAwMDAwMDE4NyAwMDAwMCBuDQowMDAwMDAwMjE5IDAwMDAwIG4NCjAwMDAwMDAzNDkgMDAwMDAgbg0KMDAwMDAwMDQxMSAwMDAwMCBuDQowMDAwMDAwNTEwIDAwMDAwIG4NCjAwMDAwMDA1MzkgMDAwMDAgbg0KMDAwMDAwMDU4MSAwMDAwMCBuDQp0cmFpbGVyCjw8L1Jvb3QgMSAwIFIgL0luZm8gOSAwIFIgL1NpemUgMTAgPj4Kc3RhcnR4cmVmCjEwMzcKJSVFT0Y=';
}
