const input = document.getElementById("file_uploader");

input.addEventListener("change", async (e) => {
  let file = e.target.files[0];
  let uploaded = await uploadFont(file);

  if (uploaded && uploaded.status === "success") {
    addFontToTable(uploaded.name, uploaded.path);
  } else {
    console.error("Upload failed:", uploaded?.message || "Unknown error");
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  let fontArray = await getFonts();

  fontArray.forEach((font) => {
    addFontToTable(font.name, font.path);
  });
});

// Funtionality
const uploadFont = async (file) => {
  try {
    let formData = new FormData();

    formData.append("file", file);

    let response = await fetch("upload_font.php", {
      method: "POST",
      body: formData,
    });

    let data = await response.json();
    return data;
  } catch (error) {
    console.log("error in upload font function : ", error);
  }
};

const getFonts = async () => {
  try {
    let response = await fetch("get_fonts.php");
    let data = await response.json();
    return data;
  } catch (error) {
    console.log("error in get fonts function : ", error);
  }
};

const deleteFont = async (encodedPath) => {
  try {
    console.log("Deleting font from path:", encodedPath);

    const response = await fetch("delete_font.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: encodedPath }),
    });

    const result = await response.json();

    if (result.status === "success") {
      const tableBody = document.getElementById("font-table-body");
      const rows = tableBody.querySelectorAll("tr");

      rows.forEach((row) => {
        const deleteButton = row.querySelector("button");
        if (
          deleteButton &&
          deleteButton.getAttribute("onclick").includes(encodedPath)
        ) {
          row.remove();
        }
      });
    } else {
      console.error("Failed to delete font from server:", result.message);
    }
  } catch (error) {
    console.error("Error deleting font:", error);
  }
};

const addFontToTable = (fontName, fontPath) => {
  const tableBody = document.getElementById("font-table-body");

  if (!fontName || !fontPath) {
    console.error("Invalid font data:", fontName, fontPath);
    return;
  }

  let cleanFontName = fontName.replace(/\s+/g, "");
  let encodedPath = encodeURIComponent(fontPath);
  let fontFace = new FontFace(cleanFontName, `url('${encodedPath}')`);

  fontFace
    .load()
    .then((loadedFont) => {
      document.fonts.add(loadedFont);

      const row = document.createElement("tr");
      row.classList.add("border-b", "border-gray-200", "hover:bg-gray-100");

      row.innerHTML = `
        <td class="py-3 px-6">${fontName}</td>
        <td class="py-3 px-6" style="font-family: '${cleanFontName}', sans-serif;">Sample Text</td>
        <td class="py-3 px-6 text-center">
          <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition" onclick="deleteFont('${encodedPath}')">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    })
    .catch((error) => {
      console.error("Error loading font:", error);
    });
};
