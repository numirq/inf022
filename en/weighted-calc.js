/*  CONSOLE LOGS ARE USED TO DEBUG AND OR TO VIEW THE RESULT | CALCULATIONS  */
const submitButton = document.getElementById("weights-submit-button");
const resultText = document.getElementById("result"); 
const configurationsDropdown = document.getElementById('configurations');
let weightsInput = document.getElementById("weights-input").value;
let weightsArray = []; // array for weights
let gradesArray = []; //  array for grades
let autoSaveToggle = true;
let weightsInputChange = false;

if(submitButton){ //  Checking if submitButton is null, continues if not null.
submitButton.addEventListener("click", function() { //  submitButton click event and its function
  console.log("SUBMIT BUTTON CLICKED")
  try {
    [weightsArray, gradesArray, weightsInput, weights] = TryLoadingData();
  } catch (error) {
    console.log("Error: "+error)
  }


  if(weightsInput == '' || weightsInput == ','){ //  Checking for change in weights
    console.log("INFO: Weights unchanged or new")
    weightsInput = document.getElementById("weights-input").value;
    console.log("DEBUG: "+weightsInput)
  }else{
    weightsInputChange = true;
    AutoSave(autoSaveToggle, weightsArray, gradesArray, weightsInput, weightsInputChange);
    console.log("INFO: Weights updated and added")
    console.log("DEBUG before: "+weightsInput)
    if(configurationsDropdown.value == "None" || configurationsDropdown == "New"){
      weightsInput += ","+document.getElementById("weights-input").value;
      console.log("DEBUG after: "+weightsInput)
    }
    weightsInputChange = false
  }

  let output = document.getElementById("output");
  let weights = weightsInput.split(",");

  if(weightsArray == [] && gradesArray == []){
    console.log("INFO: Weights & Grades array first declaration")
    weightsArray = []; // array for weights
    gradesArray = []; //  array for grades
  }else{
    console.log("INFO: The weights & grades array already have value")
  }

  for (let i = 0; i < weights.length; i++) {
    const weight = weights[i];
    console.log("PENDING: Checking for existing weights")    
    const divExists = document.getElementById(`grades${weight}`); 
    if(divExists){ // Checks if element 'exists' (Checks for null) If null -> continue and create element | if exists -> check other weights (if its the last weight it ends loop)
        console.log("DEBUG: The weight with id: ",divExists,"exists")
        continue; 
    }

    //  This code dynamically creates and adds new "grades containers" to a web page based on an array of weights.
    console.log("INFO: Starting weight creation process")
    const newDiv = document.createElement("div");  
    const newHeader = document.createElement("div");
    const newContent = document.createTextNode("Weight "+weights[i]); 
    newDiv.id = 'grades' + weights[i];
    newDiv.className = 'p-8 pb-4 gap-2 rounded-2xl m-2 bg-gray-100 dark:bg-gray-800 flex flex-col items-center animate-fade-up' //for customization.
    newHeader.className = 'grades-weight-text'
    newHeader.appendChild(newContent);
    newDiv.appendChild(newHeader);
    output.appendChild(newDiv);

    //  Creates input elements for grades
    const gradeInput = document.createElement("input");
    gradeInput.className = "p-4 rounded-2xl dark:bg-gray-700 bg-gray-200"
    gradeInput.placeholder = "Your grade"
    gradeInput.type = "number";
    gradeInput.min = 0;
    gradeInput.max = Infinity; //Increase later
    gradeInput.id = `grade${weight}`;
    newDiv.appendChild(gradeInput);

    // Creates a button for submiting a grade. 
    const gradeSubmitButton = document.createElement("button");
    const buttonText = document.createTextNode("Submit Grade");
    gradeSubmitButton.appendChild(buttonText);
    gradeSubmitButton.className = "p-4 rounded-2xl bg-amber-600 hover:animate-jump";
    gradeSubmitButton.addEventListener("click", function() {
      
    const grade = document.getElementById(`grade${weight}`).value;
    console.log(`DEBUG: Processing weight ${weight} with grade ${grade}`);
    weightsArray.push(weight)
    gradesArray.push(grade)
    gradeInput.value = "" //  clears the input field
    

    // Adds a list containing grades submited before
    const newGradesUnorderedList = document.createElement("ul")
    newGradesUnorderedList.id = `gradesList-${weight}`
    newGradesUnorderedList.className = "grades-list"
    const newGradesList = document.createElement("li")
    newGradesList.textContent = grade + ","+"\xa0\xa0";       

    newGradesList.addEventListener("click", function() {
        //  Removes grade and weight from arrays and recalculates the WeightedAverage
        const parentList = this.parentNode; 
        let parentID = parentList.id
        const listNumber = parentID.replace("gradesList-", "");
        console.log("INFO: TRYING TO DELETE GRADE")
        console.log("DEBUG: ListNumber " + listNumber)
        console.log("DEBUG: grade " + grade)
        console.log("DEBUG: gradesArray " + gradesArray)
        console.log("DEBUG: weightsArray " + weightsArray)
        deleteGrade(gradesArray, weightsArray, grade, listNumber);
        console.log("INFO: GRADE DELETED")
        console.log("DEBUG: ListNumber " + listNumber)
        console.log("DEBUG: grade " + grade)
        console.log("DEBUG: gradesArray " + gradesArray)
        console.log("DEBUG: weightsArray " + weightsArray)
        parentList.removeChild(this); //  removes the li containing the grade we deleted
        const weightedAverage = calculateWeightedAverage(gradesArray, weightsArray);
        console.log("INFO: New Weighted Average: " + weightedAverage);
      });

      AutoSave(autoSaveToggle, weightsArray, gradesArray, weightsInput, false); //trying to save data
      
    const listExists = document.getElementById(`gradesList-${weight}`);
    if(listExists){
        console.log("DEBUG: Weight unordered list(UL) exists, appending new grade...")
        listExists.append(newGradesList)
    }else{
        console.log("DEBUG: Weight unordered list(UL) does not exist, adding it...")
        newDiv.appendChild(newGradesUnorderedList)
        newGradesUnorderedList.append(newGradesList)
        console.log("DEBUG: Weight unordered list(UL) added")
    }

    if (weightsArray.length > 0) {
        const weightedAverage = calculateWeightedAverage(gradesArray, weightsArray);
        console.log("INFO: Weighted Average: " + weightedAverage);
        console.log("DEBUG: grades Array "+gradesArray, "weights Array "+weightsArray)
      } else {
        console.log("ERROR|INFO: Weighted average: EMPTY" + "| Something went wrong. Are arrays empty?");
    }
      
    });
    newDiv.appendChild(gradeSubmitButton);

    console.log("INFO: Weight card creation done")

    const configurationsDropdown = document.getElementById('configurations');

  //  Saves the configs into local storage
  configurationsDropdown.addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    console.log("INFO: selectedValue" + selectedValue);
    if (selectedValue === 'New') {
      const configName = prompt('Enter a name for the new configuration:');
      if (configName) {

        const data = {
          weightsArray : weightsArray,
          gradesArray : gradesArray,
          weightsInput: weightsInput+'' //deleted+''
        }
        
        // Get the select element
        const selectElement = document.getElementById('configurations');

        // Create a new option element
        const newOption = document.createElement('option');
        newOption.value = configName; // set the value to identify the option
        newOption.text = configName; // set the text to display

        // Append the new option to the select element
        selectElement.appendChild(newOption);

        localStorage.setItem(`${configName}.data`, JSON.stringify(data));

        //  Check if everything went correct
        const savedData = JSON.parse(localStorage.getItem(configName + '.data'));

        if(savedData){
          alert('Configuration saved successfully!');
          saveOptionsMenuState()
        }
      }
      // Reset the dropdown to the default option after saving the new configuration
      configurationsDropdown.value = '';
      
    }
});
  } 
})};

