document.getElementById("processZip").addEventListener("click", async () => {
    const fileInput = document.getElementById("zipInput").files[0];
    const prefixInput = document.getElementById("prefixInput").value.trim();
    const loader = document.getElementById("loader");
    
    if (!fileInput) {
      alert("Please select a ZIP file first.");
      return;
    }

    if (!prefixInput) {
      alert("Please enter a prefix for the images.");
      return;
    }

    loader.style.display = "block"; // Show loader

    const zip = new JSZip();
    const renamedZip = new JSZip();
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    let index = 1;

    try {
      // Load the ZIP file
      const zipContent = await zip.loadAsync(fileInput);

      // Process each file in the ZIP
      for (const [filename, file] of Object.entries(zipContent.files)) {
        const ext = filename.split('.').pop().toLowerCase();

        if (imageExtensions.includes(ext)) {
          // Rename image using the provided prefix
          const newFilename = `${prefixInput}_${index++}.${ext}`;
          const content = await file.async("blob");
          renamedZip.file(newFilename, content);
        } else {
          // Add non-image files without renaming
          const content = await file.async("blob");
          renamedZip.file(filename, content);
        }
      }

      // Generate the new ZIP file
      const newZipBlob = await renamedZip.generateAsync({ type: "blob" });

      // Download the new ZIP file
      const downloadLink = document.getElementById("downloadLink");
      downloadLink.href = URL.createObjectURL(newZipBlob);
      downloadLink.download = "renamed_images.zip";
      downloadLink.style.display = "block";
      downloadLink.textContent = "Download Renamed ZIP";
    } catch (error) {
      alert("An error occurred while processing the ZIP file.");
    } finally {
      loader.style.display = "none"; // Hide loader after processing
    }
  });