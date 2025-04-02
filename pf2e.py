import parsing
import character
import pf2e_database.fetch_data as db

if __name__ =='__main__' :
    mirra = character.Character("characters/mirra.json")
    mirra.print_info()
    print(db.get_background_description(mirra.background))
    print(db.get_class_description(mirra.char_class))
    