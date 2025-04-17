import parsing
import os
import pf2e_database.fetch_data as db

skills_attributes = {
    "acrobatics": 'dex',
    "arcana": "int",
    "athletics": "str",
    "crafting": "int",
    "deception": "cha",
    "diplomacy": "cha",
    "intimidation": "cha",
    "medicine": "wis",
    "nature": "wis",
    "occultism": "int",
    "performance": "cha",
    "religion": "wis",
    "society": "int",
    "stealth": "dex",
    "survival": "wis",
    "thievery": "dex"
}

def count_modifier(data, attribute, is_decrease=False):
    count = 0

    if isinstance(data, dict):
        for key, value in data.items():
            is_decrease = (key == "ancestryFlaws")
            count += count_modifier(value, attribute, is_decrease)
    elif isinstance(data, list):
        for item in data:
            count += count_modifier(item, attribute, is_decrease)
    elif isinstance(data, str) and data.lower() == attribute.lower():
        count += 1 if not is_decrease else -1

    return count


class Character:
    name = "Unknown adventurer"
    age = "0"
    ancestry = "Unknown"
    char_class = "Unknown"
    level = 0
    heritage = "Unknown"
    background = "Unknown"
    size = 0
    sizeName = "Tiny"
    keyAbility = "Unknown"
    languages = []
    rituals = []
    resistances = []
    inventorModes = []
    hp = 0
    stats = {
        "str":0,
        "dex":0,
        "con":0,
        "int":0,
        "wis":0,
        "cha":0,
        "breakdown":
            {
                "ancestryFree": [],
                "ancestryBoosts": [],
                "ancestryFlaws": [],
                "backgroundBoosts": [],
                "classBoosts":[],
                "mapLevelledBoosts":{}
            }
    }
    strength = 0
    dex = 0
    con = 0
    intel = 0
    wis = 0
    cha = 0

    attributes =  {
        "ancestryhp": 0,
        "classhp": 0,
        "bonushp": 0,
        "bonushpPerLevel": 0,
        "speed": 0,
        "speedBonus": 0
    }

    proficiencies =  {
        "classDC": 0,
        "perception": 0,
        "fortitude": 0,
        "reflex": 0,
        "will": 0,
        "heavy": 0,
        "medium": 0,
        "light": 0,
        "unarmored": 0,
        "advanced": 0,
        "martial": 0,
        "simple": 0,
        "unarmed": 0,
        "castingArcane": 0,
        "castingDivine": 0,
        "castingOccult": 0,
        "castingPrimal": 0,
        "acrobatics": 0,
        "arcana": 0,
        "athletics": 0,
        "crafting": 0,
        "deception": 0,
        "diplomacy": 0,
        "intimidation": 0,
        "medicine": 0,
        "nature": 0,
        "occultism": 0,
        "performance": 0,
        "religion": 0,
        "society": 0,
        "stealth": 0,
        "survival": 0,
        "thievery": 0
    }

    skills = {
        "acrobatics": 0,
        "arcana": 0,
        "athletics": 0,
        "crafting": 0,
        "deception": 0,
        "diplomacy": 0,
        "intimidation": 0,
        "medicine": 0,
        "nature": 0,
        "occultism": 0,
        "performance": 0,
        "religion": 0,
        "society": 0,
        "stealth": 0,
        "survival": 0,
        "thievery": 0
    }

    mods = {}
    feats = {}
    class_feats = []
    heritage_feats = []
    special_feats = []
    skill_feats = []
    ancestry_feats = []

    specials =  []
    lores = [[]]

    equipment_containers = {}
    equipment = [{}]

    specific_proficiencies = {}

    weapons = [{}]
    money = {}
    armor = [{}]
    spell_casters = []
    focus_points = 0
    focus = {}
    formula = []
    ac_total =  {}
    pets = []
    familiars = []
    DC = 0
    fortitude = 0
    reflex = 0
    will = 0
    perception = 0

    def __init__(self, jsonfile_path=""):
        base_dir = os.path.dirname(__file__)  # путь к файлу character.py
        full_path = os.path.join(base_dir, jsonfile_path)
        if full_path!="":
            with open(full_path, 'r') as json_file:
                json_data = parsing.parse_character_sheet(json_file)
            self.parse_into_fields(json_data['build'])

    def to_dict(self):
        return {
            key: value
            for key, value in self.__dict__.items()
            if not key.startswith("_")
        }

    def parse_into_fields(self, json_data):
        try:
            self.name = json_data['name']
            self.age = json_data['age']
            self.ancestry = json_data['ancestry']
            self.char_class = json_data['class']
            self.level = json_data['level']
            self.heritage = json_data['heritage']
            self.background = json_data['background']
            self.size = json_data['size']
            self.sizeName = json_data['sizeName']
            self.keyAbility = json_data['keyability']
            self.languages = json_data['languages']
            self.rituals = json_data['rituals']
            self.resistances = json_data['resistances']
            self.inventorModes = json_data['inventorMods']
            self.stats = json_data['abilities']
            self.attributes = json_data['attributes']
            self.proficiencies = json_data['proficiencies']
            self.mods = json_data['mods']
            self.feats = json_data['feats']
            self.specials = json_data['specials']
            self.lores = json_data['lores']
            self.equipment_containers = json_data['equipmentContainers']
            self.equipment = json_data['equipment']
            self.specific_proficiencies = json_data['specificProficiencies']
            self.weapons = json_data['weapons']
            self.armor = json_data['armor']
            self.money = json_data['money']
            self.spell_casters = json_data['spellCasters']
            self.focus_points = json_data['focusPoints']
            self.focus = json_data['focus']
            self.ac_total = json_data['acTotal']
            self.pets = json_data['pets']
            self.familiars = json_data['familiars']
            self.DC = 10 + self.level + self.proficiencies["classDC"] + \
                      count_modifier(self.stats["breakdown"], self.keyAbility)

            self.strength = count_modifier(self.stats["breakdown"], "str")
            self.dex = count_modifier(self.stats["breakdown"], "dex")
            self.con = count_modifier(self.stats["breakdown"], "con")
            self.intel = count_modifier(self.stats["breakdown"], "int")
            self.wis = count_modifier(self.stats["breakdown"], "wis")
            self.cha = count_modifier(self.stats["breakdown"], "cha")
            self.fortitude = self.proficiencies["fortitude"] + self.dex + self.level
            self.will = self.proficiencies["will"] + self.wis + self.level
            self.reflex = self.proficiencies["reflex"] + self.con + self.level
            self.perception = self.proficiencies["perception"] + self.wis + self.level
            self.hp = self.attributes['ancestryhp'] + (self.attributes['classhp'] + self.con) * self.level \
                    + self.attributes['bonushp']

            self.skills = {}
            for skill in skills_attributes.keys():
                self.skills[skill] = (self.proficiencies[skill] + (self.level if self.proficiencies[skill] > 0 else 0)
                                      + count_modifier(self.stats["breakdown"], skills_attributes[skill]))

            self.lores = []
            for lore in json_data['lores']:
                self.lores.append([lore[0], lore[1], self.intel])

            self.class_feats = []
            self.heritage_feats = []
            self.special_feats = []
            self.skill_feats = []
            self.ancestry_feats = []

            for feat in self.feats:
                if "Class Feat" in feat:
                    self.class_feats.append([feat[0], feat[4]])
                elif "Skill Feat" in feat:
                    self.skill_feats.append([feat[0], feat[4]])
                elif "Awarded Feat" in feat:
                    self.special_feats.append(feat[0])
                elif "Heritage Feat" in feat:
                    self.heritage_feats.append([feat[0], feat[4]])
                elif "Ancestry Feat" in feat:
                    self.ancestry_feats.append([feat[0], feat[4]])

            for special_feat in self.specials:
                if special_feat not in self.special_feats:
                    self.special_feats.append(special_feat)

        except Exception as exc:
            print("check")
            pass

    def get_feat_description(self, feat_name):
        feat_type = ""
        print(feat_name)
        if any(feat_name == feat[0] for feat in self.class_feats):
            feat_type = "class"
        elif any(feat_name == feat[0] for feat in self.ancestry_feats):
            feat_type = "ancestry"
        elif any(feat_name == feat[0] for feat in self.skill_feats):
            feat_type = "skill"
        elif any(feat_name == feat for feat in self.special_feats):
            feat_type = "special"
        else:
            return ""

        return db.get_feat_description(feat_name, feat_type)
