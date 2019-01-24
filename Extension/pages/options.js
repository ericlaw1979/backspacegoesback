// Copyright 2016 Google Inc. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
let chrome=browser;

// Initialize the page.
function init() {
  loadInternationalizedStrings();

  $('feedback-link').onclick = function() {
    sendFeedback();
  };

}

window.addEventListener('load', init);
