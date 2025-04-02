import json

backgrounds_json = "pf2e_database/data/backgrounds.json"
classes_json = "pf2e_database/data/classes.json"

def get_background_description(background):
    with open(backgrounds_json, 'r') as bg:
        bg_data = json.load(bg)
        return bg_data[background]['system']['description']['value']

def get_class_description(_class):
    with open(classes_json, 'r') as cl:
        class_data = json.load(cl)
        return class_data[_class]['system']['description']['value']
