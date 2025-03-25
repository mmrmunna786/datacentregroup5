let energyNeeded;

window.onload = function () {
  let gameState = {
    currentLocation: null,
    step: 0,
  };

  // CO2 Emissions Factors (grams CO2 per kWh)
  const carbonIntensity = {
    geothermal: 45, // gCO₂/kWh
    nuclear: 12, // gCO₂/kWh
    hydroelectric: 4, // gCO₂/kWh
    solar: 48, // gCO₂/kWh
    wind: 11, // gCO₂/kWh
    fossil_fuels: 820, // gCO₂/kWh (coal, oil, gas)
  };

  // Country Data
  const locationInfo = {
    iceland: {
      name: "Iceland",
      intro:
        "Iceland has abundant renewable energy resources, mainly geothermal and hydroelectric power, making it an ideal location for sustainable data centers.",
      has_geothermal: 1,
      geothermal_cost: 0.05, // Per kWh
      has_nuclear: 0,
      nuclear_cost: 0, // Per kWh
      has_hydroelectric: 1,
      hydroelectric_cost: 0.05, // Per kWh
      solar_pot: 700, // Kwh per meter squared per year
      solar_cost: 350, // per meter squared
      wind_pot: 35000000, // KWh per km squared per year
      wind_cost: 4000000, // per km squared
      fossil_fuel_cost: 0.13,
      avgTemp: 5,
      image: "images/iceland.png",
    },
    england: {
      name: "England",
      intro:
        "England has strong infrastructure and connectivity, but energy costs and sustainability may be challenges for data centers.",
      has_geothermal: 0,
      geothermal_cost: 0,
      has_nuclear: 1,
      nuclear_cost: 0.13,
      has_hydroelectric: 1,
      hydroelectric_cost: 0.14,
      solar_pot: 1000,
      solar_cost: 275,
      wind_pot: 12000000,
      wind_cost: 4000000,
      fossil_fuel_cost: 0.075,
      avgTemp: 10,
      image: "images/england.png",
    },
    shanghai: {
      name: "Shanghai",
      intro:
        "Shanghai has a mix of energy sources, including nuclear, hydroelectric, and some geothermal potential.",
      has_geothermal: 1,
      geothermal_cost: 0.07, // Per kWh
      has_nuclear: 1,
      nuclear_cost: 0.046,
      has_hydroelectric: 1,
      hydroelectric_cost: 0.1,
      solar_pot: 1200,
      solar_cost: 80,
      wind_pot: 30000000,
      wind_cost: 2500000,
      fossil_fuel_cost: 0.03,
      avgTemp: 18,
      image: "images/shanghai.png",
    },
    australia: {
      name: "Australia",
      intro:
        "Australia has vast solar and wind energy potential, making it suitable for renewable energy projects.",
      has_geothermal: 0,
      geothermal_cost: 0,
      has_nuclear: 0,
      nuclear_cost: 0,
      has_hydroelectric: 1,
      hydroelectric_cost: 0.1,
      solar_pot: 2000,
      solar_cost: 275,
      wind_pot: 25000000,
      wind_cost: 4000000,
      fossil_fuel_cost: 0.17,
      avgTemp: 22,
      image: "images/australia.png",
    },
    colorado: {
      name: "Colorado",
      intro:
        "Colorado has access to a range of energy sources, including geothermal and nuclear power.",
      has_geothermal: 1,
      geothermal_cost: 0.07, // Per kWh
      has_nuclear: 0,
      nuclear_cost: 0,
      has_hydroelectric: 1,
      hydroelectric_cost: 0.1,
      solar_pot: 1800,
      solar_cost: 58.76,
      wind_pot: 30000000,
      wind_cost: 2000000,
      fossil_fuel_cost: 0.039,
      avgTemp: 6,
      image: "images/colorado.png",
    },
    argentina: {
      name: "Argentina",
      intro:
        "Argentina has a strong energy mix, with nuclear and hydroelectric power playing a significant role.",
      has_geothermal: 0,
      geothermal_cost: 0,
      has_nuclear: 1,
      nuclear_cost: 0.047,
      has_hydroelectric: 1,
      hydroelectric_cost: 0.1,
      solar_pot: 1700,
      solar_cost: 140.38,
      wind_pot: 35000000,
      wind_cost: 1000000,
      fossil_fuel_cost: 0.069,
      avgTemp: 21,
      image: "images/argentina.png",
    },
    south_india: {
      name: "South India",
      intro:
        "South India has a mix of renewable energy sources, including hydroelectric and some geothermal potential.",
      has_geothermal: 1,
      geothermal_cost: 0.08, // Per kWh
      has_nuclear: 1,
      nuclear_cost: 0.054,
      has_hydroelectric: 1,
      hydroelectric_cost: 0.1,
      solar_pot: 1900,
      solar_cost: 145,
      wind_pot: 20000000,
      wind_cost: 2500000,
      fossil_fuel_cost: 0.034,
      avgTemp: 26,
      image: "images/india.png",
    },
    central_africa: {
      name: "Central Africa",
      intro:
        "Central Africa has strong solar and hydroelectric energy potential but lacks nuclear and geothermal options.",
      has_geothermal: 0,
      geothermal_cost: 0,
      has_nuclear: 0,
      nuclear_cost: 0,
      has_hydroelectric: 1,
      hydroelectric_cost: 0.1,
      solar_pot: 2100,
      solar_cost: 1000,
      wind_pot: 10000000,
      wind_cost: 1500000,
      fossil_fuel_cost: 0.3,
      avgTemp: 23,
      image: "images/central_africa.png",
    },
  };

  // country_options is a field input defined in the main page html
  document
    .getElementById("country_options")
    .addEventListener("change", function () {
      // 'this' is the value the selector returns
      // game state is a small object made above, can hold current location and a game state
      gameState.currentLocation = selectedLocation;
      gameState.step = 1;

      //   confusingly the rest of the game loads and the intro box is set up and run
      //   at the bottom.
    });

  // DISPLAY the above created content in the same box
  // Takes the html defined just above and calls it content
  // updates the box with it's html
  function displayInfo(content) {
    let initial_box = document.getElementById("initial-box");

    // clear all the old data if a new selection is made above
    document
      .querySelectorAll("#location-info, #results-section")
      .forEach((el) => el.remove());

    // if it wasn't found, create it
    if (!initial_box) {
      initial_box = document.createElement("div");
      initial_box.id = "location-info";
      initial_box.className = "info-box fade-in";
      document.getElementById("game-container").appendChild(initial_box);
    } else {
      const infoBox = document.getElementById("initial-box");
      infoBox.innerHTML = content;
      infoBox.classList.add("fade-in");
    }
  }

  // This runs when the previous stage's button is clicked, and populates the next box
  window.showLocationOptions = function (location) {
    // save the user location choice as selected location
    // use the location passed to locate the locationInfo
    const selectedLocation = locationInfo[location];
    // Try find an element called location-info
    let section1 = document.getElementById("location-info");
    // if it wasn't found, create it
    if (!section1) {
      section1 = document.createElement("div");
      section1.id = "location-info";
      section1.className = "info-box fade-in";
      document.getElementById("game-container").appendChild(section1);
    }

    // change section 1's html
    // With logic to evaluate the bools for energy types availability
    section1.innerHTML = `
        <h2>Energy data for ${selectedLocation.name}</h2>
        <p>${
          selectedLocation.has_geothermal
            ? "Geothermal: Available"
            : "Geothermal: Unavailable"
        }</p>
        <p>${
          selectedLocation.has_nuclear
            ? "Nuclear: Available"
            : "Nuclear: Unavailable"
        }</p>
        <p>${
          selectedLocation.has_hydroelectric
            ? "Hydroelectric: Available"
            : "Hydroelectric: Unavailable"
        }</p>
        <p>Solar Potential = ${
          selectedLocation.solar_pot
        } KWh per m² per year</p>
        <p>Wind Potential = ${
          selectedLocation.wind_pot
        } KWh per Km² per year</p>

        <div>
            <label for="size_selector">Pick Datacentre Size in GWh:</label>
            <select id="size_selector">
        <option value="" disabled selected>Please select</option>
        <option value="Small">Small (2 GWh)</option>
        <option value="Medium">Medium (30GWh)</option>
        <option value="Large">Large (100GWh)</option>
        <option value="Mega">Mega (800GWh)</option>

      </select>
    </div>
    `;

    // Attach an event listener to detect size selection, once selected update variables and move on
    document
      .getElementById("size_selector")
      .addEventListener("change", function () {
        gameState.datacentreSize = this.value;
        if (gameState.datacentreSize === "Small") energyNeeded = 2;
        else if (gameState.datacentreSize === "Medium") energyNeeded = 30;
        else if (gameState.datacentreSize === "Mega") energyNeeded = 800;
        else energyNeeded = 100; // Default to Large
        choosePower(location);
      });

    // DISPLAY via append, the above created HTML in the created section1 box
    document.getElementById("game-container").appendChild(section1);
    setTimeout(() => {
      section1.scrollIntoView({ behavior: "smooth" });
    }, 100); // Small delay to ensure the browser registers the new element
  };

  // This runs when the previous stage's button is clicked
  // We can create inconsistency here by going back and rechoosing the base country - fix

  window.choosePower = function (location) {
    // define the next boxes content
    const data = locationInfo[location];
    let section2 = document.getElementById("power-box");
    if (!section2) {
      section2 = document.createElement("div");
      section2.id = "power-box";
      section2.className = "info-box fade-in";
      document.getElementById("game-container").appendChild(section2);
    }

    // populate section 2 with sources that are available to all locations
    section2.innerHTML = `
        <h2>Choose Power Source</h2>
        <p>Your datacentre needs ${energyNeeded} Giga-Watt hours of energy per year.</p>

        <h3>Build Renewables</h3>

        <label for="solar">Solar (GWh):</label>
        <input type="number" id="solar" min="0" placeholder="0">

        <label for="wind">Wind (GWh):</label>
        <input type="number" id="wind" min="0" placeholder="0"><br /><br />

        <h3>Purchase Energy</h3>
        `;

    // populate the rest of the options depending on energy sources availability
    let energyChoices = "";

    if (data.has_geothermal) {
      energyChoices += `<label for="geothermal">Geothermal (GWh):</label>
        <input type="number" id="geothermal" min="0" placeholder="0">`;
    }

    if (data.has_nuclear) {
      energyChoices += `<label for="nuclear">Nuclear (GWh):</label>
        <input type="number" id="nuclear" min="0" placeholder="0">`;
    }

    if (data.has_hydroelectric) {
      energyChoices += `<label for="hydroelectric">Hydroelectric (GWh):</label>
        <input type="number" id="hydroelectric" min="0" placeholder="0">`;
    }

    //add the rest of the options available to all locations
    energyChoices += `<label for="fossil_fuels">Fossil Fuels (GWh):</label>
      <input type="number" id="fossil_fuels" min="0" placeholder="0">

      <!-- Error Message Placeholder (Initially Hidden) -->
      <p id="error-message" style="color: red; display: none;"></p>

      <button class="button" onclick="validateAndFinalise('${location}')">Finalise Selection</button>
      `;
    // append the energyChoices constructed html above to the pre existing html
    section2.insertAdjacentHTML("beforeend", energyChoices);

    // DISPLAY the above created content in a new box
    document.getElementById("game-container").appendChild(section2);
    setTimeout(() => {
      section2.scrollIntoView({ behavior: "smooth" });
    }, 100); // Small delay to ensure the browser registers the new element
  };

  // DEFINE the final box that sums up all the power sources CO2
  window.validateAndFinalise = function (location) {
    // Get all energy inputs and ensure they are parsed as numbers
    // If their field doesn't exist (because the country doesnt have that option) default to 0.
    const geothermal = document.getElementById("geothermal")
      ? parseFloat(document.getElementById("geothermal").value) || 0
      : 0;
    const nuclear = document.getElementById("nuclear")
      ? parseFloat(document.getElementById("nuclear").value) || 0
      : 0;
    const hydroelectric = document.getElementById("hydroelectric")
      ? parseFloat(document.getElementById("hydroelectric").value) || 0
      : 0;
    const solar = document.getElementById("solar")
      ? parseFloat(document.getElementById("solar").value) || 0
      : 0;
    const wind = document.getElementById("wind")
      ? parseFloat(document.getElementById("wind").value) || 0
      : 0;
    const fossil_fuels = document.getElementById("fossil_fuels")
      ? parseFloat(document.getElementById("fossil_fuels").value) || 0
      : 0;
    // Calculate total GWh
    const totalGWh =
      geothermal + nuclear + hydroelectric + solar + wind + fossil_fuels;

    // Get the error message empty element created above
    const errorMessage = document.getElementById("error-message");
    if (totalGWh > energyNeeded) {
      // Show error message if total is over energyNeeded GWh
      errorMessage.textContent = `⚠️ Too much energy! You have allocated ${totalGWh} GWh. Reduce to ${energyNeeded} GWh.`;
      errorMessage.style.display = "block";
    } else if (totalGWh < energyNeeded) {
      // Show error message if total is under energyNeeded GWh
      errorMessage.textContent = `⚠️ Too little energy! You have allocated ${totalGWh} GWh. Increase to ${energyNeeded} GWh.`;
      errorMessage.style.display = "block";
    } else {
      // if valid
      // Hide error message
      errorMessage.style.display = "none";
      // and proceed to finalise the game and calculate carbon footprint
      finaliseGame(location, {
        geothermal,
        nuclear,
        hydroelectric,
        solar,
        wind,
        fossil_fuels,
      });
    }
  };

  // Energy mix is the list ov vals the user chose for their energy
  window.finaliseGame = function (location, energyMix) {
    let totalCarbon = 0;
    let nonRenewablesCarbon = 0;
    let renewablesCarbon = 0;
    let firstYearCostTot = 0;
    let yearlyCostTot = 0;
    let solarArea = 0;
    let windArea = 0;
    let solarCost = 0;
    let windCost = 0;

    // grab the costs from the loaction data to use in the loop
    let selectedLocation = locationInfo[location];
    let energyCostPerTypeKWh = {
      geothermal: selectedLocation.geothermal_cost || 0,
      nuclear: selectedLocation.nuclear_cost || 0,
      hydroelectric: selectedLocation.hydroelectric_cost || 0,
      solar: selectedLocation.solar_cost || 0,
      wind: selectedLocation.wind_cost || 0,
      fossil_fuels: selectedLocation.fossil_fuel_cost || 0,
    };

    // Iterate over each energy source in the user's selection
    for (const i in energyMix) {
      //first calculate total energy mix
      const energyAmountGWh = energyMix[i]; // Value in GWh
      const energyAmountKWh = energyAmountGWh * 1e6;
      const intensity = carbonIntensity[i]; // gCO₂/kWh

      // solar and wind based on area of renewable built
      // solar area and wind area is area NEEDED for the amount of power requested
      if (i === "solar") {
        solarArea = energyAmountKWh / selectedLocation.solar_pot;
        solarCost = solarArea * selectedLocation.solar_cost;
        firstYearCostTot += solarArea * selectedLocation.solar_cost;
        renewablesCarbon += energyAmountKWh * intensity;
      } else if (i === "wind") {
        windArea = energyAmountKWh / selectedLocation.wind_pot;
        windCost = windArea * selectedLocation.wind_cost;
        firstYearCostTot += windArea * selectedLocation.wind_cost;
        renewablesCarbon += energyAmountKWh * intensity;
      } else {
        firstYearCostTot += energyAmountKWh * energyCostPerTypeKWh[i];
        nonRenewablesCarbon += energyAmountKWh * intensity;
      }
    }

    yearlyCostTot = firstYearCostTot - solarCost - windCost;
    // Convert gCO2 to metric tons (divide by 1,000,000)

    renewablesCarbon = renewablesCarbon / 1e6;
    nonRenewablesCarbon = nonRenewablesCarbon / 1e6;

    // Create a new section for results
    let resultsSection = document.getElementById("results-section");
    if (!resultsSection) {
      resultsSection = document.createElement("div");
      resultsSection.id = "results-section";
      resultsSection.className = "info-box fade-in";
      document.getElementById("game-container").appendChild(resultsSection);
    }

    resultsSection.innerHTML = `
    <h2>Final Emission Calculation</h2>
  `;

    if (solarArea === 0 && windArea === 0) {
      resultsSection.innerHTML = `<p>Your datacentre's yearly CO₂ emissions: <strong>${nonRenewablesCarbon.toFixed(
        2
      )} metric tons</strong> per year.</p>
                                    <p>Your datacentre's rolling yearly energy cost: <strong>£${Number(
                                      firstYearCostTot.toFixed(0)
                                    ).toLocaleString()} </strong></p>`;
    } else {
      if (solarArea !== 0) {
        resultsSection.innerHTML += `<p>Your datacentre would build <strong>${Number(
          solarArea.toFixed(0)
        ).toLocaleString()} </strong> m<sup>2</sup> of solar farm.</p>`;
      }

      if (windArea !== 0) {
        resultsSection.innerHTML += `<p>Your datacentre would build <strong>${Number(
          windArea.toFixed(0)
        ).toLocaleString()} </strong>km<sup>2</sup> of wind farms.</p>`;
      }

      resultsSection.innerHTML += `<p>Your datacentre's cost for building renewables is: <strong>£${Number(
        firstYearCostTot.toFixed(0)
      ).toLocaleString()} </strong></p>
                                    <p>After building renewables in the 1st year your rolling energy costs would be: <strong>£${Number(
                                      yearlyCostTot.toFixed(0)
                                    ).toLocaleString()}</strong></p>
                                    <p>Your datacentre's initial CO₂ emissions: <strong>${renewablesCarbon.toFixed(
                                      2
                                    )} metric tons</strong>.</p>
                                    <p>Your datacentre's yearly CO₂ emissions: <strong>${nonRenewablesCarbon.toFixed(
                                      2
                                    )} metric tons</strong>.</p>`;
    }

    resultsSection.innerHTML += `<button class="button" onclick="restartGame()">Restart Game</button>`;

    // Append the new results to the game container
    document.getElementById("game-container").appendChild(resultsSection);

    // Scroll smoothly to the new section
    setTimeout(() => {
      resultsSection.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Start Restart the game
  window.restartGame = function () {
    gameState.currentLocation = null;
    gameState.step = 0;
    // Reset dropdown to default option
    document.getElementById("country_options").selectedIndex = 0;

    // reset the main game container div back to the default.
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = `
      <div id="location-selection">
        <label for="country_options">Which Location:</label>
        <select id="country_options">
          <option value="" disabled selected>Please select</option>
          <option value="iceland">Iceland</option>
          <option value="england">England</option>
          <option value="shanghai">Shanghai</option>
          <option value="australia">Australia</option>
          <option value="colorado">Colorado</option>
          <option value="argentina">Argentina</option>
          <option value="south_india">South India</option>
          <option value="central_africa">Central Africa</option>
        </select>
      </div>
      <div id="initial-box" class="info-box"></div>
    `;

    // add back event listener for dropdown (as the above removes it)
    document
      .getElementById("country_options")
      .addEventListener("change", function () {
        const selectedLocation = this.value;
        gameState.currentLocation = selectedLocation;
        gameState.step = 1;
        displayInfo(`
        <h2>${locationInfo[selectedLocation].name}</h2>
        <img src="${locationInfo[selectedLocation].image}" alt="${selectedLocation}_picture" style="width:100%; border-radius: 10px;">
        <p>${locationInfo[selectedLocation].intro}</p>
        <p>Average Yearly Temperature: ${locationInfo[selectedLocation].avgTemp}&deg C</p>
        <button class="button" onclick="showLocationOptions('${selectedLocation}')">Continue</button>
      `);
      });

    // need this herre to be able to reset it at the end of a game
    displayInfo(`
        <h2>Datacentre Designer</h2>
        <p>Select a location to start designing your data center.</p>
      `);
  };
  // Start the game with the default intro
  restartGame();
};
