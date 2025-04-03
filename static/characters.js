const newCharacterBtn = document.getElementById("newCharacterBtn");
  const modal = document.getElementById("newCharacterModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const importJsonBtn = document.getElementById("importJsonBtn");
  const importJsonInput = document.getElementById("importJsonInput");
  const createNewBtn = document.getElementById("createNewBtn");

  newCharacterBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
  });

  closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  createNewBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
    alert("Создание нового персонажа пока не реализовано");
  });

  importJsonBtn.addEventListener("click", () => {
    importJsonInput.click();
  });

    window.addEventListener("DOMContentLoaded", () => {
      const saved = localStorage.getItem("currentCharacter");
      if (saved) {
        try {
          const char = JSON.parse(saved);
          renderCharacter(char);
        } catch (e) {
          console.error("Ошибка чтения currentCharacter:", e);
        }
      }

      renderCharacterList(); // показать список
    });

importJsonInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) {
    alert("Файл не выбран");
    return;
  }

  const formData = new FormData();
  formData.append("charfile", file);

  try {
    const res = await fetch("/import_json", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.error) {
      alert("Ошибка: " + data.error);
    } else {
      saveCharacterToLocal(data);
      renderCharacterList();
      alert("Персонаж импортирован!");
    }
  } catch (err) {
    alert("Ошибка при отправке: " + err.message);
  }

  modal.classList.add("hidden");
});



function saveCharacterToLocal(character) {
  const all = JSON.parse(localStorage.getItem("characters") || "[]");

  // Проверим — если такой уже есть по имени, заменим
  const existingIndex = all.findIndex(c => c.name === character.name);
  if (existingIndex !== -1) {
    all[existingIndex] = character;
  } else {
    all.push(character);
  }

  localStorage.setItem("characters", JSON.stringify(all));
  localStorage.setItem("currentCharacter", JSON.stringify(character));

  renderCharacterList();
}

  window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("currentCharacter");
  if (saved) {
    try {
      const char = JSON.parse(saved);
      renderCharacter(char);
    } catch (e) {
      console.error("Ошибка чтения из localStorage:", e);
    }
  }
});

function renderCharacterList() {
  const list = document.getElementById("characterList");
  list.innerHTML = "";

  const saved = JSON.parse(localStorage.getItem("characters") || "[]");

  if (saved.length === 0) {
    list.innerHTML = "<li>Нет сохранённых персонажей</li>";
    return;
  }

  saved.forEach((char, index) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.textContent = `${char.name} (уровень ${char.level})`;
    btn.addEventListener("click", () => {
    window.location.href = `/character?name=${encodeURIComponent(char.name)}`;
    });

    li.appendChild(btn);
    list.appendChild(li);
  });
}