const noop = () => {};

export function sendGetCall(options) {
  sendRequest('GET', options);
}

export function sendPostCall(options) {
  sendRequest('POST', options);
}

function sendRequest(method, options) {
  let { networkOptions, successCallback = noop, errorCallback = noop } = options;

  const url = `${networkOptions.scheme}://${networkOptions.hostname}${networkOptions.path}`;
  const body = networkOptions.body;
  const customHeaders = networkOptions.headers || {};
  const timeout = networkOptions.timeout;

  const xhr = new XMLHttpRequest();

  if (timeout) {
    xhr.timeout = timeout;
  }

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      const response = xhr.responseText;

      if (method === 'GET') {
        const parsedResponse = JSON.parse(response);
        successCallback(parsedResponse);
      } else {
        successCallback(response);
      }

      // printLog(properties);
    } else {
      errorCallback(xhr.statusText);
      // printLog(properties);
    }
  };

  // Set up a callback function that is called if the request fails
  xhr.onerror = function () {
    // An error occurred during the transaction
    console.error('Request failed:', xhr.status, xhr.statusText);
    errorCallback(xhr.statusText);
  };

  // Set up a callback function that is called if the request times out
  if (timeout) {
    xhr.ontimeout = function () {
      // The request timed out
      console.error('Request timed out');
    };
  }

  xhr.open(method, url, true);

  for (var headerName in customHeaders) {
    if (customHeaders.hasOwnProperty(headerName)) {
      // Skip the Content-Type header
      // Request header field content-type is not allowed by Access-Control-Allow-Headers
      if (headerName !== 'Content-Type' && headerName !== 'Content-Length') {
        xhr.setRequestHeader(headerName, customHeaders[headerName]);
      }
    }
  }

  if (method === 'POST') {
    // Set the request method to POST and specify the URL

    xhr.send(JSON.stringify(body));
  } else if (method === 'GET') {
    xhr.send();
  }
}
