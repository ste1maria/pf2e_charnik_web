document.addEventListener("DOMContentLoaded", () => {
  function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  function renderCharacter(data) {
  const app = document.getElementById("charSheet");
  const template = document.getElementById("characterTemplate");

  // Клонируем шаблон и вставляем в страницу
  app.innerHTML = template.innerHTML;

  // Заголовок
  document.getElementById("charName").textContent = data.name;
  document.getElementById("charClass").textContent = data.class;
  document.getElementById("charLevel").textContent = data.level;
  document.getElementById("charHP").textContent = data.hp;

  // Экраны
  document.getElementById("screenStats").innerHTML = `
    <h3>Описание</h3>
    <p>${data.background_description}</p>
    <p>${data.class_description}</p>
  `;

  document.getElementById("screenProficiencies").innerHTML = `
    <h3>Способности</h3>
    <p>🧠 Coming soon</p>
  `;

  document.getElementById("screenFeats").innerHTML = `
    <h3>Заклинания</h3>
    <p>📘 Coming soon</p>
  `;

  document.getElementById("screenSpells").innerHTML = `
    <h3>Инвентарь</h3>
    <p>🎒 Coming soon</p>
  `;

  // Навигация между экранами
  let currentScreen = 0;
  const track = document.getElementById("screenTrack");
  const left = document.getElementById("screenLeft");
  const right = document.getElementById("screenRight");

  function updateScreen() {
    track.style.transform = `translateX(-${currentScreen * 100}vw)`;
  }

  left.addEventListener("click", () => {
    if (currentScreen > 0) {
      currentScreen--;
      updateScreen();
    }
  });

  right.addEventListener("click", () => {
    if (currentScreen < track.children.length - 1) {
      currentScreen++;
      updateScreen();
    }
  });
}

  const name = getQueryParam("name");
  if (!name) {
    document.getElementById("charSheet").innerHTML = "<p>No parameter 'name'</p>";
    return;
  }

  const characters = JSON.parse(localStorage.getItem("characters") || "[]");
  const character = characters.find(c => c.name === name);

  if (!character) {
    document.getElementById("charSheet").innerHTML = `
      <p>Персонаж "${name}" не найден.</p>
      <p>В наличии: ${characters.map(c => c.name).join(", ")}</p>
    `;
  } else {
    renderCharacter(character);
  }
});
