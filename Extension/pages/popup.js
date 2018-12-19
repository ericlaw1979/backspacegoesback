// Copyright 2016 Google Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

let chrome=browser;

// Return true if the extension is permitted to run on the given URL, with
// the indicated permission for file:// schemes.
function urlAllowed(url, file_ok) {
  // Extensions are prohibited on the Chrome Web Store.
  if (url.startsWith('https://chrome.google.com/webstore/'))
    return false;

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

// Update the popup display depending on the current options and the URL of
// the current page.
function updatePopup(options, url) {
  var button = $('list-edit-button');

  if (!urlAllowed(url, options.file_ok)) {
    button.textContent = chrome.i18n.getMessage('popupAddBlacklist');
    button.disabled = true;
    setStatusError('popupDisallowedURL');
  } else if (options.blacklist.includes(url)) {
    button.textContent = chrome.i18n.getMessage('popupRemoveBlacklist');
  } else {
    button.textContent = chrome.i18n.getMessage('popupAddBlacklist');
  }
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

  // Load the active tab's URL, then set up page features that depend on it.
  chrome.tabs.query({active: true, currentWindow: true}, function(tabList) {
    var url = tabList[0].url;

    // Load settings.
    var options = {};
    chrome.storage.sync.get({
      blacklist: [],
      disableInApplets: true,
      whitelist: []
    }, function(items) {
      options = items;
      options.file_ok = true; // Edge feature gap. No setting available.
      updatePopup(options, url);
    });

    // Set event handlers that depend on the URL.
    $('list-edit-button').onclick = function() {
      var index = options.blacklist.indexOf(url);
      if (index > -1)
        options.blacklist.splice(index, 1);
      else
        options.blacklist.push(url);

      chrome.storage.sync.set({
        blacklist: options.blacklist,
        whitelist: options.whitelist
      }, function() {
        if (chrome.runtime.lastError) {
          setStatusError('errorSaving', chrome.runtime.lastError.message);
        } else {
          updatePopup(options, url);
          setStatus('popupStatusSaved');
        }
      });
    };

    $('feedback-link').onclick = function() {
      sendFeedback(url);
    };
  });

}

window.addEventListener('load', init);
