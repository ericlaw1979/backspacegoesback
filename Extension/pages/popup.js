// Copyright 2016 Google Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

let chrome=browser;

// Return true if the extension is permitted to run on the given URL, with
// the indicated permission for file:// schemes.
function urlAllowed(url, file_ok) {
  // Extensions are permitted to run on pages with schemes http, https, and
  // ftp, plus file if enabled.
  if (url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('ftp://'))
    return true;

  if (file_ok && url.startsWith('file://'))
    return true;

  return false;
}

// Set the status text and display it in the error style.
function setStatusError(message_id, placeholder) {
  setStatus(message_id, placeholder);
  $('status').classList.add('error');
}

// Set the status text.
function setStatus(message_id, placeholder) {
  if (placeholder === undefined)
    $('status').textContent = chrome.i18n.getMessage(message_id);
  else
    $('status').textContent = chrome.i18n.getMessage(message_id, placeholder);
}

// Initialize the page.
function init() {
  loadInternationalizedStrings();

  $('feedback-link').onclick = function() {
  sendFeedback(url);
  };
}

window.addEventListener('load', init);
