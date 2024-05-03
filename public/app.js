document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector("form");
  const messageInput = document.getElementById("message");
  const responseEl = document.getElementById("response");
  const messageBtn = document.getElementById("message-btn");
  const ideaCount = document.getElementById("ideaCount");

  // Create the Copy button dynamically if it does not exist
  if (!document.getElementById('copy-btn')) {
    const copyBtn = document.createElement("button");
    copyBtn.id = "copy-btn";
    copyBtn.textContent = "Copy Text";
    copyBtn.className = "mt-4 py-2 px-4 rounded-xl text-center mx-auto block font-bold";
    copyBtn.style.backgroundColor = "transparent";  // Background transparent
    copyBtn.style.border = "2px solid #55fd14";      // Green border
    copyBtn.style.color = "#55fd14";                // Green text
    copyBtn.style.cursor = "pointer";               // Cursor as pointer
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(responseEl.textContent).then(() => {
        alert('Text copied to clipboard!');
      }, (err) => {
        console.error('Could not copy text: ', err);
      });
    });

    // Append the Copy button below the response element
    responseEl.parentNode.appendChild(copyBtn);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log(messageInput.value);
    messageBtn.disabled = true;
    messageBtn.textContent = "Sending...";

    try {
      const res = await fetch("/api/flowise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageInput.value }),
      });

      const data = await res.json();
      responseEl.innerHTML = data.message;
      updateIdeaCount();  // Update the count after a new idea is generated
    } catch (error) {
      responseEl.innerHTML = error.message;
    } finally {
      messageBtn.disabled = false;
      messageBtn.textContent = "Send";
      messageInput.value = "";
    }
  });

  // Function to update the count of ideas generated
  function updateIdeaCount() {
    fetch('/api/getCount')
    .then(response => response.json())
    .then(data => {
        const countDisplay = document.getElementById('ideaCount');
        if (!countDisplay) {
            const newCountDisplay = document.createElement('p');
            newCountDisplay.id = 'ideaCount';
            newCountDisplay.textContent = `Ideas: ${data.count}`;
            document.body.appendChild(newCountDisplay); // Adjust placement as necessary
        } else {
            countDisplay.textContent = `Ideas: ${data.count}`;
        }
    })
    .catch(error => console.error('Error fetching idea count:', error));
  }

  // Optionally, update the count at regular intervals
  setInterval(updateIdeaCount, 30000); // Updates the count every 30 seconds
});
