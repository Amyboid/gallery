import { useEffect, useRef, useState } from "react";
interface CollectionFrameProps {
  nameis: string;
  dateis: string;
}


export default function Collections() {
  const [isFormVisible, setisFormVisible] = useState(false)
  const [isCollectionsVisible, setisCollectionsVisible] = useState(false)
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [collections, setCollections] = useState([{}]);

  function OpenForm() {
    setisFormVisible(true)
  }
  function closeForm() {
    setisFormVisible(false)
    setName("")
    setDate("")
  }
  function createCollection(e: any) {
    e.preventDefault();
    console.log('name', name);
    console.log('date', date);
    const newCollection = {
      "name": name,
      "date": date
    }
    setCollections((prev) => [...prev, newCollection])
    setName("")
    setDate("")
    setisFormVisible(false)
    setisCollectionsVisible(true)


  }

  function CollectionFrame({ nameis, dateis }: CollectionFrameProps) {
    return (
      <>
        <div className="collection-frame"> 
          <h2>{nameis}</h2>
          <div>{dateis}</div>
        </div>
      </>
    )
  }
  function NewCollection() {
    return (
      <>
        <p>You have no collections</p>
        <button className="create-btn" onClick={OpenForm}>+ Create New</button>
      </>
    )
  }
  function FormElement() {
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
            <input ref={nameInputRef} value={name} type="text" required onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="date">
            <label htmlFor="date" >Date</label>
            <input value={date} type="date" name="" id="" required onChange={(e) => setDate(e.target.value)} />
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
          isCollectionsVisible && collections.map((i, key) => Object.keys(i).length != 0 ? <CollectionFrame key={key} nameis={i.name} dateis={i.date} /> : "")
        }
        <div className="create-col">
          {!isCollectionsVisible && !isFormVisible && <NewCollection />}
          {isFormVisible && <FormElement />}
        </div>
      </div>
    </div>
  )
}
