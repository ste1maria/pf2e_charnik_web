import mimetypes
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')
from flask import Flask, render_template, request, jsonify
import tempfile, os, json
import parsing
from character import Character
import pf2e_database.fetch_data as db
import traceback

app = Flask(__name__, template_folder="./templates")

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
        character_data = char.to_dict()
        print(character_data)
        return jsonify(character_data)

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


@app.route("/character")
def character_page():
    return render_template("character.html")

if __name__ == "__main__":
    app.run(debug=True, port=5050)  # Running on http://localhost:5050

