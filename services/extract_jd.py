import sys
import pdfplumber
import re
import json

# Hàm trích xuất thông tin JD từ các dòng văn bản
def parse_jd(lines):
    """
    Nhận vào list of strings 'lines' và trích:
      - metadata: job_title, location, department, reports_to, employment_type
      - sections: about_us, job_description, key_responsibilities,
                  required_qualifications, desired_skills, benefits, how_to_apply
    """
    # Mẫu detect metadata
    meta_labels = ["Job Title", "Location", "Department", "Reports To", "Employment Type"]
    meta_pattern = re.compile(r"^([^:]+):\s*(.+)$")

    # Mẫu detect bullet lines
    bullet_pattern = re.compile(r"^[·•\-\.\s]+(.+)$")

    # Tập hợp các section header
    headers = {
        "About Us", "Job Description", "Key Responsibilities",
        "Required Qualifications", "Desired Skills", "Benefits", "How to Apply"
    }

    meta = {}
    sections = {}
    current_section = None

    for raw in lines:
        line = raw.strip()
        if not line:
            continue

        # 1. Metadata
        m = meta_pattern.match(line)
        if m and m.group(1) in meta_labels:
            key = m.group(1).lower().replace(" ", "_")
            meta[key] = m.group(2)
            continue

        # 2. Section header
        if line in headers:
            current_section = line.lower().replace(" ", "_")
            sections[current_section] = []
            continue

        # 3. Nội dung trong section
        if current_section:
            # Bullet item?
            b = bullet_pattern.match(line)
            if b:
                sections[current_section].append(b.group(1).strip())
            else:
                sections[current_section].append(line)

    # Kết hợp metadata + sections
    return {**meta, **sections}

# Hàm trích xuất thông tin JD từ file PDF
def extract_jd_info(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
    
    # Tách văn bản thành các dòng
    lines = text.split("\n")
    return parse_jd(lines)

# Main runner để thực thi khi script được gọi từ command line
if __name__ == "__main__":
    # Lấy đường dẫn file PDF từ tham số đầu vào
    pdf_path = sys.argv[1]  # Đảm bảo truyền đường dẫn file PDF vào tham số
    jd_info = extract_jd_info(pdf_path)
    
    # In kết quả dưới dạng JSON
    print(json.dumps(jd_info, ensure_ascii=False, indent=2))
