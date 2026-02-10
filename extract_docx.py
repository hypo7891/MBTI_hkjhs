import zipfile
import xml.etree.ElementTree as ET
import os

def extract_text_from_docx(file_path):
    if not os.path.exists(file_path):
        return f"File {file_path} not found."
    
    try:
        with zipfile.ZipFile(file_path, 'r') as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            # Namespaces
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            paragraphs = []
            for p in tree.findall('.//w:p', ns):
                texts = [node.text for node in p.findall('.//w:t', ns) if node.text]
                if texts:
                    paragraphs.append("".join(texts))
            
            return "\n".join(paragraphs)
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    content = extract_text_from_docx("mbti少年版測驗題.docx")
    with open("extracted_questions.txt", "w", encoding="utf-8") as f:
        f.write(content)
    print("Content extracted and saved to extracted_questions.txt")