//  Listens for ENTER in weight input field
document.querySelector('#weights-input').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault(); // Prevents the site to reload (default)
    submitButton.click() // Sending the submitButton click to launch their event
    const input = document.querySelector('#weights-input'); //  Getting the input field
    input.value = ''; //  Clearing the input
  }
});


function calculateWeightedAverage(gradesArray, weightsArray) {
    let weightedSum = 0;
    let weightSum = 0;

    for (let i = 0; i < gradesArray.length; i++) {
        console.log("DEBUG: Grades i: "+gradesArray[i]+"| Weigths i: "+weightsArray[i])
        console.log("DEBUG: Grades Lenght: "+gradesArray.length+"| Weights Lenght: "+weightsArray.length)
        weightedSum += parseFloat(gradesArray[i]) * parseFloat(weightsArray[i]); // Fixed issue here: This needed to be parseFloat, otherwise it's doing unwanted thing if value is big. (float is needed for precise calculations)
        weightSum += parseFloat(weightsArray[i]); //  Gets all weights, parsed string to float (needed for precise calculations)
        console.log("DEBUG: WeightedSum = " + weightedSum+"| WeightSum = "+weightSum)
    }

    if(weightSum >= 1){
      console.log(weightSum)
      console.log("INFO: Weights is bigger or equal to 1")
      resultText.innerHTML = "RESULT: "+weightedSum/weightSum //  Changing the text in div to result 
      console.log("INFO: WEIGHTED AVERAGE RESULT: ", weightedSum/weightSum)
      return weightedSum / weightSum; //  Returning result
    }else if(weightSum < 1){
      console.log(weightSum)
      console.log("INFO: Weights is NOT bigger or equal to 1")
      resultText.innerHTML = "RESULT: "+weightedSum //  Changing the text in div to result 
      console.log("INFO: WEIGHTED AVERAGE RESULT: ", weightedSum)
      return weightSum; //  Returning different results because of weightSum not adding to 1
    }
}

