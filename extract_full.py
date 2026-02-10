import zipfile
import xml.etree.ElementTree as ET
import os

def extract_all_text(file_path):
    try:
        with zipfile.ZipFile(file_path, 'r') as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            texts = []
            for node in tree.findall('.//w:t', ns):
                if node.text:
                    texts.append(node.text)
            
            return "".join(texts)
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    content = extract_all_text("mbti少年版測驗題.docx")
    with open("full_dump.txt", "w", encoding="utf-8") as f:
        f.write(content)
    print("Full dump saved to full_dump.txt")
