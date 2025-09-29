#!/usr/bin/env python3
"""
Script to fix ALL fill-in-the-blank questions in English and German
by adding the letter structure like in Turkish questions.
"""

import json
import random
import re
from pathlib import Path

def generate_letter_choices(correct_answer, num_distractors=3):
    """Generate letter choices for fill-in-the-blank questions."""
    correct_answer = correct_answer.upper()
    correct_letters = list(correct_answer)
    
    # Common letters to use as distractors
    common_letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
                      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    
    # Remove correct letters from the pool of distractors
    distractor_pool = [letter for letter in common_letters if letter not in correct_letters]
    
    # Select random distractors
    available_distractors = min(num_distractors, len(distractor_pool))
    distractors = random.sample(distractor_pool, available_distractors) if available_distractors > 0 else []
    
    # Combine correct letters and distractors
    all_choices = correct_letters + distractors
    
    # Shuffle to randomize order
    random.shuffle(all_choices)
    
    return all_choices

def fix_blank_filling_questions(file_path):
    """Fix fill-in-the-blank questions in the given JSON file."""
    print(f"Processing: {file_path}")
    
    # Read the JSON file
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    modified_count = 0
    
    # Process each category
    for category_name, questions in data.items():
        if not isinstance(questions, list):
            continue
            
        for question in questions:
            # Check if this is a fill-in-the-blank question with empty options
            if ('_____' in question.get('question', '') and 
                'options' in question and 
                isinstance(question['options'], list) and 
                len(question['options']) == 0 and
                'correctAnswer' in question and
                'choices' not in question):  # Don't process already fixed questions
                
                correct_answer = question['correctAnswer'].strip()
                
                # Skip if answer is empty
                if not correct_answer:
                    continue
                
                # Convert lowercase answers to uppercase
                if correct_answer.islower():
                    correct_answer = correct_answer.upper()
                    question['correctAnswer'] = correct_answer
                
                # Generate letter choices
                choices = generate_letter_choices(correct_answer)
                
                # Update the question structure
                question['choices'] = choices
                question['type'] = 'BlankFilling'
                
                # Remove the empty options array
                del question['options']
                
                modified_count += 1
                print(f"  Fixed question ID {question.get('id', 'unknown')}: {correct_answer}")
    
    # Write the updated JSON back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"  Modified {modified_count} questions in {file_path}")
    return modified_count

def main():
    """Main function to process all language files."""
    # Set random seed for consistent results
    random.seed(42)
    
    # Files to process
    files_to_process = [
        '/Users/onerozbey/Desktop/quiz-oyunu/languages/en/questions.json',
        '/Users/onerozbey/Desktop/quiz-oyunu/languages/de/questions.json'
    ]
    
    total_modified = 0
    
    for file_path in files_to_process:
        path = Path(file_path)
        if path.exists():
            modified = fix_blank_filling_questions(file_path)
            total_modified += modified
        else:
            print(f"File not found: {file_path}")
    
    print(f"\nTotal questions modified: {total_modified}")
    print("All fill-in-the-blank questions have been fixed!")

if __name__ == "__main__":
    main()
