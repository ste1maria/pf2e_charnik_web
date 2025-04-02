import parsing

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

    mods = {}
    feats = {}
    specials =  []
    lores = [{}]

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

    def __init__(self, jsonfile_path=""):
        if jsonfile_path!="":
            with open(jsonfile_path, 'r') as json_file:
                json_data = parsing.parse_character_sheet(json_file)
            self.parse_into_fields(json_data['build'])


    def print_info(self):
        print ("Your character's name is:", self.name + ", they are", self.char_class)
        print ("Their ancestry: ", self.ancestry)
        print ("Con: ", self.stats['con'])


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

        except Exception as exc:
            pass


