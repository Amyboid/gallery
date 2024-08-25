import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { backgroundAtom, urlAtom } from "./states";


interface CollectionFrameProps {
  nameis: string;
  dateis: string;
  backGroundUrl: string;
}


export default function Collections() {
  const [isFormVisible, setisFormVisible] = useState(false)
  const [isCollectionsVisible, setisCollectionsVisible] = useState(false)
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [collection, setCollections] = useState([{}]);

  function OpenForm() {
    setisFormVisible(true)
  }
  function closeForm() {
    setisFormVisible(false)
    setName("")
    setDate("")
  }

  function NewCollectionPrompt() {
    return (
      <>
        <p>You have no collections</p>
        <button className="create-btn" onClick={OpenForm}>+ Create New</button>
      </>
    )
  }

  function CollectionFrame({ nameis, dateis, backGroundUrl }: CollectionFrameProps) {
    const frameRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (frameRef.current) {
        frameRef.current.style.backgroundImage = `url(${backGroundUrl})`;
      }
    }, [backGroundUrl]);
    return (
      <>
        <div className="collection-frame" ref={frameRef}>
          <span className="name-is">{nameis}</span>
          <span className="date-is">{dateis}</span>
          <button id="delete-col"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="m6.774 6.4l.812 13.648a.8.8 0 0 0 .798.752h7.232a.8.8 0 0 0 .798-.752L17.226 6.4h1.203l-.817 13.719A2 2 0 0 1 15.616 22H8.384a2 2 0 0 1-1.996-1.881L5.571 6.4zM9.5 9h1.2l.5 9H10zm3.8 0h1.2l-.5 9h-1.2zM4.459 2.353l15.757 2.778a.5.5 0 0 1 .406.58L20.5 6.4L3.758 3.448l.122-.69a.5.5 0 0 1 .579-.405m6.29-1.125l3.94.695a.5.5 0 0 1 .406.58l-.122.689l-4.924-.869l.122-.689a.5.5 0 0 1 .579-.406z" /></svg></button>
        </div>
      </>
    )
  }


  function FormElement() {
    const [backGround, setBackground] = useAtom(backgroundAtom)
    const [url, setUrl] = useAtom(urlAtom)
    function createCollection(e: any) {
      e.preventDefault();
      const newCollection = {
        "name": name,
        "date": date,
        "backGroundUrl": url
      }
      // let existingCol = JSON.parse(localStorage.getItem("myCol") || "[]");
      // localStorage.setItem("myCol", JSON.stringify([...existingCol, newCollection]))

      setCollections((prev) => [...prev, newCollection])
      setName("")
      setDate("")
      setisFormVisible(false)
      setisCollectionsVisible(true)

    }
    if (backGround) {
      const reader = new FileReader();
      reader.onload = function (event) {
        setUrl(event.target?.result)
        console.log("hilll:  ", typeof (url));
      };
      reader.readAsDataURL(backGround);
    }

// getting focus back to input field after typing one word
    useEffect(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, [isFormVisible])

    return (
      <>
        <button className="close-btn" onClick={closeForm}>X</button>
        <form action="" className="creation-form" onSubmit={createCollection}>
          <div className="name">
            <label htmlFor="name">Collection Name</label>
            <input ref={nameInputRef} value={name} type="text" onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="date">
            <label htmlFor="date" >Date</label>
            <input value={date} type="date" onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="photo">
            <label htmlFor="photo" >Choose photo</label>
            <input id="phoo" accept="image/*" type="file" required onChange={(event) => {
              setBackground(event.target.files[0]);
            }} />
          </div>
          <button className="submit-btn" type="submit">Create</button>
        </form>
      </>
    )
  }

  return (
    <div className="collection-box">
      <header>
        <span>
          Collections
        </span>
        <button onClick={OpenForm}>+ Create New</button>
      </header>
      <div className="collections">
        {
          isCollectionsVisible && collection.map((i, key) => Object.keys(i).length != 0 ? <CollectionFrame key={key} backGroundUrl={i.backGroundUrl} nameis={i.name} dateis={i.date} /> : "")
        }
        <div className="create-col">
          {!isCollectionsVisible && !isFormVisible && <NewCollectionPrompt />}
          {isFormVisible && <FormElement />}
        </div>
      </div>
    </div>
  )
}
