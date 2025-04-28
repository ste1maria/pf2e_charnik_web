import os, json, shutil
import re

base_dir = os.path.dirname(__file__)

feat_dir = os.path.join(base_dir, "data/feats")
feat_index = {}

equipment_dir = os.path.join(base_dir, "data/equipment")
equipment_index = {}

bare_class_feats = os.path.join(base_dir, "data/classfeatures")
sorted_class_feats = os.path.join(feat_dir, "class")


def clean_uuid_in_dict(data, target_key):
    # Если data — это словарь
    if isinstance(data, dict):
        if target_key in data and isinstance(data[target_key], str):
            data[target_key] = re.sub(
                r'@UUID\[(.*?)\]',
                lambda m: m.group(1).split('.')[-1],
                data[target_key]
            )
        # Также рекурсивно пройтись по вложенным словарям
        for value in data.values():
            clean_uuid_in_dict(value, target_key)

    # Если data — это список
    elif isinstance(data, list):
        for item in data:
            clean_uuid_in_dict(item, target_key)

    # Иначе ничего не делаем
    return data


def create_feats_index():
    for root, dirs, files in os.walk(feat_dir):
        for filename in files:
            if not filename.endswith(".json"):
                continue
            filepath = os.path.join(root, filename)
            delete_file = False
            name = None
            try:
                with open(filepath, 'r', encoding="utf-8") as f:
                    data = json.load(f)
                    if data["system"]["traits"]["rarity"] not in ["common", "uncommon"]:
                        delete_file = True
                    else:
                        name = data.get("name")
                if delete_file:
                    os.remove(filepath)
                    print("deleted", filepath)
                elif name:
                    feat_index[name] = os.path.relpath(filepath, feat_dir)

            except Exception as e:
                print(f"Error in file {filepath}: {e}")

    with open (os.path.join(feat_dir, "feat_index.json"), "w") as output:
        json.dump(feat_index, output, indent=4 )


def create_armor_index():
    for filename in os.listdir(equipment_dir):
            if not filename.endswith(".json"):
                continue
            try:
                delete_file = False
                subdir = "equipment"
                filepath = os.path.join(equipment_dir, filename)
                with (open(filepath, 'r', encoding="utf-8") as f):
                    data = json.load(f)
                    data_system = data.get("system")
                    if data["system"]["traits"]["rarity"] not in ["common", "uncommon"]\
                        or data_system.get("category") == "gadget":
                        delete_file = True
                    else:
                        name = data.get("name")
                    if name:
                        if data.get("type") == "weapon":
                            subdir = "weapons"
                        elif data.get("type") == "armor":
                            subdir = "armor"
                if delete_file:
                    os.remove(filepath)
                    print("deleted", filepath)
                else:
                    equipment_index[name] = os.path.relpath(equipment_dir + "/" + subdir + "/" + filename, equipment_dir)
                    shutil.move(filepath, os.path.join(equipment_dir, equipment_index[name]))
            except Exception as e:
                print(f"Error in file {filename}: {e}")
    with open (os.path.join(equipment_dir, "equipment_index.json"), "w") as output:
        json.dump(equipment_index, output, indent=4 )

def sort_feats():
    for jsonfile in os.listdir(bare_class_feats):
        if not jsonfile.endswith(".json"):
            continue
        try:
            filepath = os.path.join(bare_class_feats, jsonfile)
            _class = None
            with open(filepath, 'r') as featfile:
                data = json.load(featfile)
                _class = data.get("system",{}).get('traits', {}).get('value', [])
                if len(_class) == 0 or _class is None:
                    continue
            shutil.move(filepath, os.path.join(sorted_class_feats, _class[0]))

        except Exception as e:
            print(f'Exception while processing class feat: {jsonfile}: {e}')

def clean_up_json_feats():
    for root, dirs, files in os.walk(feat_dir):
        for filename in files:
            if not filename.endswith(".json"):
                continue
            filepath = os.path.join(root, filename)
            try:
                with open(filepath, 'r', encoding="utf-8") as f:
                    data = json.load(f)
                    cleaned_data = clean_uuid_in_dict(data, "value")
                with open(filepath, 'w', encoding="utf-8") as f:
                    json.dump(cleaned_data, f, ensure_ascii=False, indent=2)
            except Exception as e:
                print(f'Exception handling json {filename}: {e}')

if __name__ == "__main__":
    create_feats_index()
