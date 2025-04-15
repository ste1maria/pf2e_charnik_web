document.addEventListener("DOMContentLoaded", () => {
	function getQueryParam(name) {
	const url = new URL(window.location.href);
	return url.searchParams.get(name);
	}

	function getProficiencyLevel(ability, level) {
	  if ((ability-level) < 2) return "untrained";
	  if ((ability-level) >= 2 && (ability-level) < 4) return "trained";
	  if ((ability-level) >= 4 && (ability-level) < 6) return "expert";
	  if ((ability-level) >= 6 && (ability-level) < 8) return "master";
	  if ((ability-level) >= 8) return "legend";
	  return "untrained";
	}

	function renderCharacter(data) {
		const app = document.getElementById("charSheet");
		const template = document.getElementById("characterTemplate");

		const clone = template.content.cloneNode(true);

		// Заголовок
		clone.querySelector("#nameRow").textContent = data.name;
		clone.querySelector("#levelRow").textContent = "Level: " + data.level;

		//clone.getElementById("hpRow").textContent = "HP: " + data.hp;
		clone.querySelector("#hpRow").innerHTML = `
		HP: <span id="hpDisplay">${data.hp}</span> / <span id="maxHP">${data.hp}</span>
		`;

		clone.querySelector("#acRow").textContent = "AC: " + data.ac_total["acTotal"];

		clone.querySelector("#fortitude").innerHTML =
		`<div class="icon-row">
		<span class="icon-prof ${getProficiencyLevel(data.proficiencies["fortitude"], data.level)}"></span>
		Fortitude: +${data.proficiencies["fortitude"]}
		</div>`;

		clone.querySelector("#reflex").innerHTML =
		`<div class="icon-row">
		<span class="icon-prof ${getProficiencyLevel(data.proficiencies["reflex"], data.level)}"></span>
		Reflex: +${data.proficiencies["reflex"]}
		</div>`;
		clone.querySelector("#will").innerHTML =
		`<div class="icon-row">
		<span class="icon-prof ${getProficiencyLevel(data.proficiencies["will"], data.level)}"></span>
		Will: +${data.proficiencies["will"]}
		</div>`;
		clone.querySelector("#perception").innerHTML =
		`<div class="icon-row">
		<span class="icon-prof ${getProficiencyLevel(data.proficiencies["perception"], data.level)}"></span>
		Perception: +${data.proficiencies["perception"]}
		</div>`;

		clone.querySelector("#ancestryCell").textContent = data.ancestry + "\n" + data.heritage;
		clone.querySelector("#backgroundCell").textContent = data.background;
		clone.querySelector("#classCell").textContent = data.char_class;

		clone.querySelector("#sizeCell").textContent = data.size;
		clone.querySelector("#speedCell").textContent = data.attributes["speed"];
		clone.querySelector("#dcCell").textContent = data.DC;

		clone.querySelector("#strCell").textContent = (data.strength > 0) ? "+" + data.strength : data.strength;
		clone.querySelector("#conCell").textContent = (data.con > 0) ? "+" + data.con : data.con;
		clone.querySelector("#dexCell").textContent = (data.dex > 0) ? "+" + data.dex : data.dex;
		clone.querySelector("#intCell").textContent = (data.intel > 0) ? "+" + data.intel : data.intel;
		clone.querySelector("#wisCell").textContent = (data.wis > 0) ? "+" + data.wis : data.wis;
		clone.querySelector("#chaCell").textContent = (data.cha > 0) ? "+" + data.cha : data.cha;
		// Вставляем в DOM
		app.innerHTML = "";
		app.appendChild(clone);
		
			function updateScreen() {
	  track.style.transform = `translateX(-${currentScreen * 100}vw)`;
	}

	let currentScreen = 0;
	const track = document.getElementById("screenTrack");
	const left = document.getElementById("screenLeft");
	const right = document.getElementById("screenRight");
	
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

    let touchStartX = 0;
    let touchEndX = 0;

	track.addEventListener("touchstart", e => {
		touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener("touchend", e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff < 0 && currentScreen < track.children.length - 1) {
          currentScreen++;
        } else if (diff > 0 && currentScreen > 0) {
          currentScreen--;
        }
        updateScreen();
      }
    }
	}



  // Инициализация обработчика после полной загрузки

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
  
  
  // Элемент, по которому будем кликом открывать модалку (текущий HP)
  const hpDisplay = document.getElementById("hpDisplay");
  // Модальное окно и его элементы
  const modal = document.getElementById("hpModal");
  const closeModal = document.querySelector("#hpModal .close");
  const modalCurrentHP = document.getElementById("modalCurrentHP");
  const hpAdjustmentInput = document.getElementById("hpAdjustment");
  const subtractButton = document.getElementById("subtractHP");
  const addButton = document.getElementById("addHP");

  // Функция для открытия модального окна
  function openHpModal() {
    modal.style.display = "block";
	modal.classList.remove("hidden");
    // Получаем текущее значение HP из hpDisplay
    const currentHP = parseInt(hpDisplay.textContent, 10);
    modalCurrentHP.textContent = currentHP;
    hpAdjustmentInput.value = ""; // очистить поле ввода
  }

  // Открываем модал по клику на hpDisplay
  hpDisplay.addEventListener("click", openHpModal);

  // Закрытие модала по клику на крестик
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Закрываем модал, если клик вне области модального содержимого
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Функция для обновления HP
  function updateHP(operation) {
    let adjustment = parseInt(hpAdjustmentInput.value, 10);
    if (isNaN(adjustment)) {
      alert("Please enter a valid number");
      return;
    }
    let currentHP = parseInt(hpDisplay.textContent, 10);
    let newHP;
    if (operation === "subtract") {
      newHP = currentHP - adjustment;
    } else if (operation === "add") {
      newHP = currentHP + adjustment;
    }
    // Обновляем значение HP в отображении и (опционально) в localStorage
    hpDisplay.textContent = newHP;
    // Закрываем модальное окно
    modal.style.display = "none";
  }

  // Обработчики для кнопок модала
  subtractButton.addEventListener("click", () => {
    updateHP("subtract");
  });

  addButton.addEventListener("click", () => {
    updateHP("add");
  });
});
