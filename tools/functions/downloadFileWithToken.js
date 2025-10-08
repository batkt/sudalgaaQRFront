export default function downloadFileWithToken(file, token, fileName) {
  let anchor = document.createElement("a");
  document.body.appendChild(anchor);

  let headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);

  fetch(file, { headers })
    .then((response) => response.blob())
    .then((blobby) => {
      let objectUrl = window.URL.createObjectURL(blobby);

      anchor.href = objectUrl;
      anchor.download = fileName;
      anchor.click();

      window.URL.revokeObjectURL(objectUrl);
    });
}
