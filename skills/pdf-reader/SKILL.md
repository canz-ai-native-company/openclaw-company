---
name: pdf-reader
description: Read and extract text from PDF files — documents, reports, contracts, spreadsheets. Use whenever you need to read PDF content, not just when explicitly asked. Handles local files, URLs, and WhatsApp attachments.
allowed-tools: Bash(pdf-reader:*)
---

# PDF Reader

## Quick start

```bash
pdf-reader extract report.pdf              # Extract all text
pdf-reader extract report.pdf --layout     # Preserve tables/columns
pdf-reader fetch https://example.com/doc.pdf  # Download and extract
pdf-reader info report.pdf                 # Show metadata + size
pdf-reader list                            # List all PDFs in directory tree
```

## WhatsApp PDF attachments

When a user sends a PDF on WhatsApp, it is automatically saved to the `attachments/` directory. The message will include a path hint like:

> [PDF: attachments/document.pdf (150KB)]
> Use: pdf-reader extract attachments/document.pdf

To read the attached PDF:

```bash
pdf-reader extract attachments/document.pdf --layout
```
