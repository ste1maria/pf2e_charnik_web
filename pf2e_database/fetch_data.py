import json
import os

base_dir = os.path.dirname(__file__)

backgrounds_json = os.path.join(base_dir, "data", "backgrounds.json")
classes_json =  os.path.join(base_dir, "data", "classes.json")

class_feats_json =  os.path.join(base_dir, "data", "class-feats.json")
ancestry_feats_json =  os.path.join(base_dir, "data", "ancestry-feats.json")
skill_feats_json =  os.path.join(base_dir, "data", "skill-feats.json")
special_feats_json = os.path.join(base_dir, "data", "special-feats.json")


def get_background_description(background):
    with open(backgrounds_json, 'r') as bg:
        bg_data = json.load(bg)
        return bg_data[background]['system']['description']['value']

def get_class_description(_class):
    with open(classes_json, 'r') as cl:
        class_data = json.load(cl)
        return class_data[_class]['system']['description']['value']

def get_feat_description(feat_name, feat_type):
    json_source = ""
    if feat_type == "class":
        json_source = class_feats_json
    elif feat_type == "ancestry":
        json_source = ancestry_feats_json
    elif feat_type == "skill":
        json_source = skill_feats_json
    elif feat_type == "special":
        json_source = special_feats_json
    else:
        return ""

    try:
        print(feat_name, feat_type, json_source)
        with open(json_source) as feat_file:
            feats_info = json.load(feat_file)
            return feats_info[feat_name]['description']['value']

    except Exception as exc:
        print("Error while reading database: ", str(exc))
