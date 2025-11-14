# CV Matching — Backend (FastAPI)

This README explains how to create a virtual environment named `cvenv`, install project dependencies from `requirements.txt`, install common NLP models/data, start the FastAPI server, and test the API (macOS/Linux).

Prerequisites

- Python 3.8+ (check with `python3 --version`)
- Terminal (macOS/Linux)
- Optional: git

1. Create and activate the virtual environment (name: cvenv)

```bash
cd /server

# create venv named cvenv
python3 -m venv cvenv

# activate (macOS / Linux)
source cvenv/bin/activate

# verify
which python
python --version
```

2. Upgrade pip and install requirements

```bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

Note about PyTorch: automatic install of `torch` may fail on some platforms (Apple Silicon, CUDA). If so, follow the official install instructions at https://pytorch.org/get-started/locally/ and install the correct wheel for your system before re-running `pip install -r requirements.txt` (or install remaining packages manually).

3. Install common NLP models/data

- spaCy English model:

```bash
python -m spacy download en_core_web_sm
```

- NLTK corpora (optional but recommended):

```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('averaged_perceptron_tagger')"
```

4. Start the FastAPI server
   From the project root (after activating `cvenv`):

```bash
# typical entrypoint (adjust if your app is at a different module)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- `--reload` enables auto-reload for development.
- Server will be available at: http://localhost:8000

5. API docs

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

6. Example curl commands

- Upload CV (PDF)

```bash
curl -X POST "http://localhost:8000/upload-cv" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/cv.pdf"
```

- Parse Job Description (JSON body)

```bash
curl -X POST "http://localhost:8000/parse-jd" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"jd_text":"Senior Machine Learning Engineer. Required skills: Python, PyTorch, NLP. 5+ years experience."}'
```

- Match CV and JD (use parsed CV/JD JSON from previous endpoints or create minimal example)

```bash
curl -X POST "http://localhost:8000/match" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "cv": {
      "name":"Alice Example",
      "email":"alice@example.com",
      "phone":"+1-555-5555",
      "education":["BSc Computer Science"],
      "skills":["python","pytorch","nlp"],
      "work_experience":["ML Engineer at ExampleCorp (2019-2024)"]
    },
    "jd": {
      "job_title":"Senior ML Engineer",
      "required_skills":["python","pytorch","nlp"],
      "responsibilities":["build models","deploy models"],
      "required_experience":"5+ years"
    }
  }'
```

7. Troubleshooting

- "ModuleNotFoundError" / "cannot import name": ensure `cvenv` is activated and you run `uvicorn` from the project root. Check Python path and package/module names.
- spaCy model not found: run `python -m spacy download en_core_web_sm`.
- Torch install issues: use PyTorch official installer for the correct OS/CUDA/CPU build.
- Port in use: change `--port` value when starting uvicorn.

8. Run tests (if tests exist)

```bash
pip install pytest    # if not already installed
pytest -q
```

9. Deactivate the environment

```bash
deactivate
```

If you want the exact uvicorn command adjusted to your project layout or help fixing import errors, provide the project tree (`ls -R`) or the file raising the import error and I will provide the fix.

````// filepath: /Users/shin/Documents/CVMatching/farmtrack-server/README.md
# CV Matching — Backend (FastAPI)

This README explains how to create a virtual environment named `cvenv`, install project dependencies from `requirements.txt`, install common NLP models/data, start the FastAPI server, and test the API (macOS/Linux).

Prerequisites
- Python 3.8+ (check with `python3 --version`)
- Terminal (macOS/Linux)
- Optional: git

1) Create and activate the virtual environment (name: cvenv)
```bash
cd /Users/shin/Documents/CVMatching/farmtrack-server

# create venv named cvenv
python3 -m venv cvenv

# activate (macOS / Linux)
source cvenv/bin/activate

# verify
which python
python --version
````

2. Upgrade pip and install requirements

```bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

Note about PyTorch: automatic install of `torch` may fail on some platforms (Apple Silicon, CUDA). If so, follow the official install instructions at https://pytorch.org/get-started/locally/ and install the correct wheel for your system before re-running `pip install -r requirements.txt` (or install remaining packages manually).

3. Install common NLP models/data

- spaCy English model:

```bash
python -m spacy download en_core_web_sm
```

- NLTK corpora (optional but recommended):

```bash
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('averaged_perceptron_tagger')"
```

4. Start the FastAPI server
   From the project root (after activating `cvenv`):

```bash
# typical entrypoint (adjust if your app is at a different module)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- `--reload` enables auto-reload for development.
- Server will be available at: http://localhost:8000

5. API docs

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

6. Example curl commands

- Upload CV (PDF)

```bash
curl -X POST "http://localhost:8000/upload-cv" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/cv.pdf"
```

- Parse Job Description (JSON body)

```bash
curl -X POST "http://localhost:8000/parse-jd" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{"jd_text":"Senior Machine Learning Engineer. Required skills: Python, PyTorch, NLP. 5+ years experience."}'
```

- Match CV and JD (use parsed CV/JD JSON from previous endpoints or create minimal example)

```bash
curl -X POST "http://localhost:8000/match" \
  -H "accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "cv": {
      "name":"Alice Example",
      "email":"alice@example.com",
      "phone":"+1-555-5555",
      "education":["BSc Computer Science"],
      "skills":["python","pytorch","nlp"],
      "work_experience":["ML Engineer at ExampleCorp (2019-2024)"]
    },
    "jd": {
      "job_title":"Senior ML Engineer",
      "required_skills":["python","pytorch","nlp"],
      "responsibilities":["build models","deploy models"],
      "required_experience":"5+ years"
    }
  }'
```

7. Troubleshooting

- "ModuleNotFoundError" / "cannot import name": ensure `cvenv` is activated and you run `uvicorn` from the project root. Check Python path and package/module names.
- spaCy model not found: run `python -m spacy download en_core_web_sm`.
- Torch install issues: use PyTorch official installer for the correct OS/CUDA/CPU build.
- Port in use: change `--port` value when starting uvicorn.

8. Run tests (if tests exist)

```bash
pip install pytest    # if not already installed
pytest -q
```

9. Deactivate the environment

```bash
deactivate
```

If you want the exact uvicorn command adjusted to your project layout or help fixing import errors, provide the project tree (`ls -R`) or the file raising the import error and I will provide the fix.
