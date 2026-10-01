# Local document search

[简体中文](README.md) · English

Search local text documents and view original text, file names and line numbers.

Runs locally in your browser. No account or paid API is required. Demo data is fictional.

[Open online](https://tianchaodaxing-beep.github.io/pandao-knowledge/?lang=en) · [Download](https://github.com/tianchaodaxing-beep/pandao-knowledge/releases/latest) · [All projects](https://github.com/tianchaodaxing-beep/pandao-open-tools)

## Getting started

Download and extract the ZIP, then open `index.html`. On Windows you can double-click `Start-tool.cmd`. Keep the entire extracted folder together. Click **English** in the header; click **中文** to return to Chinese. Language selection preserves current inputs. Use `?lang=en` for a direct English page.

1. Import TXT, Markdown, CSV or JSON text files; multiple files are supported.
2. Enter keywords or a question to find relevant original passages.
3. Export results or a document bundle that you can restore later.

## Files and data

Spreadsheet import supports `.xlsx`, `.xls`, `.csv` and `.tsv`. Only the first worksheet is read. A spreadsheet is limited to 20,000 rows and 10 MB. Text-file support varies by tool.

Spreadsheet templates and export headers follow the selected language. Chinese and English template headers can both be imported. User-entered content and numeric results are retained as entered. Data is processed on your device and is not uploaded by the tool. External feedback links open GitHub. Export any data you need before closing: inputs are not saved automatically.

## Supported scope

This is text search, without generated answers, PDF or Word reading, or OCR. Documents stay in page memory. Export a bundle before closing the page if you need to retain them.

## Development and licensing

Run `npm test` with Node.js 20 or later. Using the page requires no Node.js installation or runtime dependency.

MIT licensed. Commercial use, modification and redistribution are allowed while retaining the license notice. SheetJS Community Edition 0.20.3 uses Apache-2.0; see `THIRD_PARTY_NOTICES.md` and `vendor/SheetJS-LICENSE`.

## Feedback

Use the [issue tracker](https://github.com/tianchaodaxing-beep/pandao-knowledge/issues) to describe your use case and expected result. Use fictional examples in public reports; do not post customer data or credentials.

## Contact

Project enquiries and collaboration: [tianchaodaxing@gmail.com](mailto:tianchaodaxing@gmail.com)
