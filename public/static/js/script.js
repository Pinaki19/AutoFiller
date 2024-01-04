document.addEventListener('DOMContentLoaded', function () {
    try {
        updateSliderValue();
    } catch (e) {
        null;
    }

});


function updateSliderValue() {
    const sliderValue = document.getElementById("numResponsesSlider").value;
    document.getElementById("numResponses").value = sliderValue;
}

// Function to update slider value when input changes
function updateInputValue() {
    checkInput();
    const inputValue = document.getElementById("numResponses").value;
    document.getElementById("numResponsesSlider").value = inputValue;
}
function fetchForm() {
    event.preventDefault();
    // Get the form link entered by the user
    var formLink = document.getElementById("formLinkInput").value;
    if (!isValidGoogleFormsLink(formLink)) {
        alert("Please provide a valid Google form link!!");
        return;
    }
    // Check if a link is provided
    if (formLink.trim() !== "") {
        // Extract the form ID from the Google Form link
        var formId = extractFormId(formLink);
        console.log(formId);

        // Generate the Google Forms embed URL
        var embedUrl = extractFormId(formLink);

        // Create an iframe element to embed the Google Form
        var iframe = document.createElement("iframe");
        iframe.src = embedUrl;
        iframe.width = "100%";
        iframe.height = "600px"; // Adjust the height as needed

        // Clear the existing content in the preview section
        document.getElementById("formPreview").innerHTML = "";

        // Append the iframe to the form preview section
        document.getElementById("formPreview").appendChild(iframe);

        // Scroll to the top of the loaded form

        showOptions();

    } else {
        alert("Please enter a valid Google Form link.");
    }

}


// Function to extract the Google Form ID from the link
function extractFormId(formLink) {
    // Match both formats: /forms/d/e/ and /forms/gle/
    var formIdMatch = formLink.match(/\/forms\/d\/e\/([a-zA-Z0-9_-]+)/);

    if (formIdMatch && formIdMatch.length >= 2) {
        return "https://docs.google.com/forms/d/e/" + formIdMatch[1] + "/viewform?embedded=true";
    }
    return formLink;
}


function fillEmails() {

    var emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(function (emailInput) {
        // Check if the input element is found
        if (emailInput) {
            // Set the value of the input
            emailInput.value = "example@EXxample.com";

            // Create and dispatch an input event
            var inputEvent = new InputEvent('input', {
                bubbles: true,
                cancelable: true,
            });

            emailInput.dispatchEvent(inputEvent);
        } else {
            console.error("Email input not found");
        }
    });
}

function showOptions() {
    document.getElementById("fetchOptions").style.display = "block";
    var optionsDiv = document.getElementById("fetchOptions");
    optionsDiv.innerHTML = `
          <div class="form-group mt-3">
            <label for="menuChoice">What type of text input does your form have? <i class="bi bi-star" style="color:red;"></i></label>
            <select class="form-control" id="menuChoice" required onchange="updateOptions()">
              <option value="" disabled selected>Select an option</option>
              <option value="1"> Name and Mail field.</option>
              <option value="2"> Name field only.</option>
              <option value="3"> Mail field only.</option>
              <option value="4"> NO Name or Mail field.</option>
            </select>
          </div>
            <div id="responsesInput" class="form-group mt-3">
                <label for="numResponses">How many Responses do you want? <i class="bi bi-star" style="color:red;"></i></label>
                <div style="display:flex;flex-direction:row;">
                    <input type="range" style="height:0;width:70%;padding:20px;padding-left:0;margin-top:10px;" class="form-range" id="numResponsesSlider" min="1" max="300" onchange="updateSliderValue()" value="10">
                    <div class="d-flex justify-content-between mt-2" style="width:30%;margin-top:0;">
                    <input type="number" class="form-control" id="numResponses" min="1" max="300" required oninput="updateInputValue()" placeholder=" 1 - 300" value="10">
                    </div>
                </div>
            </div>

          <div id="nameInput" class="form-group mt-3" style="display:none;">
            <label for="userName">Enter names (comma-separated):</label>
            <textarea class="form-control" id="userName" placeholder="If you would like to provide some names but not all,then the rest of them will be randomly selected." class="text-muted"></textarea>
        </div>


          <div id="generateEmailsDiv" class="form-group mt-3" style="display:none;">
            <label for="generateEmails" >Would you like to generate emails from names ? <i class="bi bi-star" style="color:red;"></i></label>
            <select class="form-control" id="generateEmails" onchange="updateOptions()">
              <option value="" disabled selected>Select an option</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div id="emailInput" class="form-group mt-3" style="display:none;">
            <label for="userEmail">Enter email addresses (comma-separated): &nbsp <i class="bi bi-star" style="color:red;"></i></label>
            <textarea type="text" class="form-control" id="userEmail" placeholder="If you would like to provide some emails but not all, then the rest of them will be auto-generated. Name no 1 will be used with Email no 1 and so on." class="text-muted"></textarea>
        </div>

    <div  style="display:flex;flex-direction:row; align-items:center; align-self:center;position:relative;top:20px;">
          <button type="submit" class="btn btn-primary " style="position:relative;left:400px;" onclick="submitForm()">Submit</button>
        <button type="button" class="btn btn-primary" style="position:relative;left:150px;" onclick="showFormPreview()">Check Form</button>
    </div>
          `;

}