//  This removes a specific grade from an array if click event on that grade is launched (user clicked grade number)
function deleteGrade(gradesArray, weightsArray, grade, weight) {
  for (let i = 0; i < gradesArray.length; i++) {
    if (gradesArray[i] === grade && weightsArray[i] === weight) {
      gradesArray.splice(i, 1);
      weightsArray.splice(i, 1);
      AutoSave(autoSaveToggle, weightsArray, gradesArray, weightsInput, false);
      return; // exit the loop after deleting the first occurrence
    }
  }
}



function saveOptionsMenuState() {
  const selectElement = document.getElementById('configurations');
  const options = selectElement.innerHTML;
  localStorage.setItem('optionsMenuState', options);
}

function loadOptionsMenuState() {
  const state = localStorage.getItem('optionsMenuState');
  if (state) {
    const selectElement = document.getElementById('configurations');
    selectElement.innerHTML = state;
  }
}

window.addEventListener('load', function(e){
  loadOptionsMenuState()
});


const main = document.getElementById("html-main");

configurationsDropdown.addEventListener('change', function(e){
  const selectedValue = event.target.value;
  const savedState = localStorage.getItem(selectedValue+".data");
  const output = document.getElementById('output');

  if(selectedValue && savedState){
    console.log("DEBUG: Correctly read values")
    output.innerHTML = ''; // Clears the output so the weights and grades get updated
    resultText.innerHTML = "RESULT: ???";
    submitButton.click();
    GetGradesList();
  }else if(selectedValue == "new"){
    console.log("INFO: New config creation")
  }else{
    console.log("DEBUG: Config not found");
    location.reload();
  }
})



function AutoSave(autoSaveToggle, weightsArray, gradesArray, weightsInput, weightsInputChange){
  let configValue = configurationsDropdown.value
  const configItem = JSON.parse(localStorage.getItem(configValue+'.data'));
  console.log("WARNING: weightsInputChange", weightsInputChange)
    if(configValue != "None" && configValue != "New"){
      if(autoSaveToggle == true && weightsInputChange == false){
        configItem.weightsArray = weightsArray;
        configItem.gradesArray = gradesArray;
      
        console.log("WARNING: weightsInput", weightsInput)
        localStorage.setItem(configValue+'.data', JSON.stringify(configItem));
      }else if(weightsInputChange == true && autoSaveToggle == true){
        configItem.weightsInput = weightsInput;
        console.log("WARNING: weightsInput", weightsInput)
        localStorage.setItem(configValue+'.data', JSON.stringify(configItem));
      } 
  }else{
    console.log("ERROR: autoSaveToggle disabled or config value of default configs (New/None). Enable feature or update configuration values.");
  }
}

