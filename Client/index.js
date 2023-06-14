
function checkManifestType(link){
    fetch(manifestUrl)
    .then(response => {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/vnd.apple.mpegurl")) {
        console.log("This is an HLS manifest.");
      } else if (contentType && contentType.includes("application/dash+xml")) {
        console.log("This is a Dash manifest.");
      } else {
        console.log("Unknown manifest type.");
      }
    })
    .catch(error => {
      console.error("Error fetching manifest:", error);
    });

}