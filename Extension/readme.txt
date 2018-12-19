Go back with the backspace button! This extension re-enables the backspace key
as a back navigation button -- except if you're writing text.

Before Edge44/EdgeHTML18, the backspace key navigated back (if you weren't writing
text). Many people lost their progress while working online by accidentally
pressing backspace and leaving a page -- so we removed the feature from Edge,
and created this extension for those who prefer the old behavior.

This extension can't restore backspace on certain special pages that do not
allow extensions to run script.

About the requested permissions:

"Read and modify all your data": In order to capture backspace on every page,
the extension needs to install a little piece of code on each one, including
tabs that are already open when the extension itself is installed or updated.
It does nothing else with the page, its information, or your typing.

"Manage your apps, extensions, and themes": This lets the extension detect
when it has been re-enabled and install its code into tabs that are already
open then, too.

This version of the extension was modified to remove extension API calls
not yet implemented in Microsoft Edge.
