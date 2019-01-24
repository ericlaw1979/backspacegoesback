// Copyright 2016 Google Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Register a keyboard listener.  We capture the event
// at the Window to let any handlers or listeners registered on the Document
// have a chance to handle it first.
let chrome=browser;

window.addEventListener('keydown', handleBackspace);

// Check for shift-backspace or unmodified backspace and navigate if
// applicable.
function handleBackspace(e) {
  if (e.defaultPrevented ||
      e.key !== 'Backspace' ||
      e.altKey ||
      e.ctrlKey ||
      e.metaKey ||
      window.history.length < 2) // Nowhere to go back or forward to anyway.
    return;

  var target = e.target; // Edge doesn't support .composedPath()[0];
  if (isApplet(target))
    return;
  if (isEditable(target))
    return;

  // Make sure this extension is still active.
  // sendMessage throws an internal error, not reported in lastError, if the
  // other end no longer exists. So we use JS error-catching rather than
  // extension errors. See https://crbug.com/650872
  try {
    chrome.runtime.sendMessage('', function(response) {
      // Future-proofing in case sendMessage ever changes to setting lastError
      // instead of throwing a JS error.
      if (chrome.runtime.lastError) {
        window.removeEventListener('keydown', handleBackspace);
      } else {
        e.shiftKey ? window.history.forward(): window.history.back();
        e.preventDefault();
      }
    });
  } catch(error) {
    // If we have no connection to the background page, the extension has
    // been updated, disabled, or uninstalled. Remove our listener and do
    // nothing.
    window.removeEventListener('keydown', handleBackspace);
  }
}

// Return true if focus is in an embedded Flash/Java/PDF/etc applet.
function isApplet(target) {
  var nodeName = target.nodeName.toUpperCase();
  var nodeType = target.type || '';
  nodeType = nodeType.toLowerCase();
  if ((nodeName === 'EMBED' || nodeName === 'OBJECT') &&
      (nodeType === 'application/java' ||
       nodeType === 'application/pdf' ||
       nodeType === 'application/x-chat' ||
       nodeType === 'application/x-google-chrome-pdf' ||
       nodeType === 'application/x-shockwave-flash')) {
    return true;
  }
  return false;
}
