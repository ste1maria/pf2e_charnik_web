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
    clone.getElementById("nameRow").textContent = data.name;
    clone.getElementById("levelRow").textContent = "Level: " + data.level;

    clone.getElementById("hpRow").textContent = "HP: " + data.hp;
	clone.getElementById("acRow").textContent = "AC: " + data.ac_total["acTotal"];

    clone.getElementById("fortitude").innerHTML =
  `<div class="icon-row">
	<span class="icon-prof ${getProficiencyLevel(data.proficiencies["fortitude"], data.level)}"></span>
	Fortitude: +${data.proficiencies["fortitude"]}
	</div>`;

    clone.getElementById("reflex").innerHTML =
  `<div class="icon-row">
	<span class="icon-prof ${getProficiencyLevel(data.proficiencies["reflex"], data.level)}"></span>
	Reflex: +${data.proficiencies["reflex"]}
	</div>`;
    clone.getElementById("will").innerHTML =
  `<div class="icon-row">
	<span class="icon-prof ${getProficiencyLevel(data.proficiencies["will"], data.level)}"></span>
	Will: +${data.proficiencies["will"]}
  </div>`;
    clone.getElementById("perception").innerHTML =
  `<div class="icon-row">
		<span class="icon-prof ${getProficiencyLevel(data.proficiencies["perception"], data.level)}"></span>
		Perception: +${data.proficiencies["perception"]}
	</div>`;

	clone.getElementById("ancestryCell").textContent = data.ancestry + "\n" + data.heritage;
	clone.getElementById("backgroundCell").textContent = data.background;
	clone.getElementById("classCell").textContent = data.char_class;
	
	clone.getElementById("sizeCell").textContent = data.size;
	clone.getElementById("speedCell").textContent = data.attributes["speed"];
	clone.getElementById("dcCell").textContent = data.DC;
	
	clone.getElementById("strCell").textContent = (data.strength > 0) ? "+" + data.strength : data.strength;
	clone.getElementById("conCell").textContent = (data.con > 0) ? "+" + data.con : data.con;
	clone.getElementById("dexCell").textContent = (data.dex > 0) ? "+" + data.dex : data.dex;
	clone.getElementById("intCell").textContent = (data.intel > 0) ? "+" + data.intel : data.intel;
	clone.getElementById("wisCell").textContent = (data.wis > 0) ? "+" + data.wis : data.wis;
	clone.getElementById("chaCell").textContent = (data.cha > 0) ? "+" + data.cha : data.cha;
    // Вставляем в DOM
    app.innerHTML = "";
    app.appendChild(clone);

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
