import json
import requests
import sys

# Firebase Database URLs
DATABASE_URLS = {
    0: "https://unicompare-1-default-rtdb.firebaseio.com/",
    1: "https://unicompare-2-default-rtdb.firebaseio.com/"
}




def add_data_from_json(json_file_path):
    with open(json_file_path, 'r', encoding='utf-8-sig') as file:  
        data = json.load(file)
        for entry in data:
            uni_id = entry.get("University ID")
            
            if uni_id is None:
                print("Skipping record with no ID (UniversityID)")
                continue

            del entry["University ID"]

            # Calculate hash value based on Institution Name
            db_index = uni_id % 2
            print(db_index)
            db_url = DATABASE_URLS[db_index]
            

            # Push the record to the Firebase database
            response = requests.put(f"{db_url}{uni_id}.json", json=entry)
            
            if response.status_code == 200:
                print(f"Record with ID {uni_id} pushed to Firebase database {db_index}.")
            else:
                print(f"Failed to push record with ID {uni_id} to Firebase database {db_index}. Error: {response.text}")
                

            
def add_university_without_id(new_entry):
    max_ids = []

    for database_index, database_url in DATABASE_URLS.items():
        url = f"{database_url}.json"
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            if data:
                max_id = max(map(int, data.keys()))  
                max_ids.append(max_id)
            else:
                max_ids.append(0)  
        else:
            print(f"Failed to retrieve data from database {database_index}. Error: {response.text}")
            return

    max_id = max(max_ids)

    new_id = max_id + 1

    db_index = new_id % 2

    response = requests.post(DATABASE_URLS[db_index] + f"{new_id}.json", json=new_entry)
    if response.status_code == 200:
        print(f"New entry added with ID {new_id} in database {db_index}.")
    else:
        print(f"Failed to add new entry. Error: {response.text}")



def update_university_by_id(uni_id, new_info):
    db_index = int(uni_id) % 2
    database_url = DATABASE_URLS[db_index]
    
    url = f"{database_url}{uni_id}.json"

    response = requests.patch(url, json=new_info)
    if response.status_code == 200:
        print(f"University with ID {uni_id} updated successfully.")
    else:
        print(f"Failed to update university with ID {uni_id}. Error: {response.text}")



def delete_university_by_id(uni_id):
    db_index = int(uni_id) % 2
    database_url = DATABASE_URLS[db_index]
    
    url = f"{database_url}{uni_id}.json"

    response = requests.delete(url)
    if response.status_code == 200:
        print(f"University with ID {uni_id} deleted successfully.")
    else:
        print(f"Failed to delete university with ID {uni_id}. Error: {response.text}")


def main():
    if len(sys.argv) < 3:
        print("Usage: python script.py [operation] [arguments]")
        return
        
    operation = sys.argv[1].lower()
    if operation == "add_data_from_json":
        json_file_path = sys.argv[2]
        add_data_from_json(json_file_path)
    elif operation == "add_university_without_id":
        new_entry = json.loads(sys.argv[2])
        add_university_without_id(new_entry)
    elif operation == "update_university_by_id":
        uni_id = sys.argv[2]
        new_info = json.loads(sys.argv[3])
        update_university_by_id(uni_id, new_info)
    elif operation == "delete_university_by_id":
        uni_id = sys.argv[2]
        delete_university_by_id(uni_id)
    else:
        print("Invalid operation. Please choose from 'add_data_from_json', 'add_university_without_id', 'update_university_by_id', or 'delete_university_by_id'.")

if __name__ == "__main__":
    main()


