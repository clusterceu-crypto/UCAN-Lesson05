# UCAN Lesson 05 — Static HTML Package v1.0

**Contract:** `UCAN-L05-CEC-001`  
**Contract file:** `UCAN_Lesson_05_Consolidated_Executable_Contract_v1.0.md`  
**Contract SHA-256:** `d2aa2d32f49afe99d75e8469d83d02ed65365cfbc2f0a83e7926430a478104f8`  
**Lesson:** `UCAN-L05` — «Принципи природоорієнтованих рішень (NBS) у містах»  
**Package version:** `1.0`  
**Build date:** `2026-08-06`

## Package manifest

- `index.html` — semantic 13-route lesson shell.
- `css/style.css` — responsive, accessible and print styling.
- `js/script.js` — routing, state, Portfolio, assessment, QA Preview and local PDF behavior.
- `assets/L05-A01_From_Urban_Problem_to_NBS_Opportunity_v1.0.png` — sole approved visual asset.
- `vendor/pdfmake.min.js` — verified local `pdfmake@0.2.21` runtime.
- `vendor/vfs_fonts.js` — matching verified local VFS font bundle.
- `README.md` — this controlled package note.

No build system, package manager, framework, CDN, analytics, remote font or remote PDF service is required.

## Script load order

1. `vendor/pdfmake.min.js`
2. `vendor/vfs_fonts.js`
3. `js/script.js`

## SHA-256 manifest

| File | SHA-256 |
| --- | --- |
| `index.html` | `d708665d4692486380aa0cbf10309f0443a408dbf91f28c7db3945fee01a0a61` |
| `css/style.css` | `497f63fc1ca8b23ba969dd872bb1ca4dde08a7f0ba1ce4fed176da405dbc3a65` |
| `js/script.js` | `50cb0e6870f52bd7ec3ca70732a720c722dfe6d8d38a5bb20ea4b5d5cb699804` |
| `assets/L05-A01_From_Urban_Problem_to_NBS_Opportunity_v1.0.png` | `628f5d38fbe9a90c81523d8387779cd29d63d83596ed22ae540b9d176aec1c79` |
| `vendor/pdfmake.min.js` | `455045c9cbd7cd3723f4ceb630802980f95f82de03b32942f7d3141df7a920b1` |
| `vendor/vfs_fonts.js` | `23e7c970fa9e75d296ea565939502a69ab2184cf40756c7d4670b6dabf470b58` |

The final `README.md` and ZIP hashes are recorded in `UCAN_Lesson_05_Static_Verification_Report_v1.0.md`, avoiding a self-referential checksum.

## Run locally

The package is static. Serve the package root through any local static server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/`. Direct opening of `index.html` may work in browsers that permit local scripts and local storage; a static server is the controlled test method.

## Functional scope

- Routes `R01–R13` with route-based progress and sticky navigation.
- Previous Lesson 04 link and the reserved canonical Lesson 06 link.
- L05-A01 approved image and HTML-first L05-A02–L05-A06 components.
- `Картка можливості NBS для громади`: nine required and one conditional field.
- Autosave, explicit save, resume and separate confirmed Portfolio deletion.
- Five-question assessment and combined completion gate.
- Header reset that preserves the Portfolio artifact.
- Creator QA Preview only through `?qa=1`, in memory and without learner-state mutation.
- Local `pdfmake@0.2.21` PDF generation with Ukrainian Cyrillic through the matching VFS bundle.
- Offline core lesson behavior with no learner-data transmission.

## QA status

- Static Verification: **PASS**.
- Browser QA: **23/23 PASS**.
- BQ-11: **PASS**.
- Offline PDF generation: **PASS**.
- PDF Visual QA: **PASS**, including a two-page A4 long-value test.
- Missing-runtime accessible failure handling: **PASS**.

See the controlled QA reports stored outside the production ZIP.

## Vendor licence

`pdfmake@0.2.21` is licensed under the MIT License. The two vendor files are unmodified bytes extracted from the same verified official npm tarball. They may be used here only as the Lesson 05 local static PDF runtime and must not be silently substituted with another version, CDN copy, mirror, custom VFS or rebuilt output.

## Publication dependency

The configured next lesson address is `https://clusterceu-crypto.github.io/UCAN-Lesson06/`. Its live availability remains a deferred publication QA dependency and must be retested after Lesson 06 deployment. It does not block Lesson 05 static-package completion.

## Repository boundary

This package has not been committed, pushed, branched, deployed or used to configure GitHub Pages. A separate explicit authorization is required for controlled repository save.
