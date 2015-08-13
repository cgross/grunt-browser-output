/* global document,window,console,WebSocket */
(function grunt_browser_output(ssl, host){

  if (typeof ssl === 'undefined'){
    var scripts = document.getElementsByTagName('script'),
        path = scripts[scripts.length-1].src,
        indexOfSsl = path.indexOf('ssl='),
        indexOfHost = path.indexOf('host=');

        ssl = (indexOfSsl === -1 ? false : path.substr(indexOfSsl + 4, 4) === 'true');
        host = (indexOfHost === -1 && path.substr(indexOfHost + 5, 9) === 'localhost' ? false : 'localhost');
  }

  if (document.readyState !== 'interactive' && document.readyState !== 'complete') {
    window.setTimeout(grunt_browser_output.bind(this, ssl, host), 100);
    return;
  }

  if (typeof WebSocket === undefined){
    console.log('grunt-browser-output - websockets not available');
    return;
  }

  var protocol = ssl ? 'wss' : 'ws',
      hostname = host ? host : document.location.hostname,
      port = '37901',
      connection = new WebSocket(protocol + '://' + hostname + ':' + port);

  connection.onmessage = function (e){
    var data = JSON.parse(e.data),
        line;

    if (data.orig) {
      line = data.orig.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '').trim();

      if (line !== '') {
        if (data.isError) {
          console.error('GRUNT: ' + line);
        } else {
          console.info('GRUNT: ' + line);
        }
      }
    }
  };
})();