function TryLoadingData(weightsArray, gradesArray, weightsInput, weights) {
  let dataName = configurationsDropdown.value;
  if (dataName) {
    console.log("DEBUG: Correctly went into 1 if");
    let data = localStorage.getItem(dataName + ".data");
    if (data) {
      console.log("DEBUG: Correctly went into 2 if");
      const retrievedData = JSON.parse(data);
      weightsArray = retrievedData["weightsArray"];
      gradesArray = retrievedData["gradesArray"];
      console.log("DEBUG: weightArray = " + weightsArray + "| gradesArray = " + gradesArray);
      weightsInput = retrievedData["weightsInput"];
      console.log("DEBUG: weightsInput = ", weightsInput);
      weights = weightsInput.split(",");
      console.log("DEBUG: weights = " + weights);

      const newWeightInput = ","+document.getElementById("weights-input").value;

      console.log("DEBUG: newWeightsInput "+newWeightInput)

      if(weightsArray == [] && gradesArray == []){
        console.log("INFO: Weights && Grades Array first declaration")
        console.log("INFO: Initialization - done && Weights extracted");
        weightsArray = []; // array for weights
        gradesArray = []; //  array for grades
      }else{
        console.log("INFO: The weights && grades array already have value")
      }

      if(newWeightInput != '' && newWeightInput != ','){
        weights += newWeightInput.split(",");
        weightsInput += newWeightInput;
      }else{
        weightsArray = retrievedData["weightsArray"];
        gradesArray = retrievedData["gradesArray"];
      }

      return [weightsArray, gradesArray, weightsInput, weights];
    }else{
      return;
    }
  }
}

//gets grades from saved array if one exists and displays them
function GetGradesList() {
  let configValue = configurationsDropdown.value;
  if (configValue != "None" && configValue != "New") {
    let newGradesArray = [];
    let newWeightsArray = [];
    let data = localStorage.getItem(configValue+'.data');
    let newData = JSON.parse(data);
    newGradesArray = newData["gradesArray"];
    newWeightsArray = newData["weightsArray"];

    if (data) {
      for (let i = 0; i < newGradesArray.length; i++) {
        let newGradesUnorderedList = document.createElement("ul");
        let newGradesList = document.createElement("li");
        newGradesUnorderedList.className = "grades-list";
        newGradesList.textContent = newGradesArray[i] + ","+"\xa0\xa0";

        let parentElement = document.getElementById("grades" + newWeightsArray[i]);
        newGradesUnorderedList.id = `gradesList-${newWeightsArray[i]}`;
        let listExists = document.getElementById(`gradesList-${newWeightsArray[i]}`);

        if (parentElement === null) {
          console.log("ggl|ERROR: Parent element not found");
          break;
        } 

        if (listExists) {
          listExists.appendChild(newGradesList);
        } else {
          console.log("ggl|DEBUG: parentElement:", parentElement);
          parentElement.appendChild(newGradesUnorderedList);
          newGradesUnorderedList.appendChild(newGradesList);
        }
        newGradesList.addEventListener("click", function() {
          //  Removes grade and weight from arrays and recalculates the WeightedAverage
          deleteGrade(gradesArray, weightsArray, newGradesArray[i], newWeightsArray[i]);
          const parentList = this.parentNode; 
          parentList.removeChild(this); //  removes the li containing the grade we deleted
          const weightedAverage = calculateWeightedAverage(gradesArray, weightsArray);
          console.log("INFO: New weighted average: " + weightedAverage);
        });
      }

      console.log("PENDING: Weighted Average Calculation in progress")
      calculateWeightedAverage(newGradesArray, newWeightsArray);
    }
  }else{
    console.log("WARNING: Element not found or is set to default value")
  }
}

/*DELETE CONFIG*/
let deleteButton = document.getElementById("del-btn")
deleteButton.addEventListener('click', function(e){
  console.log("INFO: Beginning deletion process")
  const configNameDeletion = prompt('Enter config name to delete it:');
  if(configNameDeletion){
    configDataCheck = localStorage.getItem(configNameDeletion + '.data');
    
    console.log("DEBUG: Checking for: " + configDataCheck);

    if(configNameDeletion && configDataCheck){
      localStorage.removeItem(configNameDeletion+'.data');

      console.log("INFO: Attempting to remove option " + configNameDeletion)
      // Retrieve the item from local storage
      let optionsMenuState = localStorage.getItem("optionsMenuState");

      // Modify the item by removing the option with value "1"
      optionsMenuState = optionsMenuState.replace(`<option value="${configNameDeletion}">${configNameDeletion}</option>`, '');

      // Set the modified item back in local storage
      localStorage.setItem("optionsMenuState", optionsMenuState);
      location.reload();
    }
  }

})
