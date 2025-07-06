import PyPDF2
import re

def extract_math_questions(pdf_path, output_file="extracted_questions.txt", max_pages=5):
    """
    Extracts math questions from PDF (first 5 pages by default)
    and saves them to a text file.
    """
    math_questions = []
    
    # Common math question patterns (can be expanded)
    math_patterns = [
        r'(\d+\.\s.*\?[\s\S]*?(?=\d+\.|\Z))',  # Questions numbered like "1. ...?"
        r'(Problem\s\d+:.*?(?=Problem\s\d+|\Z))',  # "Problem 1: ..."
        r'(Solve\sfor\s.*?(?=\n\s*\n|\Z))',  # "Solve for x..."
        r'(Calculate\s.*?(?=\n\s*\n|\Z))',  # "Calculate..."
        r'(Prove\s.*?(?=\n\s*\n|\Z))'  # "Prove that..."
    ]
    
    try:
        with open(pdf_path, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            # Process up to max_pages or total pages if less
            page_limit = min(max_pages, len(pdf_reader.pages))
            
            for page_num in range(page_limit):
                page = pdf_reader.pages[page_num]
                text = page.extract_text()
                
                # Find all potential math questions using patterns
                for pattern in math_patterns:
                    matches = re.findall(pattern, text, re.MULTILINE)
                    math_questions.extend(matches)
                    
        # Save extracted questions to file
        with open(output_file, 'w', encoding='utf-8') as out_file:
            out_file.write("Extracted Math Questions:\n\n")
            for i, question in enumerate(math_questions, 1):
                out_file.write(f"{i}. {question.strip()}\n\n")
                
        print(f"Successfully extracted {len(math_questions)} math questions to {output_file}")
        
    except Exception as e:
        print(f"Error processing PDF: {e}")

# Usage example:
extract_math_questions("math_test.pdf", "questions.txt", max_pages=5)