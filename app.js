const GITHUB_TOKEN = localStorage.getItem('GITHUB_TOKEN') || prompt("Paste your GitHub token:");
localStorage.setItem('GITHUB_TOKEN', GITHUB_TOKEN);
const API_URL = "https://api.github.com/gists";

function saveNote() {
  const title = document.getElementById("noteTitle").value || "Untitled";
  const content = document.getElementById("noteContent").value;

  const payload = {
    description: title,
    public: false, // secret gist
    files: {
      [`${title}.txt`]: {
        content: content
      }
    }
  };

  fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Note saved successfully!");
      console.log("Gist URL:", data.html_url);
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to save note.");
    });
}

function loadGists() {
  fetch(API_URL, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`
    }
  })
    .then((res) => res.json())
    .then((gists) => {
      const select = document.getElementById("gistList");
      select.innerHTML = `<option>-- Select a Gist --</option>`;
      gists.forEach((gist) => {
        const filename = Object.keys(gist.files)[0];
        const option = document.createElement("option");
        option.value = gist.id;
        option.text = gist.description || filename;
        select.appendChild(option);
      });
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to load Gists.");
    });
}

function loadSelectedGist() {
  const gistId = document.getElementById("gistList").value;
  if (!gistId) return;

  fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`
    }
  })
    .then((res) => res.json())
    .then((gist) => {
      const file = Object.values(gist.files)[0];
      document.getElementById("noteTitle").value = gist.description;
      document.getElementById("noteContent").value = file.content;
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to load the selected Gist.");
    });
}
