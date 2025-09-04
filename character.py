import parsing
import os
import pf2e_database.fetch_data as db
from pf2e_database.fetch_data import get_armor_details

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
    strength_penalty = 0
    dex = 0
    dex_penalty = 0
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
    archetype_feats = []

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

            self.raw_data = json_data
            self.build = json_data['build']
            self.parse_into_fields(self.build)

    def to_dict(self):
        return {
            key: value
            for key, value in self.__dict__.items()
            if not key.startswith("_")
        }

    @classmethod
    def from_dict(cls, data):
        char = cls.__new__(cls)
        char.__dict__.update(data)
        char.parse_into_fields(char.build)  # можно из raw_data["build"]
        return char

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
            self.strength_penalty = self._get_penalty("str")
            self.dex = count_modifier(self.stats["breakdown"], "dex")
            self.dex_penalty = self._get_penalty("dex")
            self.con = count_modifier(self.stats["breakdown"], "con")
            self.intel = count_modifier(self.stats["breakdown"], "int")
            self.wis = count_modifier(self.stats["breakdown"], "wis")
            self.cha = count_modifier(self.stats["breakdown"], "cha")
            self.fortitude = self.proficiencies["fortitude"] + self.dex + self.level
            self.will = self.proficiencies["will"] + self.wis + self.level
            self.reflex = self.proficiencies["reflex"] + self.con + self.level
            self.perception = self.proficiencies["perception"] + self.wis + self.level
            self.hp = self.attributes['ancestryhp'] + (self.attributes['classhp'] + self.con) * self.level \
                    + self.attributes['bonushp'] + self.attributes['bonushpPerLevel'] * self.level

            self.skills = {}
            for skill in skills_attributes.keys():
                skill_penalty = 0
                if skills_attributes[skill] == "str":
                    skill_penalty = self.strength_penalty
                elif skills_attributes[skill] == "dex":
                    skill_penalty = self.dex_penalty

                self.skills[skill] = (self.proficiencies[skill] + (self.level if self.proficiencies[skill] > 0 else 0)
                                      + count_modifier(self.stats["breakdown"], skills_attributes[skill])) \
                                      - skill_penalty

            self.lores = []
            for lore in json_data['lores']:
                self.lores.append([lore[0], lore[1], self.intel])

            self.class_feats = []
            self.heritage_feats = []
            self.special_feats = []
            self.skill_feats = []
            self.ancestry_feats = []
            self.archetype_feats = []

            self.attributes["speed"] = self._correct_speed()

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
                elif "Archetype Feat" in feat:
                    self.archetype_feats.append([feat[0], feat[4]])

            for special_feat in self.specials:
                if special_feat not in self.special_feats:
                    self.special_feats.append(special_feat)

        except Exception as exc:
            print("check")
            pass

    def _get_penalty(self, stat):
        penalty = 0
        for armor in self.armor:
            armor_details = get_armor_details(armor['name'])
            if armor_details['strength'] > self.strength:
                if stat == "dex":
                    penalty += (-1)*armor_details["checkPenalty"] + ((self.dex - armor_details["dexCap"])
                                                               if self.dex > armor_details["dexCap"]
                                                                else 0)
                elif stat == "str":
                    penalty += (-1)*armor_details["checkPenalty"]
        # add other items
        return penalty

    def _correct_speed(self):
        speed = self.attributes["speed"]
        for armor in self.armor:
            armor_details = get_armor_details(armor['name'])
            speed -= (-1) * armor_details['speedPenalty']
        # add other items
        return speed

    def get_spells(self):
        return self.spell_casters

