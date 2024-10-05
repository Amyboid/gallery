import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useAtom } from "jotai";
import { collectionAtom, testDataAtom } from "../src/context";
import axios from "axios";

interface UploadFormProps {
  setImg: Function;
  closeUploadForm: () => void;
  collId: string;
  uploadImage: (collId: string) => void;
}

//components
function UploadForm({
  setImg,
  closeUploadForm,
  uploadImage,
  collId,
}: UploadFormProps) {
  return (
    <>
      <input
        type="file"
        className="g-create-input"
        onChange={(e) => {
          e.target.files ? setImg(e.target.files[0]) : setImg(null);
        }}
      ></input>

      <button onClick={closeUploadForm}>X</button>
      <button className="g-upload-btn" onClick={()=> uploadImage(collId)}>
        Upload
      </button>
    </>
  );
}

export default function Gallery() {
  const [testData, _] = useAtom(testDataAtom);
  const [collection] = useAtom(collectionAtom);
  const [img, setImg] = useState<File | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [galleryFolder, setGalleryFolder] = useState("");
  const [imgIds, setImgIds] = useState<string[]>([]);
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const params = useParams();
  const collId:string = params.collId!;

  useEffect(() => {
    if (imgUrls) {
      console.log("ooppppImgUrl:...", imgUrls);
    }
  }, [imgUrls]);

  useEffect(() => {
    collection.map((item) => {
      if (item.id.toString() === params.collId) {
        setGalleryFolder(item.galleryFolder);
      }
    });
  }, []);

  function uploadImage(collId: string) {
    console.log("called");
    if (img) {
      console.log("calledf");
      console.log("img", img);
      const formData = new FormData();
      formData.append("image", img);
      formData.append("galleryFolderName", galleryFolder);
      formData.append("collId", collId);

      axios
        .post("http://localhost:8080/uploadImages", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log("fileResponse.......\n", res.data.url);
          setImgUrls((prev) => [...prev, res.data.url]);

          if (res.data.error) {
            console.log("Supabase Error while uploading", res.data.error);
          }
        })
        .catch((error) => {
          console.log("post Error while uploading 🐦‍🔥 ", error);
        });
    }
    closeUploadForm();
  }

  function openShowUploadForm() {
    setShowUploadForm(true);
  }
  function closeUploadForm() {
    setShowUploadForm(false);
  }

  if (testData && params.collId) {
    if (testData.includes(params.collId)) {
      return (
        <>
          <div className="g-container">
            <div className="g-navbar">
              <div className="g-layout">
                <div className="g-lay1 g-lay"></div>
                <div className="g-lay2 g-lay"></div>
                <div className="g-lay3 g-lay"></div>
                <div className="g-lay4 g-lay"></div>
              </div>
              {collection.map((item) => {
                if (item.id.toString() === params.collId) {
                  return (
                    <div
                      style={{ backgroundImage: `url(${item.bg})` }}
                      className="g-preview"
                    >
                      <div className="g-preview-msg">Preview</div>
                    </div>
                  );
                }
              })}
            </div>
            <div className="g-photos-box">
              <div className="g-photos-nav">
                <label className="g-create-btn" onClick={openShowUploadForm}>
                  + Upload New
                </label>
              </div>
              <div className="g-photos">
                {showUploadForm && (
                  <UploadForm
                    setImg={setImg}
                    closeUploadForm={closeUploadForm}
                    uploadImage={uploadImage}
                    collId={collId}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      );
    }
  } else {
    return <span>No collection found</span>;
  }
}
