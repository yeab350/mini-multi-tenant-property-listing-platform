import argparse
from pathlib import Path

from pypdf import PdfReader


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract text from a PDF.")
    parser.add_argument(
        "--pdf",
        dest="pdf_path",
        default=None,
        help="Path to PDF (defaults to ./Exam.pdf at repo root if present)",
    )
    args = parser.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    default_pdf = repo_root / "Exam.pdf"
    pdf_path = Path(args.pdf_path) if args.pdf_path else default_pdf

    if not pdf_path.exists():
        raise SystemExit(f"PDF not found: {pdf_path}")

    reader = PdfReader(str(pdf_path))
    print(f"pdf: {pdf_path}")
    print(f"pages: {len(reader.pages)}")

    for idx, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").strip()
        print(f"\n--- PAGE {idx} ---\n")
        print(text)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
