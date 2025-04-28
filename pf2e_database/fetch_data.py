import json
import os

base_dir = os.path.dirname(__file__)

feats_dir = os.path.join(base_dir, "data/feats")
feats_index_file = os.path.join(feats_dir, "feat_index.json")

equipment_dir = os.path.join(base_dir, "data/equipment")
equipment_index_file = os.path.join(equipment_dir, "equipment_index.json")


def get_feat_description(feat_name):
    feat_info = ["N/A", "N/A", "N/A"]
    try:
        feat_filename = None
        with open(feats_index_file, 'r', encoding="utf-8") as index_file:
            feat_index = json.load(index_file)
            feat_filename = feat_index.get(feat_name)
            if feat_filename is None: # for example for Hunter's Edge: Flurry the file is just "Flurry"
                if ":" in feat_name:
                    feat_filename = feat_index.get(feat_name.split(":")[1].strip())
        if feat_filename:
            with open(os.path.join(feats_dir, feat_filename), "r", encoding="utf-8") as feat_file:
                feat = json.load(feat_file)
                feat_info = [feat.get("system",{}).get("description", {}).get("value", ""),
                            feat.get("system",{}).get("actionType", {}).get("value", ""),
                            feat.get("system",{}).get("actions", {}).get("value", "")
                ]
    except Exception as exc:
        print("Error while reading database: ", str(exc))

    return feat_info

def get_equip_description(equip_name):
    pass

def get_weapon_flairs(weapon):
    weapon_flairs = []
    weapon_filename = None
    try:
        with open(equipment_index_file, "r") as index_file:
            index = json.load(index_file)
            weapon_filename = index.get(weapon)
        if weapon_filename:
            with open(os.path.join(equipment_dir, weapon_filename), "r") as weapon_file:
                weapon_flairs = json.load(weapon_file).get("system", {}).get("traits", {}).get("value", [])
    except Exception as exc:
        print("Error while reading weapons database: ", str(exc))

    return weapon_flairs

def get_armor_details(armor):
    armor_details = {"acBonus": 0, "dexCap":0, "checkPenalty":0, "strength" :0, "speedPenalty" : 0}
    armor_filename = None
    try:
        with open(equipment_index_file, "r") as index_file:
            index = json.load(index_file)
            armor_filename = index.get(armor)
        if armor_filename:
            with open(os.path.join(equipment_dir, armor_filename), "r") as armor_file:
                armor_data = json.load(armor_file)
                armor_details['acBonus'] = armor_data.get("system", {}).get("acBonus", {})
                armor_details["dexCap"] = armor_data.get("system", {}).get("dexCap", {})
                armor_details["checkPenalty"] = armor_data.get("system", {}).get("checkPenalty", {})
                armor_details["strength"] = armor_data.get("system", {}).get("strength", {})
                armor_details["speedPenalty"] = armor_data.get("system", {}).get("speedPenalty", {})
    except Exception as exc:
        print("Error while reading armor database: ", str(exc))

    return armor_details
