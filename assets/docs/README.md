# Documents

Drop the Ionic Contractors capability statement here as:

    ionic-contractors-capability-statement.pdf

Then add this attribute to the `<form>` tag on the capability statement page (in
`tools/build.py`, the `capability-statement.html` entry) and rebuild:

    data-download-url="assets/docs/ionic-contractors-capability-statement.pdf"

The download button appears automatically once the form is submitted successfully.

Two notes:

1. This document — not the public site — is where the principals' operator experience and
   past performance appear. Nothing in that vein belongs on the public pages.
2. Produce it as a tagged, accessible PDF (real text, reading order, alt text on graphics).
   The site's accessibility statement commits to providing an alternative format on request.
