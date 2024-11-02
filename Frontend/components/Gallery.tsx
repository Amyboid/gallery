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
  imgPreview: string|undefined;
}

interface imageProps {
  url: string;
  imgId: string;
}

//components
function UploadForm({
  setImg,
  closeUploadForm,
  uploadImage,
  collId,
  imgPreview
}: UploadFormProps) {
  return (
    <div className="g-upload-form">
    <div style={{backgroundImage:imgPreview}} className="prev">

      <input
        type="file"
        className="g-create-input"
        onChange={(e) => {
          e.target.files ? setImg(e.target.files[0]) : setImg(null);
        }}
        ></input>

      <button onClick={closeUploadForm}>X</button>
      <button className="g-upload-btn" onClick={() => uploadImage(collId)}>
        Upload
      </button>
        </div>
    </div>
  );
}

export default function Gallery() {
  const [testData, _] = useAtom(testDataAtom);
  const [collection] = useAtom(collectionAtom);
  const [img, setImg] = useState<File | null>(null);
  const [galleryFolder, setGalleryFolder] = useState("");
  const [imgUrls, setImgUrls] = useState<imageProps[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [imgPreview, setImgPreview] = useState<string | undefined>(undefined);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [bgColor, setBgColor] = useState<string>("");
  const params = useParams();
  const collId: string = params.collId!;

  useEffect(() => {
    if (imgUrls) {
      console.log("ooppppImgUrl:...", imgUrls);
      setShowUploadForm(false);
    }
  }, [imgUrls]);

  useEffect(() => {
    if (img) {
      const reader = new FileReader();
      reader.onload = () => {
        console.log("fff: ", typeof(reader.result));
        const data = reader.result;
        setImgPreview(data); // Set the preview URL
      };
      reader.readAsDataURL(img); // Read the file as a data URL
    } else {
      setImgPreview(undefined); // Clear the preview if no file is selected
    }
  }, [img]);

  useEffect(() => {
    if (imgUrls) {
      console.log("exist");
      setShowImages(true);
    }
    collection.map((item) => {
      if (item.id.toString() === params.collId) {
        setGalleryFolder(item.galleryFolder);
        const urls = [...item.images];
        const imgIds = [...item.imageIds];
        const combined = urls.map((url, index) => {
          return {
            url: url,
            imgId: imgIds[index],
          };
        });
        setImgUrls([...combined]);
      }
    });
  }, []);

  function uploadImage(collId: string) {
    console.log("called");
    if (img) {
      const formData = new FormData();
      formData.append("image", img);
      formData.append("galleryFolderName", galleryFolder);
      formData.append("collId", collId);
      console.log("coll__id", collId);

      axios
        .post("http://localhost:8080/uploadImages", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          // console.log("fileResponse.......\n", res.data.imgId);
          const newImg = {
            url: res.data.url,
            imgId: res.data.imgId,
          };
          setImgUrls((prev) => [...prev, newImg]);

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

  function deleteImage(imgId: string, url: string, collId: string) {
    // delete images on storage based on the data id (collId) from database and
    const newImgUrls = imgUrls.filter((image) => image.imgId != imgId);
    setImgUrls(newImgUrls);
    axios.delete("http://localhost:8080/deleteSingleImage", {
      data: { imgId, url, collId },
    });
  }

  function showImage(img: string) {
    const colors = [
      "#fcd9e96a",
      "#d9d9fc6a",
      "#d9fce36a",
      "#fbfcd96a",
      "#fcebd96a",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setSelectedImage(img);
    setBgColor(randomColor);
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
                    ></div>
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
              <div className="g-uploaded-img-container">
                {showUploadForm && (
                  <UploadForm
                    setImg={setImg}
                    closeUploadForm={closeUploadForm}
                    uploadImage={uploadImage}
                    collId={collId}
                    imgPreview={imgPreview}
                  />
                )}

                {(showImages || !showUploadForm) &&
                  imgUrls.map((images) => (
                    <div className="g-uploaded-img-box">
                      <div
                        onClick={() => showImage(images.url)}
                        className="g-uploaded-img"
                        style={{ backgroundImage: `url(${images.url})` }}
                      ></div>
                      <svg
                        className="g-delete-img"
                        onClick={() =>
                          deleteImage(images.imgId, images.url, collId)
                        }
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M21.03 3L18 20.31c-.17.96-1 1.69-2 1.69H8c-1 0-1.83-.73-2-1.69L2.97 3zM5.36 5L8 20h8l2.64-15zM9 18v-4h4v4zm4-4.82L9.82 10L13 6.82L16.18 10z"
                        />
                      </svg>
                    </div>
                  ))}
                {selectedImage && (
                  <div
                    className="g-show-single-img"
                    style={{ backgroundColor: bgColor }}
                  >
                    <img
                      className="g-single-img"
                      src={selectedImage}
                      alt="hey"
                    />
                    <svg
                      className="g-close-single-img-btn"
                      onClick={() => {
                        setSelectedImage(undefined);
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 42 42"
                    >
                      <path
                        fill="currentColor"
                        fill-rule="evenodd"
                        d="m21.002 26.588l10.357 10.604c1.039 1.072 1.715 1.083 2.773 0l2.078-2.128c1.018-1.042 1.087-1.726 0-2.839L25.245 21L36.211 9.775c1.027-1.055 1.047-1.767 0-2.84l-2.078-2.127c-1.078-1.104-1.744-1.053-2.773 0L21.002 15.412L10.645 4.809c-1.029-1.053-1.695-1.104-2.773 0L5.794 6.936c-1.048 1.073-1.029 1.785 0 2.84L16.759 21L5.794 32.225c-1.087 1.113-1.029 1.797 0 2.839l2.077 2.128c1.049 1.083 1.725 1.072 2.773 0z"
                      />
                    </svg>
                  </div>
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
