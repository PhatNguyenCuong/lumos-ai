import sys
import json
import re
from typing import List, Dict
import pdfplumber # type: ignore

# ==== 1. Load lines from PDF ====
def load_lines(path):
    lines = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ""
            for line in text.split("\n"):
                clean = line.strip()
                if clean:
                    lines.append(clean)
    return lines

# ==== 2. Filter and group sections ====
def filter_lines(lines: List[str]) -> List[str]:
    return [ln for ln in lines if not re.match(r'^Page\s*\d+\s*of\s*\d+', ln, re.IGNORECASE)]

def group_sections(lines: List[str]) -> Dict[str, List[str]]:
    headings = {
        'PROFESSIONAL SUMMARY',
        'EDUCATION BACKGROUND',
        'WORKING EXPERIENCE',
        'WORK EXPERIENCE',
        'CERTIFICATIONS',
        'SKILLS',
        'MY PROJECTS',
        'PROJECTS'
    }
    sections = {}
    current = None
    for ln in filter_lines(lines):
        if ln in headings:
            current = ln
            sections[current] = []
        elif current:
            sections[current].append(ln)
    return sections

# ==== 3. Parsing helper functions ====
def clean_bullet(ln: str) -> str:
    return re.sub(r'^[\s§•\-\*]+', '', ln).strip()

def parse_summary(lines: List[str]) -> str:
    return " ".join([clean_bullet(ln) for ln in lines])

def parse_multi_line(lines: List[str], start_pattern: str) -> List[str]:
    items = []
    for ln in lines:
        if re.match(start_pattern, ln):
            items.append(ln)
        elif items:
            items[-1] += ' ' + ln
    return items

def parse_education(lines: List[str]) -> List[str]:
    return parse_multi_line(lines, r'^\d{4}')

def parse_experience(lines: List[str]) -> List[str]:
    return parse_multi_line(lines, r'^(?:[A-Za-z]{3}\s+\d{4}|\d{4})')

def parse_certifications(lines: List[str]) -> List[str]:
    return parse_multi_line(lines, r'^\d{4}')

def parse_skills(lines: List[str]) -> List[str]:
    skills = []
    for ln in lines:
        if ln.lower().startswith('page '):
            continue
        if ':' in ln:
            _, rest = ln.split(':', 1)
        elif ' ' in ln:
            _, rest = ln.split(' ', 1)
        else:
            continue
        items = [i.strip() for i in rest.split(',') if i.strip()]
        skills.extend(items)
    return skills

def parse_projects(lines: List[str]) -> List[Dict]:
    projects, current = [], {}
    i = 0
    while i < len(lines):
        ln = lines[i].strip()
        if i+1 < len(lines) and re.match(r'^\([^)]*\)$', lines[i+1].strip()):
            if current:
                projects.append(current)
            current = {
                'title': ln,
                'period': lines[i+1].strip().strip('()'),
            }
            i += 2
            continue
        if 'Team Size' in ln and 'Customer' in ln:
            m = re.search(r'Team Size\s*(\d+).*Customer\s*(.+)', ln)
            if m:
                current['team_size'] = int(m.group(1))
                current['customer'] = m.group(2).strip()
        elif ln.startswith('Summary'):
            text = ln[len('Summary'):].strip()
            i += 1
            while i < len(lines) and not re.match(r'^(My Position|Technologies|Programming Languages)', lines[i]):
                text += ' ' + lines[i].strip()
                i += 1
            current['summary'] = text.strip()
            continue
        elif ln.startswith('My Position'):
            current['position'] = ln[len('My Position'):].strip()
        elif ln.startswith('Technologies'):
            techs = []
            i += 1
            while i < len(lines) and lines[i].lstrip().startswith('§'):
                techs.append(clean_bullet(lines[i]))
                i += 1
            current['technologies'] = techs
            continue
        elif ln.startswith('Programming Languages'):
            rest = ln[len('Programming Languages'):].strip()
            langs = [l.strip() for l in re.split(r'[,/]', rest) if l.strip()]
            current['programming_languages'] = langs
        i += 1
    if current:
        projects.append(current)
    return projects

# ==== 4. Main parsing function ====
def parse_cv(lines: List[str]) -> Dict:
    sec = group_sections(lines)
    return {
        'name'          : lines[0].strip(),
        'summary'       : parse_summary(sec.get('PROFESSIONAL SUMMARY', [])),
        'education'     : parse_education(sec.get('EDUCATION BACKGROUND', [])),
        'experience'    : parse_experience(sec.get('WORKING EXPERIENCE', []) or sec.get('WORK EXPERIENCE', [])),
        'certifications': parse_certifications(sec.get('CERTIFICATIONS', [])),
        'skills'        : parse_skills(sec.get('SKILLS', [])),
        'projects'      : parse_projects(sec.get('MY PROJECTS', []) or sec.get('PROJECTS', []))
    }

# ==== 5. Clean special characters ====
def clean_value(val):
    if isinstance(val, str):
        return re.sub(r"[^0-9A-Za-zÀ-ỹ .,:\-\(\)]", "", val).strip()
    if isinstance(val, list):
        return [clean_value(v) for v in val]
    if isinstance(val, dict):
        return {k: clean_value(v) for k, v in val.items()}
    return val

# ==== 6. Main runner ====
if __name__ == "__main__":
    path = sys.argv[1]
    lines = load_lines(path)
    parsed = parse_cv(lines)
    parsed = clean_value(parsed)
    print(json.dumps(parsed, ensure_ascii=False))
