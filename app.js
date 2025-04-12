const GIST_ID = "22a1a8c85b657b4faf769f4b75d849b1"; // Replace with your Gist ID
const FILENAME = "notes.txt"; // Replace with your filename

let GITHUB_TOKEN = localStorage.getItem("GITHUB_TOKEN");

if (!GITHUB_TOKEN) {
  GITHUB_TOKEN = prompt("Paste your GitHub token:");
  localStorage.setItem("GITHUB_TOKEN", GITHUB_TOKEN);
}

function saveNote() {
  const content = document.getElementById("noteContent").value;
  const status = document.getElementById("status");

  const payload = {
    files: {
      [FILENAME]: {
        content: content
      }
    }
  };

  fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: "PATCH",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.files) {
        status.textContent = "✅ Note saved successfully!";
      } else {
        status.textContent = "❌ Save failed.";
      }
    })
    .catch((err) => {
      console.error(err);
      status.textContent = "❌ Network error.";
    });
}

// 🆕 NEW: Load content on page load
function loadNote() {
  const status = document.getElementById("status");

  fetch(`https://api.github.com/gists/${GIST_ID}`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`
    }
  })
    .then(res => res.json())
    .then(gist => {
      const file = gist.files[FILENAME];
      if (file) {
        document.getElementById("noteContent").value = file.content;
        status.textContent = "📥 Note loaded.";
      } else {
        status.textContent = "⚠️ File not found in Gist.";
      }
    })
    .catch(err => {
      console.error(err);
      status.textContent = "❌ Failed to load note.";
    });
}

// Call on page load
window.onload = loadNote;
