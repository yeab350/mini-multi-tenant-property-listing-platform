from pypdf import PdfReader

pdf_path = r"c:\\Users\\yeabt\\Documents\\HTML\\Mini Multi-Tenant Property Listing Platform\\Exam.pdf"
reader = PdfReader(pdf_path)
print(f"pages: {len(reader.pages)}")

for idx, page in enumerate(reader.pages, start=1):
    text = page.extract_text() or ""
    print(f"\n--- PAGE {idx} ---\n")
    print(text)
