from flask import Flask, render_template, request
import tempfile
import parsing
from character import Character
import pf2e_database.fetch_data as db

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/character")
def show_character_by_query():
    name = request.args.get("name")
    if not name:
        return "Нет имени персонажа", 400
    return show_character(name)

@app.route("/upload", methods=["POST"])
def upload_character():
    uploaded_file = request.files.get("charfile")
    if not uploaded_file:
        return "Файл не загружен", 400

    print("Загружен файл:", uploaded_file.filename)

    import tempfile, os
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as tmp:
            uploaded_file.save(tmp.name)
            tmp_path = tmp.name

        print("Сохранили как:", tmp_path)

        char = Character(tmp_path)
        print("Персонаж:", char.name)

        return render_template("character.html", character={
            "name": char.name,
            "level": char.level,
            "class": char.char_class,
            "hp": char.hp,
            "background": char.background,
            "background_description": db.get_background_description(char.background),
            "class_description": db.get_class_description(char.char_class)
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return f"<pre>{e}</pre>", 500

    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


@app.route("/character/<name>")
def show_character(name):
    try:
        char = Character(f"characters/{name}.json")

        return render_template("character.html", character={
            "name": char.name,
            "level": char.level,
            "class": char.char_class,
            "hp": char.hp,
            "background": char.background,
            "background_description": db.get_background_description(char.background),
            "class_description": db.get_class_description(char.char_class)
        })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return f"<pre>{e}</pre>", 500


if __name__ == "__main__":
    app.run(debug=True, port=5050)  # Running on http://localhost:5050

