import { useState } from "react";

export default function Upload() {
  const [photosURL, setPhotosURL] = useState<string[]>([]);

  function handleUpload() {
    const selectedFilelist = (
      document.getElementById("upload") as HTMLInputElement
    ).files!;
    Array.from(selectedFilelist).map((file) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const imageURL = fileReader.result as string;
        setPhotosURL((prev) => [...prev, imageURL]);
      };
      fileReader.readAsDataURL(file);
    });
    photosURL.map((url) => {
      console.log(url);
    });
  }

  return (
    <div>
      <input type="file" name="upload" id="upload" multiple />
      <input
        type="button"
        value="upload"
        id="upload-btn"
        onClick={handleUpload}
      />
      <h1>Images</h1>
      {photosURL.map((url) => {
        return <img className="uploaded-image" src={url} alt="" />;
      })}
    </div>
  );
}
