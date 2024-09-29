import { useState } from "react";

export default function Upload() {
  const [photosURL, setPhotosURL] = useState<File | null>(null);

  // function handleUpload(e:any) {
  //   e.preventDefault();
  //   console.log(e.target.file);
  //   console.log(photosURL);
  
  
  // }
  
  // onSubmit={handleUpload}

  return (
    <form action="http://localhost:8080/tempstore" method="post" >
      <input type="file" name="upload" id="upload" multiple onChange={(e) => {
        if (!e.target.files) {
          return
        }
        setPhotosURL(e.target.files[0])
      }} />
      <button type="submit">
        Click!
      </button>
    </form>
  );
}
