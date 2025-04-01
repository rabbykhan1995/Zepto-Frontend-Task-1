let addRowButton = document.getElementById("add_row_button");
let createGroupButton = document.getElementById("create_group_button");

// This is for group creation button
createGroupButton.addEventListener("click", () => {
  let groupNameInput = document.getElementById("group_name_input"); // Get input field
  let groupName = groupNameInput ? groupNameInput.value.trim() : ""; // Trim to remove extra spaces

  if (!groupName) {
    console.log("Error: Group name is required!");
    return; // Stop execution if the name is empty
  }

  let fonts = getFontRows(); // Get font rows

  createGroup(groupName, fonts);
  showGroupItem(groups);
});

// when dom is loaded then what functionality occur
document.addEventListener("DOMContentLoaded", async (e) => {
  let response = await fetch("get_fonts.php");

  if (response.ok === false) {
    console.log("no fonts");
  } else {
    let data = await response.json();
    addRow(data);
  }
  showGroupItem();
});

addRowButton.addEventListener("click", async () => {
  let response = await fetch("get_fonts.php");

  if (response.ok === false) {
    console.log("no fonts");
  } else {
    let data = await response.json();
    addRow(data);
  }
});

const addRow = (fonts) => {
  let rowField = document.getElementById("add_row_here");

  // Create a div for the new row
  let newRow = document.createElement("div");
  newRow.className =
    "flex md:flex-row flex-col gap-5 px-4 py-2 border border-gray-200 shadow-md";

  // Create input for Font Name
  let fontNameInput = document.createElement("input");
  fontNameInput.type = "text";
  fontNameInput.placeholder = "Font Name";
  fontNameInput.className =
    "border-gray-300 px-5 py-1 border focus:outline-none";

  // Create select dropdown for fonts
  let selectFont = document.createElement("select");
  selectFont.className = "border-gray-300 px-5 py-1 border focus:outline-none";

  // Default "Select Font" option
  let defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select Font";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  selectFont.appendChild(defaultOption);

  // Populate the dropdown with fonts
  fonts.forEach((font) => {
    let option = document.createElement("option");
    option.value = font.path; // Store path as value
    option.textContent = font.name; // Display name
    selectFont.appendChild(option);
  });

  // Delete button
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Remove This Row";
  deleteButton.className =
    "text-white bg-red-500 px-5 py-1 rounded-md hover:bg-red-300";
  deleteButton.addEventListener("click", () => {
    rowField.removeChild(newRow);
  });

  // Append elements to the row
  newRow.appendChild(fontNameInput);
  newRow.appendChild(selectFont);
  // newRow.appendChild(sizeDiv);
  // newRow.appendChild(priceDiv);
  newRow.appendChild(deleteButton);

  // Append row to the container
  rowField.appendChild(newRow);
};

let groups = [];

const createGroup = (name, fonts) => {
  let groupObj = { id: Date.now(), name, fonts };
  if (groupObj.fonts.length >= 2) {
    groups.push(groupObj);
    console.log(groups);
  } else {
    console.log("no group created");
  }
};

// show group item function where table body is present but table body items are not presented by default
const showGroupItem = (groupItems) => {
  let tableBody = document.getElementById("group_table_body");
  tableBody.innerHTML = ""; // Clear existing content to prevent duplicates

  groupItems.forEach((obj) => {
    const row = document.createElement("tr");
    row.classList.add("text-sm");

    // Format font names properly
    let fontNames = obj.fonts.map((font) => font.fontName).join(", ");

    row.innerHTML = `
      <td id="${obj.id}" class="py-2">${obj.name}</td>
      <td class="py-2">${fontNames}</td>
      <td class="py-2">${obj.fonts.length}</td>
    `;

    tableBody.appendChild(row);
  });
};

const getFontRows = () => {
  let rowField = document.getElementById("add_row_here");
  let rows = rowField.querySelectorAll("div"); // Get all rows inside the container

  let fontData = [];

  rows.forEach((row) => {
    let fontNameInput = row.querySelector("input[type='text']");
    let fontSelect = row.querySelector("select");

    // Ensure elements exist before reading values
    if (fontNameInput && fontSelect) {
      let fontName = fontNameInput.value.trim();
      let selectedFont = fontSelect.value;

      // Only add to the array if both values are present
      if (fontName && selectedFont) {
        fontData.push({ fontName, fontPath: selectedFont });
      }
    }
  });

  return fontData;
};
