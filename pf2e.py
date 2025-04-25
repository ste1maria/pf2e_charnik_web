import mimetypes
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

from flask import Flask, render_template, request, jsonify
import tempfile, os, json
from character import Character
import traceback
import random, string

app = Flask(__name__, template_folder="./templates")

CHAR_DIR = os.path.join(os.path.dirname(__file__), "characters")

def generate_char_id(name, char_dir):
    base = name.lower().replace(" ", "_")  # заменим пробелы, уберём регистр

    while True:
        suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
        char_id = f"{base}-{suffix}"
        path = os.path.join(char_dir, f"{char_id}.json")
        if not os.path.exists(path):
            return char_id


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/import_json", methods=["POST"])
def import_character_json():
    uploaded_file = request.files.get("charfile")
    if not uploaded_file:
        return "Error: file not loaded", 400

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as tmp:
            uploaded_file.save(tmp.name)
            tmp_path = tmp.name

        char = Character(tmp_path)

        char_id = char_id = generate_char_id(char.name, CHAR_DIR)
        save_path = os.path.join(CHAR_DIR, f"{char_id}.json")

        with open(save_path, "w", encoding="utf-8") as f:
            json.dump(char.to_dict(), f)

        return jsonify({"char_id": char_id})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


@app.route("/get_character")
def get_character():
    char_id = request.args.get("char_id")
    if not char_id:
        return jsonify({"error": "char_id не указан"}), 400

    char_path = os.path.join(CHAR_DIR, f"{char_id}.json")
    if not os.path.exists(char_path):
        return jsonify({"error": "Персонаж не найден"}), 404

    with open(char_path, "r", encoding="utf-8") as f:
        char_data = json.load(f)

    return jsonify(char_data)


@app.route("/character")
def character_page():
    return render_template("character.html")

@app.route("/get_feat_description")
def get_feat_description():
    char_id = request.args.get("char_id")
    feat_name = request.args.get("feat_name")

    if not char_id or not feat_name:
        return jsonify({"description": "Недостаточно параметров"}), 400

    char_path = os.path.join(CHAR_DIR, f"{char_id}.json")
    if not os.path.exists(char_path):
        return jsonify({"description": "Персонаж не найден"}), 404

    char = Character(char_path)

    return_value = jsonify({"description":"N/A", "actionType":"N/A", "actions":"N/A"})
    try:
        description, action_type, actions = char.get_feat_description(feat_name)
        return_value = jsonify({"description": description, "actionType": action_type, "actions": actions})
        return return_value
    except Exception as exc:
        print("Error while getting description: ", exc)

    return jsonify({"description":"N/A", "actionType":"N/A", "actions":"N/A"})

@app.route("/get_weapon_flairs")
def get_weapon_flairs():
    char_id = request.args.get("char_id")
    weapon_name = request.args.get("weapon_name")

    if not char_id or not weapon_name:
        return jsonify({"description": "Недостаточно параметров"}), 400

    char_path = os.path.join(CHAR_DIR, f"{char_id}.json")
    if not os.path.exists(char_path):
        return jsonify({"description": "Персонаж не найден"}), 404

    char = Character(char_path)
    return_value = jsonify([])
    try:
        return_value = jsonify(char.get_weapon_flairs(weapon_name))
    except Exception as exc:
        print("Error while getting weapon description: ", exc)
        
    return return_value

if __name__ == "__main__":
    app.run(debug=True, port=5050)  # Running on http://localhost:5050

