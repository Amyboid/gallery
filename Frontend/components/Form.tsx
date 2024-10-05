import axios from "axios";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { collectionAtom, isCollectionsVisibleAtom } from "../src/context";

interface FormProps {
  setLoading: Function;
  setIsBlinking: Function;
  setisFormVisible: Function;
  setCollectionError: Function;
}
export default function Form({
  setLoading,
  setIsBlinking,
  setCollectionError,
  setisFormVisible,
}: FormProps) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [imgId, _] = useState("");
  const [galleryFolder, __] = useState("");
  const [bg, setBg] = useState<File | null>(null);

  const [formError, setFormError] = useState("");

  const [, setCollection] = useAtom(collectionAtom);
  const [, setisCollectionsVisible] = useAtom(isCollectionsVisibleAtom);

  useEffect(() => {
    if (name || date || bg) {
      setFormError("");
    }
  }, [name, date, bg]);

  function closeForm() {
    setisFormVisible(false);
    setName("");
    setDate("");
    setisCollectionsVisible(true);
  }

  function errorBlink(err: any) {
    setCollectionError("Error: " + err);
    setIsBlinking(true);
    setTimeout(() => {
      setIsBlinking(false);
      setCollectionError("");
    }, 5000);
  }

  function createCollection(e: any) {
    e.preventDefault();
    if (!name || !date || !bg) {
      setFormError("provide all data correctly");
      return;
    } else {
      setFormError("");
    }
    setLoading(true);
    const newCollection = {
      name: name,
      date: date,
      bg: bg,
      imgId: imgId,
      galleryFolder: galleryFolder,
    };

    const maxFileSize = 2 * 1024 * 1024;

    if (bg) {
      if (bg.size > maxFileSize) {
        let err = "Background size should be less than 2 mb";
        errorBlink(err);
      }

      const formdata = new FormData();
      formdata.append("file", bg);
      axios
        .post("http://localhost:8080/storebackground", formdata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.error) {
            errorBlink(res.data.error);
          } else {
            setCollectionError("");
            newCollection.bg = res.data.url; 
            newCollection.imgId = res.data.imgId;
            newCollection.galleryFolder = Date.now() + name;
            axios
            .post("http://localhost:8080/storedata", newCollection)
            .then((res) => {
                setLoading(false);
                setCollection((prev: any) => [...prev, res.data[0]]);
                // return res;
              })
              .catch((error) => {
                console.log("post error: ", error);
              });
          }
        })
        .catch((_err) => {
          console.log("server error 🐦‍🔥");
        });
    }

    setName("");
    setDate("");
    setisFormVisible(false);
    setisCollectionsVisible(true);
  }

  return (
    <>
      <button className="close-btn" onClick={closeForm}>
        X
      </button>
      <form className="creation-form" onSubmit={createCollection}>
        <div className="name">
          <label htmlFor="name">Collection Name</label>
          <input
            placeholder="type name ..."
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="date">
          <label htmlFor="date">Date</label>
          <input
            value={date}
            type="date"
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="photo">
          <label htmlFor="photo">Choose photo</label>

          <input
            id="phoo"
            accept="image/*"
            type="file"
            required
            onChange={(event) => {
              if (!event.target.files) return;
              setBg(event.target.files[0]);
            }}
          />
        </div>
        <button className="submit-btn" type="submit">
          Create
        </button>
        <div className="form-error">{formError}</div>
      </form>
    </>
  );
}
