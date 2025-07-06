# PDF Math Question Extractor

A Python tool to extract math questions from PDF files (first 5 pages by default).

## Features
- Extracts numbered math questions
- Handles common question formats
- Saves to text file
- Lightweight (only requires PyPDF2)

## Installation
```bash
git clone https://github.com/yourusername/pdf-math-question-extractor.git
cd pdf-math-question-extractor
pip install -r requirements.txt
```

## Usage
```python
from extractor import extract_math_questions

# Extract from first 5 pages of sample.pdf
extract_math_questions("sample.pdf", "output.txt")
```

## Limitations
- Works best with text-based PDFs
- May need pattern adjustments for different formats
- Processes first 5 pages by default (configurable)

## Contributing
Pull requests welcome! For major changes, please open an issue first.

## License
[MIT](LICENSE)
