import json
import re

def parse_questions(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    questions = []
    current_q = None
    
    # regex for "1. Question text" or "114. Question text" or "23做學校專案時"
    q_pattern = re.compile(r'^(\d+)\.?\s*(.+)')
    # letters to map score
    score_letters = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P']
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
            
        # Handle merged lines like "J/P 維度 · 第 23 題23做學校專案時"
        if "第" in line and "題" in line:
            match = re.search(r'題(\d+)(.*)', line)
            if match:
                q_id = int(match.group(1))
                q_text = match.group(2).strip()
                if current_q:
                    questions.append(current_q)
                current_q = {"id": q_id, "question": q_text, "options": []}
                continue

        # Standard question match
        match = q_pattern.match(line)
        if match:
            q_id = int(match.group(1))
            # Correct typo for 114 -> 14
            if q_id == 114: q_id = 14
                
            q_text = match.group(2).strip()
            if current_q:
                questions.append(current_q)
            current_q = {"id": q_id, "question": q_text, "options": []}
            continue

        # Skip metadata
        if any(skip in line for skip in ["這道題能瞭解什麼", "維度 · 第", "維度"]):
            continue
            
        # Option parsing
        if current_q and len(current_q["options"]) < 2:
            # Strip "B" or "A" prefix if it exists followed by text
            option_text = re.sub(r'^[AB]\s*', '', line).strip()
            
            # Find the score letter at the end
            score_match = re.search(r'\s+([EISNTFJP])$', option_text)
            if score_match:
                score = score_match.group(1)
                text = option_text[:score_match.start()].strip()
                current_q["options"].append({"text": text, "score": score})
            else:
                # Sometimes the letter is attached directly
                for letter in score_letters:
                    if option_text.endswith(letter):
                        current_q["options"].append({"text": option_text[:-1].strip(), "score": letter})
                        break

    if current_q:
        questions.append(current_q)

    # Sort by ID and remove duplicates (if any)
    questions.sort(key=lambda x: x["id"])
    unique_questions = []
    seen_ids = set()
    for q in questions:
        if q["id"] not in seen_ids:
            unique_questions.append(q)
            seen_ids.add(q["id"])

    return unique_questions

if __name__ == "__main__":
    data = parse_questions("extracted_questions.txt")
    with open("mbti_questions.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Successfully converted {len(data)} questions to mbti_questions.json")
