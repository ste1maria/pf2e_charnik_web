document.addEventListener("DOMContentLoaded", () => {
  function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  function renderCharacter(data) {
    const container = document.getElementById("app");
    container.innerHTML = `
      <h2>${data.name} (уровень ${data.level})</h2>
      <p><strong>Класс:</strong> ${data.class}</p>
      <p><strong>HP:</strong> ${data.hp}</p>
      <p><strong>Происхождение:</strong> ${data.background}</p>
      <p>${data.background_description}</p>
      <p><strong>Описание класса:</strong></p>
      <p>${data.class_description}</p>
    `;
  }

  const name = getQueryParam("name");
  if (!name) {
    document.getElementById("app").innerHTML = "<p>Нет параметра 'name'</p>";
    return;
  }

  const characters = JSON.parse(localStorage.getItem("characters") || "[]");
  const character = characters.find(c => c.name === name);

  if (!character) {
    document.getElementById("app").innerHTML = `
      <p>Персонаж "${name}" не найден.</p>
      <p>В наличии: ${characters.map(c => c.name).join(", ")}</p>
    `;
  } else {
    renderCharacter(character);
  }
});
