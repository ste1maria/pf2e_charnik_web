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
        if feat_filename:
            with open(os.path.join(feats_dir, feat_filename), "r", encoding="utf-8") as feat_file:
                feat = json.load(feat_file)
                feat_info =[feat.get("system",{}).get("description", {}).get("value", ""),
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
        print(weapon, weapon_filename)
        if weapon_filename:
            with open(os.path.join(equipment_dir, weapon_filename), "r") as weapon_file:
                weapon_flairs = json.load(weapon_file).get("system", {}).get("traits", {}).get("value", [])
    except Exception as exc:
        print("Error while reading weapons database: ", str(exc))

    return weapon_flairs

def get_armor_details(armor):
    pass