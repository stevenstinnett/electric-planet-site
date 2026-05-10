document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("uploadForm");
  const statusBox = document.getElementById("statusBox");

  if (!form) {
    console.error("Upload form not found on page.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusBox.innerText = "Uploading…";

    const medallionId = document.getElementById("medallionId").value.trim();
    const caption = document.getElementById("caption").value.trim();
    const fileInput = document.getElementById("fileInput");

    if (!fileInput.files.length) {
      statusBox.innerText = "Please select a file.";
      return;
    }

    const file = fileInput.files[0];

    try {
      // Step 1: Upload file to upload-handler
      const uploadResponse = await fetch("/.netlify/functions/upload-handler", {
        method: "POST",
        body: file
      });

      const uploadData = await uploadResponse.json();

      if (!uploadData.success) {
        statusBox.innerText = "Upload failed.";
        return;
      }

      // Step 2: Send data to orchestrator
      const orchestratorResponse = await fetch("/.netlify/functions/orchestrator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medallionId,
          caption,
          filename: file.name,
          filetype: file.type,
          filedata: uploadData.filedata || "placeholder"
        })
      });

      const orchestratorData = await orchestratorResponse.json();

      if (!orchestratorData.success) {
        statusBox.innerText = "Processing failed.";
        return;
      }

      // Step 3: Success
      statusBox.innerText = "Upload complete!";
      window.location.href = "/success2.html";

    } catch (err) {
      console.error("Upload error:", err);
      statusBox.innerText = "An error occurred.";
    }
  });
});

