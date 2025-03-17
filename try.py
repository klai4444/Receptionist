import csv
import json
import re
import os
from collections import defaultdict

def parse_csv_to_json(csv_file_path, remove_availability=True, clean_rooms=True):
    with open(csv_file_path, 'r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        data = []
        for row in csv_reader:
            for key in row:
                if row[key] and row[key].isdigit():
                    row[key] = int(row[key])
            if remove_availability and 'availability' in row:
                del row['availability']
            if clean_rooms and row.get('room'):
                row['room'] = re.sub(r'- request swipe access - permissions@cs\.northwestern\.edu', '', row['room'])
            data.append(row)
    return data

def extract_course_number(course):
    match = re.search(r'\d+', course)
    return match.group(0) if match else None

def combine_office_hours(data):
    combined = {}

    for row in data:
        if not row.get('course'):
            continue
        
        course_number = extract_course_number(row['course'])
        if not course_number:
            continue
        
        key = f"CS{course_number}"

        if key not in combined:
            combined[key] = {
                'course': key,
                'sessions': defaultdict(list)
            }
        
        day = row.get('day')
        if day:
            combined[key]['sessions'][day].append({
                'time': row.get('time'),
                'room': row.get('room')
            })
    
    # Convert defaultdict back to regular dict for clean JSON output
    for entry in combined.values():
        entry['sessions'] = dict(entry['sessions'])
    
    return list(combined.values())

def sort_sessions(combined_data):
    day_order = {"M": 1, "Tu": 2, "W": 3, "Th": 4, "F": 5, "Sat": 6, "Sun": 7}

    for entry in combined_data:
        # Sort days themselves by weekday order (optional)
        entry['sessions'] = dict(sorted(entry['sessions'].items(), key=lambda x: day_order.get(x[0], 99)))

        # Sort the times within each day
        for day, sessions in entry['sessions'].items():
            sessions.sort(key=lambda x: x['time'])

    return combined_data

def convert_office_hours_csv_to_json(csv_file_path):
    """
    Convert office hours CSV to JSON and save to file.
    Automatically saves the JSON file in the same directory with ".json" extension.
    
    Args:
        csv_file_path (str): Path to the CSV file
    """
    # Parse and process data
    data = parse_csv_to_json(csv_file_path)
    combined_data = combine_office_hours(data)
    sorted_data = sort_sessions(combined_data)

    # Generate output file path (same directory, but with .json extension)
    output_file_path = os.path.splitext(csv_file_path)[0] + ".json"

    # Save JSON to file
    with open(output_file_path, 'w', encoding='utf-8') as f:
        json.dump(sorted_data, f, indent=2)

    print(f"✅ Processed and saved JSON to: {output_file_path}")

# --- Run directly if script executed ---
if __name__ == "__main__":
    csv_file = "new_office_hours.csv"  # Change this to your actual file
    convert_office_hours_csv_to_json(csv_file)