function showFormPreview() {
    document.getElementById("formPreview").scrollIntoView({ behavior: "smooth" });
}

function updateOptions() {
    // Get user choice
    var userChoice = document.getElementById("menuChoice").value;
    // Show sections based on user choice
    showSections(userChoice);
}


function checkInput() {
    var inputElement = document.getElementById("numResponses");
    var inputValue = parseInt(inputElement.value);

    try {
        if (isNaN(inputValue) || inputValue < 1 || inputValue > 300) {
            inputElement.value = ""
        }
    } catch (e) {
        // If the input is invalid, replace it with 1
        inputElement.value = 1;
    }
}

// Function to show sections based on user choice
function showSections(choice) {

    var menuChoice = document.getElementById("menuChoice").value;
    document.getElementById("nameInput").style.display = "none";
    document.getElementById("generateEmailsDiv").style.display = "none";
    document.getElementById("emailInput").style.display = "none";

    // Show input fields based on user's choice
    if (menuChoice === "1" || menuChoice === "2" || menuChoice === "3") {
        document.getElementById("nameInput").style.display = "block";
    }
    if (menuChoice === "1" || menuChoice === "3") {
        document.getElementById("generateEmailsDiv").style.display = "block";
        document.getElementById("generateEmailsDiv").required = true;
    }

    if ((menuChoice === "1" || menuChoice === "3") && document.getElementById("generateEmails").value === "false") {
        document.getElementById("emailInput").style.display = "block";
        document.getElementById("emailInput").required = true;
    }
}

// Function to hide specific sections based on user choice
function hideSections() {
    // Hide sections
    document.getElementById("fetchOptions").style.display = "none";

}
function resetForm() {
    try {
        document.getElementById("numResponsesSlider").value = 10;
        document.getElementById("numResponses").value = 10;
    } catch (error) { }

    try {
        document.getElementById("userName").value = "";
    } catch (e) { }

    try {
        document.getElementById("userEmail").value = "";
    } catch (error) { }
}

let currentProgress = 0;
let totalUnits = 100;

function submitForm() {
    // Extracting data from the form
    if (!checkTimer()) {
        return;
    }
    var formLink = document.getElementById("formLinkInput").value;

    // Validate if it's a valid Google Forms link
    if (!isValidGoogleFormsLink(formLink)) {
        alert("Please provide a valid Google Forms link.");
        return;
    }
    if (!validateForm()) {
        alert("Please fill in all required fields (Marked RED) before submitting.");
        return;
    }

    var emails = document.getElementById("userEmail").value;
    if (emails == '') {
        emails = "DEFAULT";
    }
    var names = document.getElementById("userName").value;
    if (names == '') {
        names = "DEFAULT";
    }
    var formData = {
        Request_NO: document.getElementById("menuChoice").value,
        Total: document.getElementById("numResponses").value,
        Form: formLink,
        Form_data: {
            emails: emails,
            names: names,
        },
    };

    // Checking if emails are provided in correct format
    var generateEmails = document.getElementById("generateEmails").value;
    if (!validateEmails(formData.Form_data.emails) && generateEmails === "false") {
        alert("Please provide emails in correct format (comma-separated)");
        return;
    }

    disableFormInputs();


    $.ajax({
        type: "POST",
        url: "/processAndFill", // Replace with the actual endpoint for preprocessing and filling
        data: JSON.stringify(formData),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            setTimer();
            currentProgress = 0;
            totalUnits = parseInt(document.getElementById("numResponses").value, 10) * 3;
            updateProgressBar(currentProgress);
            showProgressBar();
            const progressInterval = setInterval(function () {
                simulateProgress();
            }, 5000);
            setTimeout(() => {
                alert("Task queued successfully! You will see a progressbar below. You CAN CLOSE OUT of this site. ETR: " + (parseInt(document.getElementById("numResponses").value, 10) / 4) * 15 + " seconds.");
            }, 1000);
            resetForm();
        },
        error: function (error) {
            enableFormInputs();
            //hideProgressMessage();
        }
    });
}

