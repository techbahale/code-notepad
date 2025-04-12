const GIST_ID = "22a1a8c85b657b4faf769f4b75d849b1"; // Replace with your Gist ID
const FILENAME = "notes.txt"; // Replace with your filename

   let GITHUB_TOKEN = localStorage.getItem("GITHUB_TOKEN");
    
    if (!GITHUB_TOKEN) {
      GITHUB_TOKEN = prompt("Paste your GitHub token:");
      localStorage.setItem("GITHUB_TOKEN", GITHUB_TOKEN);
    }
    
    // Update line numbers based on content
    function updateLineNumbers() {
      const textarea = document.getElementById("noteContent");
      const lineCount = textarea.value.split('\n').length;
      const lineNumbersDiv = document.getElementById("lineNumbers");
      
      // Update line count in footer
      document.getElementById("lineCount").textContent = `${lineCount} line${lineCount !== 1 ? 's' : ''}`;
      
      // Generate line numbers
      lineNumbersDiv.innerHTML = Array(lineCount).fill(0)
        .map((_, i) => `<div>${i + 1}</div>`)
        .join('');
    }
    
    function saveNote() {
      const content = document.getElementById("noteContent").value;
      const status = document.getElementById("status");
      status.textContent = "Saving...";
      status.className = "";
      
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
            status.textContent = "Saved";
            status.className = "save-success";
            setTimeout(() => {
              status.textContent = "";
            }, 3000);
          } else {
            status.textContent = "Save failed";
            status.className = "save-error";
          }
        })
        .catch((err) => {
          console.error(err);
          status.textContent = "Network error";
          status.className = "save-error";
        });
    }
    
    function loadNote() {
      const status = document.getElementById("status");
      status.textContent = "Loading...";
      
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
            document.getElementById("filename").textContent = FILENAME;
            updateLineNumbers();
            status.textContent = "";
          } else {
            status.textContent = "File not found";
            status.className = "save-error";
          }
        })
        .catch(err => {
          console.error(err);
          status.textContent = "Failed to load";
          status.className = "save-error";
        });
    }
    
    // Sync line numbers on input
    document.getElementById("noteContent").addEventListener("input", updateLineNumbers);
    document.getElementById("noteContent").addEventListener("scroll", function() {
      document.getElementById("lineNumbers").scrollTop = this.scrollTop;
    });
    
    // Call on page load
    window.onload = function() {
      loadNote();
      updateLineNumbers();
    };
