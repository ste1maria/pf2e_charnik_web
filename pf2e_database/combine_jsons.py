import os, json, shutil

base_dir = os.path.dirname(__file__)

feat_dir = os.path.join(base_dir, "data/feats")
feat_index = {}

equipment_dir = os.path.join(base_dir, "data/equipment")
equipment_index = {}

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

if __name__ == "__main__":
    create_armor_index()