function showProgressBar() {
    var progressBar = document.getElementById("custom-progress");
    if (progressBar) {
        progressBar.style.display = "block";
    }
}


function validateEmails(emails) {
    var emailArray = emails.split(",");
    var emailRegex = /\S+@\S+\.\S+/;

    for (var i = 0; i < emailArray.length; i++) {
        if (!emailRegex.test(emailArray[i].trim())) {
            return false;
        }
    }

    return true;
}

function isValidGoogleFormsLink(link) {
    return link.includes("forms.gle") || link.includes("docs.google.com/forms/");
}

function validateForm() {
    // Check if all required fields are filled in
    if (document.getElementById("numResponses").value == '') {
        alert("Provide number of responses required!");
        return false;
    }
    var menuChoice = document.getElementById("menuChoice").value;
    if (menuChoice == '') {
        alert("Select Form Type!");
        return false;
    }
    if (document.getElementById("generateEmails").value === "") {
        return false;
    }

    if (menuChoice === "1" || menuChoice === "3") {
        if (document.getElementById("generateEmails").value === "false" &&
            document.getElementById("userEmail").value.trim() === "") {
            return false;
        }
    }

    return true;
}

function setTimer() {
    // Set timer on local storage for 5 minutes
    localStorage.setItem("taskTimer", new Date().getTime() + 50 * 1000); // 5 minutes in milliseconds
}

function checkTimer() {
    var taskTimer = localStorage.getItem("taskTimer");

    if (taskTimer) {
        var currentTime = new Date().getTime();
        var secondsLeft = Math.max(0, Math.floor((taskTimer - currentTime) / 1000));

        if (currentTime < taskTimer) {
            alert("A previous task is under progress. Please wait for " + secondsLeft + " seconds to queue another task.");
            // Optionally disable form inputs and show a message to indicate the waiting period
            return false;
        }
    }
    return true;
}

function disableFormInputs() {
    hideSections();
}

function enableFormInputs() {
    var userChoice = document.getElementById("menuChoice").value;
    showSections(userChoice);
}

function updateProgressBar(progressValue) {
    var progressBar = document.getElementById("custom-progress-bar");

    if (!isNaN(progressValue) && progressValue >= 0 && progressValue <= 100) {
        progressBar.style.width = progressValue + "%";

        if (progressValue <= 5) {
            progressBar.style.backgroundColor = "#f63a0f";
        } else if (progressValue <= 25) {
            progressBar.style.backgroundColor = "#f27011";
        } else if (progressValue <= 50) {
            progressBar.style.backgroundColor = "#f2b01e";
        } else if (progressValue <= 75) {
            progressBar.style.backgroundColor = "#ccf56e";
        } else if (progressValue <= 99) {
            progressBar.style.backgroundColor = "#86e01e";
        } else {
            progressBar.style.backgroundColor = "#17ff64";
        }

        // Create or update progress label
        var progressLabel = document.getElementById("progress-label");
        if (!progressLabel) {
            progressLabel = document.createElement("div");
            progressLabel.id = "progress-label";
            progressBar.appendChild(progressLabel);
        }
        progressLabel.textContent = progressValue + "%";
    }
}

// Function to set the progress text
function setProgressText(progress) {
    const progressText = document.getElementById('progress-text');
    progressText.innerHTML = progress + '%';
}

// Function to simulate progress completion
function simulateProgress(n) {
    if (currentProgress < totalUnits) {
        currentProgress += 1;
        updateProgressBar(Math.floor((currentProgress / totalUnits) * 100));
    } else {
        clearInterval(progressInterval);
        console.log('Progress completed!');
    }
}

