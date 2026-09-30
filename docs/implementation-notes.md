# Implementation and validation notes

## Input and policy assumptions

The form accepts an Academic Paper file, the Code node renames its binary field for ZIP processing, and Compression decompresses it. Parse DOCX Structure then reads `file_4` and `file_6`. These property numbers came from one archive layout; a different DOCX can map them differently. Inspect them and bind document/style XML by archive entry name before broad document intake. The public workflow preserves the original mapping.

The policy pack contains 18 example requirements. Its institutional attribution has been replaced with example metadata; no official policy source has been verified. The rules are a configurable demonstration, not an assertion of compliance with a university's published requirements.

## What is actually checked

- Sections: exact normalized labels for Abstract, Introduction, Conclusion, and References; a substring for Declaration of Authorship. Title-page detection counts non-empty text among the first five paragraphs rather than verifying pagination, author/course/date fields, or layout.
- Abstract: words between the first Abstract and later Introduction. Missing boundaries set `checked:false` and `pass:false`; the report currently prioritizes `pass` and reports FAIL.
- Formatting: visible text runs and document defaults. Full named-style inheritance, themes, all sections, and Word pagination are not resolved.
- Margins: the first parsed page-margin definition, with 0.05 cm tolerance. Missing margins fail.
- Citations: supported surname/year regular expressions; this is not a complete citation-style grammar or source verification engine. References are compared by first-author surname and year.
- Headings: recognized Heading-style levels must begin at 1 and must not jump upward by more than one level. No headings can still produce PASS.
- Figures and quotations: heuristic relationships between detected drawings, adjacent paragraphs, captions, credits, and quotation formatting. Review states are used for selected uncertain cases; the system does not determine originality or plagiarism.

## Report semantics

Final policy states are PASS, FAIL, REVIEW_REQUIRED, and NOT_CHECKED. SKIPPED is an intermediate state normalized to NOT_CHECKED. A failing policy takes precedence in the overall result. Otherwise review-required or unchecked policies produce an overall REVIEW_REQUIRED.

Counts refer to policy checks; an individual policy can produce multiple issues, so issue count can exceed policy count. A PASS means only that the implemented detector found no violation. The report is not a visual proof of the rendered document.

## Local verification

`node tests/smoke.mjs` runs the exported XML normalization, formatting, policy, and report Code nodes on synthetic XML. It also checks missing references/margins, skipped heading levels, absent abstract boundaries, and unchecked report aggregation. The fixed fixture clock makes `examples/output.json` reproducible.

The test begins after ZIP extraction and does not verify upload behavior, binary helpers, archive entry selection, or rendering in Word. The screenshot is a separate original test run; it is not the synthetic fixture's output.
