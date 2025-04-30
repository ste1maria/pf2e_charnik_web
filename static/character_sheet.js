
	// Получаем char_id из URL
	const params = new URLSearchParams(window.location.search);
	const characterId = params.get("char_id");
	
	let currentHp = 0;
	fetch(`/get_character?char_id=${characterId}`)
	  .then(res => res.json())
	  .then(data => {
		renderCharacter(data);
	  });

	function getQueryParam(name) {
	const url = new URL(window.location.href);
	return url.searchParams.get(name);
	}
	
	const template = document.getElementById("characterTemplate");
	const app = document.getElementById("charSheet");

	function renderCharacter(data) {
		const clone = template.content.cloneNode(true);

		// Заголовок
		currentHp = data.hp;
		
		clone.querySelector("#nameRow").textContent = data.name;
		clone.querySelector("#levelRow").textContent = "Level: " + data.level;
		clone.querySelector("#hpDisplay").innerHTML = `${currentHp}`;
		clone.querySelector("#maxHP").innerHTML=`${data.hp}`;
		clone.querySelector("#acRow").textContent = "AC: " + data.ac_total["acTotal"];

		// basic abilities
		clone.querySelector("#fortitude").innerHTML =
		`<div class="icon-row">
		<span class="icon-prof ${getSkillProficiency(data.proficiencies["fortitude"])}"> </span>
		Fortitude: +${data.fortitude}
		</div>`;
		clone.querySelector("#reflex").innerHTML =
		`<div class="icon-row">
		<span class="icon-prof ${getSkillProficiency(data.proficiencies["reflex"])}"> </span>
		Reflex: +${data.reflex}
		</div>`;
		clone.querySelector("#will").innerHTML =
		`<div class="icon-row">
		<span class="icon-prof ${getSkillProficiency(data.proficiencies["will"])}"> </span>
		Will: +${data.will}
		</div>`;
		clone.querySelector("#perception").innerHTML =
		`<div class="icon-row">
		<span class="icon-prof ${getSkillProficiency(data.proficiencies["perception"])}"> </span>
		Perception: +${data.perception}
		</div>`;

		// character background
		clone.querySelector("#ancestryCell").innerHTML = `<div>${data.ancestry}</div> <div>${data.heritage}</div>`;
		clone.querySelector("#backgroundCell").textContent = data.background;
		clone.querySelector("#classCell").textContent = data.char_class;

		clone.querySelector("#sizeCell").textContent = data.size;
		clone.querySelector("#speedCell").textContent = data.attributes["speed"];
		clone.querySelector("#dcCell").textContent = data.DC;

		// Stats
		clone.querySelector("#strCell").textContent = (data.strength > 0) ? "+" + data.strength : data.strength;
		clone.querySelector("#conCell").textContent = (data.con > 0) ? "+" + data.con : data.con;
		clone.querySelector("#dexCell").textContent = (data.dex > 0) ? "+" + data.dex : data.dex;
		clone.querySelector("#intCell").textContent = (data.intel > 0) ? "+" + data.intel : data.intel;
		clone.querySelector("#wisCell").textContent = (data.wis > 0) ? "+" + data.wis : data.wis;
		clone.querySelector("#chaCell").textContent = (data.cha > 0) ? "+" + data.cha : data.cha;
		
		// skills
		clone.querySelector("#modifierAcrobatics").innerHTML = `
		+${data.skills["acrobatics"]} <span class="icon-prof ${getSkillProficiency(data.proficiencies["acrobatics"])}"></span>
		`;
		clone.querySelector("#modifierArcana").innerHTML = `
		+${data.skills["arcana"]} <span class="icon-prof ${getSkillProficiency(data.proficiencies["arcana"])}"></span>
		`;
		clone.querySelector("#modifierAthletics").innerHTML = `
		+${data.skills["athletics"]} <span class="icon-prof ${getSkillProficiency(data.proficiencies["athletics"])}"></span>
		`;
		clone.querySelector("#modifierCrafting").innerHTML = `
		+${data.skills["crafting"]} <span class="icon-prof ${getSkillProficiency(data.proficiencies["crafting"])}"></span>
		`;
		clone.querySelector("#modifierDeception").innerHTML = `
		+${data.skills["deception"]} <span class="icon-prof ${getSkillProficiency(data.proficiencies["deception"])}"></span>
		`;
		clone.querySelector("#modifierDiplomacy").innerHTML = `
		+${data.skills["diplomacy"]} <span class="icon-prof ${getSkillProficiency(data.proficiencies["diplomacy"])}"></span>
		`;
		clone.querySelector("#modifierIntimidation").innerHTML = `
		+${data.skills["intimidation"]} <span class="icon-prof ${getSkillProficiency(data.proficiencies["intimidation"])}"></span>
		`;
		clone.querySelector("#modifierMedicine").innerHTML = `
		+${data.skills["medicine"]} <span class="icon-prof ${getSkillProficiency(data.proficiencies["medicine"])}"></span>
		`;
		clone.querySelector("#modifierNature").innerHTML = `
		+${data.skills["nature"]} <span class="icon-prof ${getSkillProficiency(data.proficiencies["nature"])}"></span>
		`;
		clone.querySelector("#modifierOccultism").innerHTML = `
		+${data.skills["occultism"]} <span class="icon-prof ${getSkillProficiency(data.proficiencies["occultism"])}"></span>
		`;
		clone.querySelector("#modifierPerformance").innerHTML = `
		+${data.skills["performance"]} <span class="icon-prof ${getSkillProficiency(data.proficiencies["performance"])}"></span>
		`;
		clone.querySelector("#modifierReligion").innerHTML = `
		+${data.skills["religion"]} <span class="icon-prof ${getSkillProficiency(data.proficiencies["religion"])}"></span>
		`;
		clone.querySelector("#modifierSociety").innerHTML = `
		+${data.skills["society"]} <span class="icon-prof ${getSkillProficiency(data.proficiencies["society"])}"></span>
		`;
		clone.querySelector("#modifierStealth").innerHTML = `
		+${data.skills["stealth"]} <span class="icon-prof ${getSkillProficiency(data.proficiencies["stealth"])}"></span>
		`;
		clone.querySelector("#modifierSurvival").innerHTML = `
		+${data.skills["survival"]} <span class="icon-prof ${getSkillProficiency(data.proficiencies["survival"])}"></span>
		`;
		clone.querySelector("#modifierThievery").innerHTML = `
		+${data.skills["thievery"]} <span class="icon-prof ${getSkillProficiency(data.proficiencies["thievery"])}"></span>
		`;
		
		const listLores = clone.querySelector("#listLores");
		const loreTemplate = clone.querySelector("#loreItemTemplate");
		
		data.lores.forEach(lore => {
		  const newItem = loreTemplate.content.cloneNode(true);

		  newItem.querySelector(".lore-name").textContent = "Lore: " + lore[0];
		  newItem.querySelector(".skill-modifier").innerHTML = `
			${(lore[1] + lore[2]) >= 0 ? `+${(lore[1] + lore[2])}` : (lore[1] + lore[2])} 
			<span class="icon-prof ${getSkillProficiency(lore[1])}"></span>
			`;

		  listLores.appendChild(newItem);
		});
				
		// feats
		const featTemplate = clone.querySelector("#featTemplate");
		const listFeats = clone.querySelector("#listFeats");
		const listSpecialFeats = clone.querySelector("#listSpecialFeats");
		
		data.class_feats.forEach(feat => {
		  fetch(`/get_feat_description?feat_name=${encodeURIComponent(feat[0])}`)
			.then(res => res.json())
			.then(data => {
				listFeats.appendChild(printFeatWithIcon(featTemplate, feat, data.actionType, data.actions));
			})
			.catch(err => {
			  console.error("Ошибка при получении фита:", feat[0], err);
			});
		});
		
		data.skill_feats.forEach(feat => {
		  fetch(`/get_feat_description?feat_name=${encodeURIComponent(feat[0])}`)
			.then(res => res.json())
			.then(data => {
				listFeats.appendChild(printFeatWithIcon(featTemplate, feat, data.actionType, data.actions));
			})
			.catch(err => {
			  console.error("Ошибка при получении фита:", feat[0], err);
			});
		}); 
		
		data.heritage_feats.forEach(feat => {
		  fetch(`/get_feat_description?feat_name=${encodeURIComponent(feat[0])}`)
			.then(res => res.json())
			.then(data => {
				listFeats.appendChild(printFeatWithIcon(featTemplate, feat, data.actionType, data.actions));
			})
			.catch(err => {
			  console.error("Ошибка при получении фита:", feat[0], err);
			});
		});
		
		data.ancestry_feats.forEach(feat => {
		  fetch(`/get_feat_description?feat_name=${encodeURIComponent(feat[0])}`)
			.then(res => res.json())
			.then(data => {
				listFeats.appendChild(printFeatWithIcon(featTemplate, feat, data.actionType, data.actions));
			})
			.catch(err => {
			  console.error("Ошибка при получении фита:", feat[0], err);
			});
		});
		
		data.special_feats.forEach(feat => {
		  const newItem = featTemplate.content.cloneNode(true);

		  fetch(`/get_feat_description?feat_name=${encodeURIComponent(feat)}`)
			.then(res => res.json())
			.then(data => {
			  const actionIcon = getActionIcon(data.actionType, data.actions);
				
			  newItem.querySelector("#featName").innerHTML = `
				${feat}   <img src="/static/icons/actions/${actionIcon}" class="img-fluid" 
				style="max-width: 18px; background: transparent;">
			  `;

			  listSpecialFeats.appendChild(newItem);
			})
			.catch(err => {
			  console.error("Ошибка при получении фита:", feat[0], err);
			});
		});
		
		// Weapons
		const weaponTemplate = clone.querySelector("#weaponTemplate");
		const listWeapons = clone.querySelector("#weaponSection");

		if (Object.keys(data.weapons).length === 0)
		{
			const newWeaponEntry = weaponTemplate.content.cloneNode(true);
			newWeaponEntry.querySelector("#weaponName").textContent = "No weapon";
			listWeapons.appendChild(newWeaponEntry);
		}
		else 
		{
			data.weapons.forEach(weapon => {
				const newWeaponEntry = weaponTemplate.content.cloneNode(true);
			
				newWeaponEntry.querySelector("#weaponName").innerHTML = `
					${weapon.name} <span class="icon-prof ${getSkillProficiency(data.proficiencies[weapon.prof])}">
					</span>			
				`;
	
				newWeaponEntry.querySelector("#weaponDamage").innerHTML = `
					Damage: ${weapon.die} + ${weapon.damageBonus}; ${weapon.damageType}
				`;
				newWeaponEntry.querySelector("#weaponAttackRoll").innerHTML = `
					Hit: +${weapon.attack}
				`;

  				const flairContainer = newWeaponEntry.querySelector(".weapon-flairs");

				fetch(`/get_weapon_flairs?weapon_name=${encodeURIComponent(weapon.name)}`)
					.then(res => res.json())
					.then(flairs => {
						flairContainer.innerHTML = ""; // очистим перед вставкой
						flairs.forEach(flair => {
							const tag = document.createElement("div");
							tag.textContent = flair;
							tag.classList.add("flair-tag"); // кастомный стиль
							flairContainer.appendChild(tag);
						});
					});
	
				listWeapons.appendChild(newWeaponEntry);
			});
		}
		
		// armor
		const armorTemplate = clone.querySelector("#armorTemplate");
		const shieldTemplate = clone.querySelector("#shieldTemplate");
		const listArmor = clone.querySelector("#armorSection");

		if (Object.keys(data.armor).length === 0)
		{
			const newArmorEntry = armorTemplate.content.cloneNode(true);
			newArmorEntry.querySelector("#armorName").textContent = "No armor";
			listArmor.appendChild(newArmorEntry);
		}
		else 
		{
			data.armor.forEach(armor => {
				if (armor.prof === "shield") 
				{
					const newShieldEntry = shieldTemplate.content.cloneNode(true);
					newShieldEntry.querySelector("#shieldName").innerHTML = `
						<span class="icon-prof ${getSkillProficiency(data.proficiencies[armor.prof])}">
						</span>	${armor.name} 		 
					`;
					newShieldEntry.querySelector("#shieldAC").textContent = `AC bonus: ${data.acTotal.shieldBonus}`;
					newShieldEntry.querySelector("#armorHarndess").textContent = `-hardness coming soon-`;
					newShieldEntry.querySelector("#HP(BT)").textContent = `Shield health: `;
					listArmor.appendChild(newShieldEntry);
				}
				else 
				{
					const newArmorEntry = armorTemplate.content.cloneNode(true);
					newArmorEntry.querySelector("#armorName").innerHTML = `
						<span class="icon-prof ${getSkillProficiency(data.proficiencies[armor.prof])}">
						</span>	${armor.name} 	
					`;	 
					
					const armorAcEl = newArmorEntry.querySelector("#armorAC");
					const dexCapEl = newArmorEntry.querySelector("#armorDexCap");
					const checkPenaltyEl = newArmorEntry.querySelector("#armorCheckPenalty");
					
					fetch(`/get_armor_data?armor_name=${encodeURIComponent(armor.name)}`)
					.then(res => res.json())
					.then(data => {
						armorAcEl.innerHTML = `AC:&nbsp${data.acBonus}`;
						dexCapEl.innerHTML = `Dex Cap:&nbsp${data.dexCap}`;
						checkPenaltyEl.innerHTML = `Check penalty:&nbsp${data.checkPenalty}`;
					});
					

					listArmor.appendChild(newArmorEntry);
				}
			});
		}

		clone.querySelector("#lightArmorProf").innerHTML = `
			<span class="icon-prof ${getSkillProficiency(data.proficiencies["light"])}"
			style="margin-left:1rem;">
			</span>Light
		`;
		clone.querySelector("#mediumArmorProf").innerHTML = `
			<span class="icon-prof ${getSkillProficiency(data.proficiencies["medium"])}"
			style="margin-left:1rem;">
			</span>Medium
		`;
		clone.querySelector("#heavyArmorProf").innerHTML = `
			<span class="icon-prof ${getSkillProficiency(data.proficiencies["heavy"])}"
			style="margin-left:1rem;">
			</span>Heavy
		`;
		clone.querySelector("#unarmoredProf").innerHTML = `
			<span class="icon-prof ${getSkillProficiency(data.proficiencies["unarmored"])}"
			style="margin-left:1rem;">
			</span>Unarmored
		`;

		// spells
		const tabButtonsContainer = clone.querySelector("#tabButtons");
		const tabContentsContainer = clone.querySelector("#tab-contents");
		const tabSpellsTemplate = clone.querySelector("#tabSpellsCategory");

		if (data.spell_casters.length == 0)
		{
			const casterTab = document.createElement("div");
			casterTab.id = `tabNoSpells`;
			casterTab.classList.add("tab-content");
			tabContentsContainer.appendChild(casterTab);
	  
			// 3. Для каждого уровня создаём блок
			const noSpellsLabel = tabSpellsTemplate.content.cloneNode(true);
			const ul = noSpellsLabel.querySelector("ul.list-group");

			const li = document.createElement("li");
			li.classList.add("list-group-item", "d-flex", "flex-row", "justify-content-between");
	
			const spellNameDiv = document.createElement("div");
			spellNameDiv.classList.add("text-info", "font-weight-bold", "spell-name");
			spellNameDiv.textContent = "No spells!";
	
			li.appendChild(spellNameDiv);
			ul?.appendChild(li);
		
			// Кладём уровень внутрь вкладки кастера
			casterTab.appendChild(noSpellsLabel);
		}
		else
		{
			tabButtonsContainer.innerHTML = ``;

			data.spell_casters.forEach(spellCaster => {
				renderCasterSpells(clone, spellCaster, (data.cha + spellCaster.proficiency + data.level));
			});

			if (data.focus.length != 0)
			{
				const focusTab = clone.querySelector("#tabFocusSpells");
				const focusTemplate = focusTab.querySelector("#focusSpellsListByLevel");
				
				// создаём список, в который будем вставлять все <li>
				const ul = document.createElement("ul");
				ul.classList.add("list-group", "mt-2");
				
				if (data.focus.length != 0)
				{
					const button = document.createElement("button");
					button.classList.add("button-tab", "inactive");
					button.dataset.tab = `tabFocusSpells`; // уникальный tab ID
					button.textContent = "Focus";

					tabButtonsContainer.appendChild(button);
				}
				// проходим по всем традициям
				Object.entries(data.focus).forEach(([tradition, abilities], focus) => {
					
				Object.entries(abilities).forEach(([ability, details]) => {
					// заголовок для блока
					const header = document.createElement("li");
					header.classList.add("list-group-item", "text-info", "bg-light", "font-weight-bold");
					header.textContent = `${tradition.toUpperCase()} (${ability.toUpperCase()})`;
					ul.appendChild(header);
				
					// focus cantrips
					(details.focusCantrips || []).forEach(spell => {
					const li = focusTemplate.content.cloneNode(true);
					li.querySelector("li").textContent = `${spell} (Cantrip)`;
					ul.appendChild(li);
					});
				
					// focus spells
					(details.focusSpells || []).forEach(spell => {
					const li = focusTemplate.content.cloneNode(true);
					li.querySelector("li").textContent = spell;
					ul.appendChild(li);
					});
				});
				});
				
				// вставляем в tabFocusSpells
				focusTab.innerHTML = ""; // очистим старое
				focusTab.appendChild(ul);
			}
		}

		// Вставляем в DOM
		app.innerHTML = "";
		app.appendChild(clone);
		
		const event = new CustomEvent("characterRendered");
		app.dispatchEvent(event);
	}

	app.addEventListener("characterRendered", () => {
		const track = app.querySelector("#screenTrack");
		const screens  = app.querySelectorAll(".screen");
		const dotsContainer = app.querySelector("#screenDots");
		
		let currentScreen = 0;
	
		let touchStartX = 0;
		let touchEndX = 0;

			// Генерация точек
		screens.forEach((_, index) => {
		  const dot = document.createElement("div");
		  dot.classList.add("dot");
		  if (index === 0) dot.classList.add("active");

		  dot.addEventListener("click", () => {
			currentScreen = index;
			updateScreen();
		  });

		  dotsContainer.appendChild(dot);
		});
		
		track.addEventListener("touchstart", e => {
			touchStartX = e.changedTouches[0].screenX;
			console.log("swipe start");
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
		
		function updateScreen() {
		  track.style.transform = `translateX(-${currentScreen * 100}vw)`;
		  updateDots(dotsContainer);
		}

		function updateDots(dotsContainer) {
		   dotsContainer.querySelectorAll(".dot").forEach((dot, index) => {
			dot.classList.toggle("active", index === currentScreen);
		  });
		}

		// Элемент, по которому будем кликом открывать модалку (текущий HP)
		const hpDisplay = app.querySelector("#hpDisplay");
		// Открываем модал по клику на hpDisplay
		hpDisplay.addEventListener("click", openHpModal);

		app.querySelector("#listFeats").addEventListener("click", (e) => {
			const li = e.target.closest("li.list-group-item");
			if (!li) return;

			const featNameEl = li.querySelector(".feat-name");
			if (!featNameEl) return;

			const featName = featNameEl.textContent.trim();
			fetch(`/get_feat_description?feat_name=${encodeURIComponent(featName)}`)
				.then(res => res.json())
				.then(data => {
					openFeatModal(data.description);
			});
		});
	
		app.querySelector("#listSpecialFeats").addEventListener("click", (e) => {
			const li = e.target.closest("li.list-group-item");
			if (!li) return;

			const featNameEl = li.querySelector(".feat-name");
			if (!featNameEl) return;

			const featName = featNameEl.textContent.trim();
			fetch(`/get_feat_description?feat_name=${encodeURIComponent(featName)}`)
				.then(res => res.json())
				.then(data => {
					openFeatModal(data.description);
			});
		});

		setupTabs(app.querySelector("#spellsScreen"));

		app.querySelectorAll(".spells-list").forEach(spellsList => {
			spellsList.addEventListener("click", (e) => {
			  const li = e.target.closest("li.list-group-item");
			  if (!li) return;
		  
			  const spellNameEl = li.querySelector(".spell-name");
			  if (!spellNameEl) return;
		  
			  const spellName = spellNameEl.textContent.trim();
			  fetch(`/get_spell_description?spell_name=${encodeURIComponent(spellName)}`)
				.then(res => res.json())
				.then(data => {
				  openSpellModal(spellName, data);
				});
			});
		  });
	});
	
	// HP modification modal
	const hpModal = document.getElementById("hpModal");
	const closeHpModal = document.querySelector("#hpModal .close");
	const modalCurrentHP = document.getElementById("modalCurrentHP");
	const hpAdjustmentInput = document.getElementById("hpAdjustment");
	const subtractButton = document.getElementById("subtractHP");
	const addButton = document.getElementById("addHP");

	function openHpModal() {
		hpModal.style.display = "block";
		hpModal.classList.remove("hidden");
		// Получаем текущее значение HP из hpDisplay
		const currentHP = parseInt(hpDisplay.textContent, 10);
		modalCurrentHP.textContent = currentHP;
		hpAdjustmentInput.value = ""; // очистить поле ввода
	}

	closeHpModal.addEventListener("click", () => {
		hpModal.style.display = "none";
	});

	window.addEventListener("click", (event) => {
		if (event.target === hpModal) {
			hpModal.style.display = "none";
		}
		if (event.target === featModal) {
			featModal.style.display = "none";
		}
		if (event.target === spellModal) {
			spellModal.style.display = "none";
		}
	});

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
		hpDisplay.textContent = newHP;
		// Закрываем модальное окно
		hpModal.style.display = "none";
	}

	subtractButton.addEventListener("click", () => {
		updateHP("subtract");
	});

	addButton.addEventListener("click", () => {
		updateHP("add");
	});		
	
	// feat description modal
	const closeFeatModal = document.querySelector("#featInfoModal .close");
	const featModal = document.getElementById("featInfoModal");
	const featModalText = document.getElementById("featModalText");
		  
	function openFeatModal(featDescription) {
		featModal.style.display = "block";
		featModal.classList.remove("hidden");
		featModalText.innerHTML = `${featDescription}`;
	}
	
	closeFeatModal.addEventListener("click", () => {
		featModal.style.display = "none";
	});

	const spellModal = document.getElementById("spellInfoModal");
	const closeSpellModal = document.querySelector("#spellInfoModal .close");

	// spell description modal
	function openSpellModal(spellName, spellDescr)
	{
		document.getElementById("spellNameModal").innerText = `${spellName}`;

		const spellParameters = document.getElementById("spellParameters");
		const spellFlairs = document.getElementById("spellFlairs");
		spellParameters.innerHTML = ``;
		spellFlairs.innerHTML = ``;

		if (spellDescr.traditions.length > 0)
		{
			spellParameters.innerHTML += `Traditions: &nbsp <span class="text-info">${spellDescr.traditions.join(", ")}</span> <br>`
		}
		if (spellDescr.cast.length > 0)
		{
			spellParameters.innerHTML += `Actions: &nbsp <span class="text-info">${spellDescr.cast}</span><br>`
		}
		if (spellDescr.range.length > 0)
		{
			spellParameters.innerHTML += `Range: &nbsp <span class="text-info">${spellDescr.range}</span><br>`
		}
		if (spellDescr.duration.length > 0)
		{
			spellParameters.innerHTML += `Duration: &nbsp <span class="text-info">${spellDescr.duration}</span><br>`
		}


		if (spellDescr.flairs.length > 0)
		{
			spellDescr.flairs.forEach(flair => {
				const tag = document.createElement("div");
				tag.textContent = flair;
				tag.classList.add("flair-spell"); // кастомный стиль
				spellFlairs.appendChild(tag);
			});
		}

		const spellDescription = document.getElementById("spellDescription");
		spellDescription.innerHTML = spellDescr.description;

		spellModal.style.display = "block";
		spellModal.classList.remove("hidden");
	}

	closeSpellModal.addEventListener("click", () => {
		spellModal.style.display = "none";
	});

	// helper functions
	function getProficiencyLevel(ability, level) {
	  if ((ability-level) < 2) return "untrained";
	  if ((ability-level) >= 2 && (ability-level) < 4) return "trained";
	  if ((ability-level) >= 4 && (ability-level) < 6) return "expert";
	  if ((ability-level) >= 6 && (ability-level) < 8) return "master";
	  if ((ability-level) >= 8) return "legend";
	  return "untrained";
	}
		
	function getSkillProficiency(skill) {
	  if (skill < 2) return "untrained";
	  if (skill >= 2 && skill < 4) return "trained";
	  if (skill >= 4 && skill < 6) return "expert";
	  if (skill >= 6 && skill < 8) return "master";
	  if (skill >= 8) return "legend";
	  return "untrained";
	}
	
	function getActionIcon(actionType, actions)	{
		if (actions === null) {
			if (actionType === "reaction") return "Reaction.webp";
			if (actionType === "passive") return "Empty.webp";
			if (actionType === "free") return "FreeAction.webp";
		}
		if (actions === 1) return "OneAction.webp";
		if (actions === 2) return "TwoActions.webp";
		if (actions === 3) return "ThreeActions.webp";
		return "Empty.webp"
	}
	
	function printFeatWithIcon(template, feat, actionType, actions)	{
		const newItem = template.content.cloneNode(true);
		const actionIcon = getActionIcon(actionType, actions);
		newItem.querySelector("#featName").innerHTML = `
			${feat[0]}<img src="/static/icons/actions/${actionIcon}" class="img-fluid" style="max-width: 20px; margin-left:1rem;">
		`;
		newItem.querySelector("#featType").textContent = feat[1];

		  return newItem;
	}
	  

	function setupTabs(container) {
		const tabButtons = container.querySelectorAll('.button-tab');
		const tabContents = container.querySelectorAll('.tab-content');
	  
		tabButtons.forEach(button => {
		  button.addEventListener('click', () => {
			const tabId = button.dataset.tab;
	  
			// Скрыть все табы внутри контейнера
			tabContents.forEach(content => {
			  content.style.display = 'none';
			});
	  
			// Показать выбранный таб
			const selectedTab = container.querySelector(`#${tabId}`);
			if (selectedTab) {
			  selectedTab.style.display = 'block';
			}
	  
			// Сбросить состояния кнопок
			tabButtons.forEach(btn => {
			  btn.classList.add('inactive');
			});
	  
			// Активировать текущую кнопку
			button.classList.remove('inactive');
		  });
		});
	  
		// При инициализации активируем первую кнопку, если есть
		if (tabButtons.length > 0) {
		  tabButtons[0].click();
		}
	  }

	function renderCasterSpells(clone, spellCaster, spellDc) {
		const tabButtonsContainer = clone.querySelector("#tabButtons");
		const tabContentsContainer = clone.querySelector("#tab-contents");
		const tabSpellsTemplate = clone.querySelector("#tabSpellsCategory");
	  
		if (!tabButtonsContainer || !tabContentsContainer || !tabSpellsTemplate) {
		  console.warn("One or more required elements not found in clone");
		  return;
		}
	  
		const safeName = spellCaster.name.replace(/\s+/g, "_"); 

		// 1. Создаём кнопку
		const button = document.createElement("button");
		button.classList.add("button-tab", "inactive");
		const tabId = `tabCaster_${safeName}`;
		button.dataset.tab = tabId;
		button.textContent = spellCaster.name;
		tabButtonsContainer.appendChild(button);
	  
		// 2. Создаём вкладку
		const casterTab = document.createElement("div");
		casterTab.id = `tabCaster_${safeName}`;
		casterTab.classList.add("tab-content");
		casterTab.style.display = "none";
		tabContentsContainer.appendChild(casterTab);
	  
		// DC for spell/attack
		const spellDcBlock = tabSpellsTemplate.content.cloneNode(true);
		const ul = spellDcBlock.querySelector("ul.list-group");
		const li = document.createElement("li");
		li.classList.add("text-info", "font-weight-bold", "list-group-item");
		li.innerHTML = `Spell attack: + ${spellDc} <span class="icon-prof ${getSkillProficiency(spellCaster.proficiency)}"></span>`;
		ul?.appendChild(li);
		casterTab.appendChild(spellDcBlock);

		// 3. Для каждого уровня создаём блок
		spellCaster.spells.forEach(spellLevelData => {
			const newLevelBlock = tabSpellsTemplate.content.cloneNode(true);
			// Правим Level X на реальный уровень
			const levelDiv = newLevelBlock.querySelector(".cast-level");
			if (levelDiv) {
			  levelDiv.textContent = `Level ${spellLevelData.spellLevel}`;
			}
		
			// Удаляем пустой образец <li>
			const ul = newLevelBlock.querySelector("ul.list-group");
		
			// Добавляем заклинания
			if (Array.isArray(spellLevelData.list)) {
			  spellLevelData.list.forEach(spellName => {
				const li = document.createElement("li");
				li.classList.add("list-group-item", "d-flex", "flex-row", "justify-content-between", "spell-entry");
		
				const spellNameDiv = document.createElement("div");
				spellNameDiv.classList.add("text-info", "font-weight-bold", "spell-name");
				spellNameDiv.textContent = spellName;
		
				li.appendChild(spellNameDiv);
				ul?.appendChild(li);
			  });
			}
		
			// Кладём уровень внутрь вкладки кастера
			casterTab.appendChild(newLevelBlock);
		});
	  }
	  