var manifestDiv = document.createElement("div")

function checkManifestType(link){
    fetch(link)
    .then(response => {
      const contentType = response.headers.get("content-type");
      let manifestType;
      if (contentType && contentType.includes("application/vnd.apple.mpegurl")) {
        console.log("This is an HLS manifest.");
        manifestType = "HLS";
      } else if (contentType && contentType.includes("application/dash+xml")) {
        console.log("This is a Dash manifest.");
        manifestType = "Dash";
      } else {
        console.log("Unknown manifest type.");
      }
      if(manifestType) {
          manifestDiv.textContent = `Manifest Type: ${manifestType}`;
          console.log(document.getElementsByTagName('button_info_container'))
          document.getElementById('info_container').appendChild(manifestDiv);
      }
    })
    .catch(error => {
      console.error("Error fetching manifest:", error);
    });

}