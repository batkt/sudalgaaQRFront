export default function downloadFileWithToken(file, token, fileName) {
  return new Promise((resolve, reject) => {
    let anchor = document.createElement("a");
    document.body.appendChild(anchor);

    let headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);

    fetch(file, { headers })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.blob();
      })
      .then((blobby) => {
        let objectUrl = window.URL.createObjectURL(blobby);

        anchor.href = objectUrl;
        anchor.download = fileName;
        anchor.click();

        window.URL.revokeObjectURL(objectUrl);
        document.body.removeChild(anchor);
        resolve();
      })
      .catch((error) => {
        document.body.removeChild(anchor);
        reject(error);
      });
  });
}
