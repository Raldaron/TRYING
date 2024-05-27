document.addEventListener('DOMContentLoaded', () => {
    let classes = {};
    let races = {};

    const editButton = document.querySelector('.edit-button');
    const characterName = document.querySelector('.character-details h2');
    const characterDescription = document.querySelector('.character-details p');
    const addItemButton = document.getElementById('add-item-button');
    const itemSelect = document.getElementById('item-select');
    const inventoryList = document.getElementById('inventory-list');
    const meleeActions = document.getElementById('melee-actions');
    const magicActions = document.getElementById('magic-actions');
    const actionDetailsList = document.getElementById('action-details-list');
    const abilitiesList = document.getElementById('abilities-list');
    const raceSelect = document.getElementById('race-select');
    const classSelect = document.getElementById('class-select');
    const statElements = {
        strength: document.getElementById('strength'),
        dexterity: document.getElementById('dexterity'),
        stamina: document.getElementById('stamina'),
        intelligence: document.getElementById('intelligence'),
        perception: document.getElementById('perception'),
        wit: document.getElementById('wit'),
        charisma: document.getElementById('charisma'),
        manipulation: document.getElementById('manipulation'),
        appearance: document.getElementById('appearance')
    };

    const derivedStatElements = {
        hp: document.getElementById('hp'),
        mp: document.getElementById('mp'),
        ar: document.getElementById('ar'),
        statPoints: document.getElementById('stat-points'),
        skillPoints: document.getElementById('skill-points')
    };

    const skillElements = {
        insight: document.getElementById('insight'),
        performance: document.getElementById('performance'),
        intimidation: document.getElementById('intimidation'),
        leadership: document.getElementById('leadership'),
        persuasion: document.getElementById('persuasion'),
        senseDeception: document.getElementById('sense-deception'),
        streetwise: document.getElementById('streetwise'),
        melee: document.getElementById('melee'),
        pugilism: document.getElementById('pugilism'),
        sleightOfHand: document.getElementById('sleight-of-hand'),
        stealth: document.getElementById('stealth'),
        athletics: document.getElementById('athletics'),
        dodge: document.getElementById('dodge'),
        ride: document.getElementById('ride'),
        parry: document.getElementById('parry'),
        archery: document.getElementById('archery'),
        firearms: document.getElementById('firearms'),
        awareness: document.getElementById('awareness'),
        search: document.getElementById('search'),
        animalKen: document.getElementById('animal-ken'),
        survival: document.getElementById('survival'),
        scrounging: document.getElementById('scrounging'),
        crafting: document.getElementById('crafting'),
        repair: document.getElementById('repair'),
        sapper: document.getElementById('sapper'),
        nerdLore: document.getElementById('nerd-lore'),
        medicine: document.getElementById('medicine'),
        technology: document.getElementById('technology'),
        disguise: document.getElementById('disguise'),
        escapeArtistry: document.getElementById('escape-artistry'),
        vehicleOperation: document.getElementById('vehicle-operation')
    };

    let currentClass = null;
    let currentRace = null;
    const skillBaseValues = {};

    // Initialize skillBaseValues with base values
    for (const skill in skillElements) {
        skillBaseValues[skill] = parseInt(skillElements[skill].value);
    }

    // Fetch classes and races data from JSON files
    Promise.all([
        fetch('classes.json').then(response => response.json()).then(data => classes = data).catch(error => console.error('Error loading classes:', error)),
        fetch('races.json').then(response => response.json()).then(data => races = data).catch(error => console.error('Error loading races:', error))
    ]).then(() => {
        // Populate class dropdown
        for (const className in classes) {
            const option = document.createElement('option');
            option.value = className;
            option.textContent = className.charAt(0).toUpperCase() + className.slice(1);
            classSelect.appendChild(option);
        }

        // Populate race dropdown
        for (const raceName in races) {
            const option = document.createElement('option');
            option.value = raceName;
            option.textContent = raceName.charAt(0).toUpperCase() + raceName.slice(1);
            raceSelect.appendChild(option);
        }
    });

    classSelect.addEventListener('change', () => {
        const selectedClass = classSelect.value;
        if (selectedClass) {
            const classData = classes[selectedClass];
            resetStatsAndAbilities();
            applyBuffs(classData.buff);
            displayAbilities(classData.abilities);
            currentClass = selectedClass;
        }
    });

    raceSelect.addEventListener('change', () => {
        const selectedRace = raceSelect.value;
        if (selectedRace) {
            const raceData = races[selectedRace];
            resetStatsAndAbilities();
            applyBuffs(raceData.buff);
            displayAbilities(raceData.abilities);
            currentRace = selectedRace;
        }
    });

    function resetStatsAndAbilities() {
        if (currentClass) {
            const classData = classes[currentClass];
            // Reset buffs
            for (const stat in classData.buff) {
                statElements[stat].value = parseInt(statElements[stat].value) - classData.buff[stat];
            }
            // Clear abilities
            abilitiesList.innerHTML = '';
        }
        if (currentRace) {
            const raceData = races[currentRace];
            // Reset buffs
            for (const stat in raceData.buff) {
                statElements[stat].value = parseInt(statElements[stat].value) - raceData.buff[stat];
            }
            // Clear abilities
            abilitiesList.innerHTML = '';
        }
        // Update derived stats after reset
        updateDerivedStats();
    }

    function applyBuffs(buff) {
        for (const stat in buff) {
            statElements[stat].value = parseInt(statElements[stat].value) + buff[stat];
        }
    }

    function displayAbilities(abilities) {
        abilitiesList.innerHTML = '';
        abilities.forEach(ability => {
            const abilityDiv = document.createElement('div');
            abilityDiv.className = 'ability';
            abilityDiv.innerHTML = `
                <div class="ability-inner">
                    <div class="ability-front">
                        <h4>${ability.name}</h4>
                    </div>
                    <div class="ability-back">
                        <h4>${ability.name}</h4>
                        <p>${ability.description}</p>
                        <p><strong>Effect:</strong> ${ability.effect}</p>
                        <p><strong>Ability Point Cost:</strong> ${ability.cost}</p>
                        <p><strong>Cooldown:</strong> ${ability.cooldown}</p>
                    </div>
                </div>
            `;
            abilitiesList.appendChild(abilityDiv);

            // Add flip and expand effect
            abilityDiv.addEventListener('click', () => {
                abilityDiv.classList.toggle('flipped');
                abilityDiv.classList.toggle('expanded');
            });
        });
    }

    editButton.addEventListener('click', () => {
        const newName = prompt('Enter new character name:', characterName.textContent);
        if (newName !== null && newName.trim() !== '') {
            characterName.textContent = newName;
        }
        
        const newDescription = prompt('Enter new character description:', characterDescription.textContent);
        if (newDescription !== null && newDescription.trim() !== '') {
            characterDescription.textContent = newDescription;
        }
    });

    addItemButton.addEventListener('click', () => {
        const selectedItemName = itemSelect.value;
        const selectedItem = items.find(item => item.name.toLowerCase() === selectedItemName);

        if (selectedItem) {
            // Add item to inventory
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            itemDiv.textContent = selectedItem.name;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.className = 'remove-item-button';
            itemDiv.appendChild(removeButton);
            inventoryList.appendChild(itemDiv);

            // Update stats
            for (const [stat, value] of Object.entries(selectedItem.effects)) {
                const statInput = document.getElementById(stat);
                statInput.value = parseInt(statInput.value) + value;
            }

            // Add granted actions
            for (const [category, actions] of Object.entries(selectedItem.actions)) {
                actions.forEach(action => {
                    const actionDiv = document.createElement('div');
                    actionDiv.className = 'action';
                    actionDiv.textContent = action;
                    if (category === 'melee') {
                        meleeActions.appendChild(actionDiv);
                    } else if (category === 'magic') {
                        magicActions.appendChild(actionDiv);
                    }

                    // Display action details
                    const actionDetailDiv = document.createElement('div');
                    actionDetailDiv.className = 'action-detail';
                    actionDetailDiv.textContent = `${action}: ${selectedItem.actionDetails[action].description}`;
                    actionDetailsList.appendChild(actionDetailDiv);
                });
            }

            // Remove item event
            removeButton.addEventListener('click', () => {
                // Remove stats
                for (const [stat, value] of Object.entries(selectedItem.effects)) {
                    const statInput = document.getElementById(stat);
                    statInput.value = parseInt(statInput.value) - value;
                }

                // Remove granted actions
                for (const [category, actions] of Object.entries(selectedItem.actions)) {
                    actions.forEach(action => {
                        const actionDivs = (category === 'melee' ? meleeActions : magicActions).querySelectorAll('.action');
                        actionDivs.forEach(actionDiv => {
                            if (actionDiv.textContent === action) {
                                actionDiv.remove();
                            }
                        });

                        // Remove action details
                        const actionDetailDivs = actionDetailsList.querySelectorAll('.action-detail');
                        actionDetailDivs.forEach(actionDetailDiv => {
                            if (actionDetailDiv.textContent.startsWith(action)) {
                                actionDetailDiv.remove();
                            }
                        });
                    });
                }

                // Remove item from inventory
                itemDiv.remove();
            });
        }
    });

    // Initial update of derived stats
    updateDerivedStats();
    updateLevel();

    function updateDerivedStats() {
        derivedStatElements.hp.value = (parseInt(statElements.stamina.value) * 5) + 10;
        derivedStatElements.mp.value = (parseInt(statElements.intelligence.value) * 5) + 10;
        derivedStatElements.ar.value = calculateArmorRating();
    }

    function calculateArmorRating() {
        const baseAR = 0; // Replace with actual base armor rating logic
        const dexterityModifier = parseInt(statElements.dexterity.value);
        const otherModifiers = 0; // Replace with actual logic for other modifiers
        return baseAR + dexterityModifier + otherModifiers;
    }

    statElements.stamina.addEventListener('input', () => {
        updateDerivedStats();
        distributeStatPoints();
    });
    statElements.intelligence.addEventListener('input', () => {
        updateDerivedStats();
        distributeStatPoints();
    });
    statElements.dexterity.addEventListener('input', distributeStatPoints);

    function updateLevel() {
        const level = parseInt(document.getElementById('level').value);
        const statPoints = (level - 1) * 2;
        let skillPoints = 0;

        if (level <= 5) {
            skillPoints = (level - 1) * 6;
        } else if (level <= 10) {
            skillPoints = (5 * 6) + ((level - 5) * 8);
        } else if (level <= 15) {
            skillPoints = (5 * 6) + (5 * 8) + ((level - 10) * 10);
        } else if (level <= 20) {
            skillPoints = (5 * 6) + (5 * 8) + (5 * 10) + ((level - 15) * 12);
        } else {
            skillPoints = (5 * 6) + (5 * 8) + (5 * 10) + (5 * 12) + ((level - 20) * 14);
        }

        derivedStatElements.statPoints.value = statPoints;
        derivedStatElements.skillPoints.value = skillPoints - calculateTotalSkillCost();
        distributeSkillPoints();
    }

    function distributeStatPoints() {
        let totalStatPoints = parseInt(derivedStatElements.statPoints.value);
        for (const stat in statElements) {
            const baseValue = 10; // Replace with the actual base value if different
            const currentValue = parseInt(statElements[stat].value);
            totalStatPoints -= (currentValue - baseValue);
        }
        derivedStatElements.statPoints.value = totalStatPoints >= 0 ? totalStatPoints : 0;
    }

    function distributeSkillPoints() {
        let totalSkillPoints = parseInt(derivedStatElements.skillPoints.value);
        let spentPoints = 0;
        document.querySelectorAll('.skills-container input').forEach(input => {
            const baseValue = 1;
            const currentValue = parseInt(input.value);
            const skillCost = calculateSkillCost(baseValue, currentValue);
            spentPoints += skillCost;
        });
        derivedStatElements.skillPoints.value = totalSkillPoints - spentPoints;
    }

    function calculateSkillCost(fromLevel, toLevel) {
        let cost = 0;
        for (let i = fromLevel + 1; i <= toLevel; i++) {
            cost += i;
        }
        return cost;
    }

    function calculateTotalSkillCost() {
        let totalCost = 0;
        for (const skill in skillElements) {
            const baseValue = skillBaseValues[skill];
            const currentValue = parseInt(skillElements[skill].value);
            totalCost += calculateSkillCost(baseValue, currentValue);
        }
        return totalCost;
    }

    document.getElementById('level').addEventListener('input', updateLevel);
    document.querySelectorAll('.skills-container input').forEach(input => {
        input.addEventListener('input', distributeSkillPoints);
    });
});

// Function to simulate rolling dice
function rollDice(numDice, numSides) {
    let total = 0;
    for (let i = 0; i < numDice; i++) {
        total += Math.floor(Math.random() * numSides) + 1;
    }
    return total;
}

// Example usage of an action
function useAction(item, actionName, target) {
    const action = item.actionDetails[actionName];
    if (action && action.effect) {
        console.log(action.effect(target));
    }
}

// Example target
const exampleTarget = { name: 'Goblin', hp: 10 };

// Example of using an action
useAction(items[0], 'Slash', exampleTarget);
