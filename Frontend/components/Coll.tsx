import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Form from "./Form";
import { Link } from "wouter"; 
import { testDataAtom } from "../src/context";
import { useAtom } from "jotai";

interface CollectionFrameProps {
  nameis: string;
  dateis: string;
  bg: string;
  id: number;
  imgId: string;
  ondelete: (id: number, imgId: string) => void;
}

interface CollectionProps {
  id: number;
  name: string;
  date: string;
  bg: string;
  imgId: string;
}

export default function Coll() {
  const [isFormVisible, setisFormVisible] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isCollectionsVisible, setisCollectionsVisible] = useState(true);
  const [collectionError, setCollectionError] = useState("");
  const [collection, setCollections] = useState<CollectionProps[]>([]);
  const [loading, setLoading] = useState(false);

  const [_, setTestData] = useAtom(testDataAtom);
  const storeTestdata = (data: any) => {
    const array = data.reduce((array: any, current: any) => {
      if (!array.includes(current.name)) {
        array.push(current.name);
      }
      return array;
    }, []);
    return array;
  };
  const fetchData = async () => {
    const res = await axios.get("http://localhost:8080/getdata");
    try {
      setLoading(false);
      const data = res.data;
      setCollections([...data]);
    } catch (error) {
      console.log("errr:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      fetchData();
      // storeTestdata
    }, 100);
  }, []);

  useEffect(() => {
    const ddd = storeTestdata(collection);
    // console.log("kl: ", ddd, "gh", collection);
    setTestData([...ddd]);
    if (collection.length >= 1) {
      setisCollectionsVisible(true);
    } else {
      setisCollectionsVisible(false);
    }
  }, [collection]);

  function OpenForm() {
    setisFormVisible(true);
  }

  function handleDelete(id: number, imgId: string) {
    setCollections(collection.filter((item) => item.id !== id));
    axios.delete("http://localhost:8080/deletedata", { data: { id, imgId } });
  }

  function NewCollectionPrompt() {
    return (
      <>
        <p>You have no collections</p>
        <button className="create-btn" onClick={OpenForm}>
          + Create New
        </button>
      </>
    );
  }
  return (
    <div className="collection-box">
      <header className={loading ? "loading" : ""}>
        <span>
          Collections
          <p className={isBlinking ? "blink" : ""}>{collectionError}</p>
        </span>
        {/* <div className="logo"> 
        <svg xmlns="http://www.w3.org/2000/svg" className="logo-1" fill="currentColor" viewBox="0 0 24 24"><path d="M19.5 4.5h-7.319C7.87 4.5 4.5 7.787 4.5 12.031V22H2v-9.969C2 6.487 6.562 2 12.181 2H22v9.969C22 17.512 17.438 22 11.819 22H6.375V11.581a6.26 6.26 0 0 1 6.163-5.206H17v2.5h-4.169c-1.881 0-3.212.781-3.75 2.5H17v2.5H8.875V19.5h2.944c4.312 0 7.681-3.288 7.681-7.531z"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="logo-2" fill="currentColor" viewBox="0 0 24 24"><path d="M19.5 4.5h-7.319C7.87 4.5 4.5 7.787 4.5 12.031V22H2v-9.969C2 6.487 6.562 2 12.181 2H22v9.969C22 17.512 17.438 22 11.819 22H6.375V11.581a6.26 6.26 0 0 1 6.163-5.206H17v2.5h-4.169c-1.881 0-3.212.781-3.75 2.5H17v2.5H8.875V19.5h2.944c4.312 0 7.681-3.288 7.681-7.531z"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="logo-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19.5 4.5h-7.319C7.87 4.5 4.5 7.787 4.5 12.031V22H2v-9.969C2 6.487 6.562 2 12.181 2H22v9.969C22 17.512 17.438 22 11.819 22H6.375V11.581a6.26 6.26 0 0 1 6.163-5.206H17v2.5h-4.169c-1.881 0-3.212.781-3.75 2.5H17v2.5H8.875V19.5h2.944c4.312 0 7.681-3.288 7.681-7.531z"/></svg>
        </div> */}
        <button onClick={OpenForm}>+ Create New</button>
      </header>
      <div className="collections">
        {isCollectionsVisible &&
          collection.map((item) => (
            // <Route path={item.name}>
            // </Route>
            <CollectionFrame
              key={item.id}
              id={item.id}
              imgId={item.imgId}
              bg={item.bg}
              nameis={item.name}
              dateis={item.date}
              ondelete={handleDelete}
            />
          ))}

        <div className="create-col">
          {!isCollectionsVisible && !isFormVisible && <NewCollectionPrompt />}
          {isFormVisible && (
            <Form
              collection={collection}
              setLoading={setLoading}
              setIsBlinking={setIsBlinking}
              setCollectionError={setCollectionError}
              setisCollectionsVisible={setisCollectionsVisible}
              setCollections={setCollections}
              setisFormVisible={setisFormVisible}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function CollectionFrame({
  nameis,
  dateis,
  bg,
  id,
  imgId,
  ondelete,
}: CollectionFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (frameRef.current) {
      frameRef.current.style.backgroundImage = `url(${bg})`;
    }
  }, [bg]);
  return (
    <>
      <div className="collection-frame" ref={frameRef}>
        <Link href={`upload/${nameis}`}>
          <div className="frame-hero"></div>
        </Link>

        <div className="frame-footer">
          <span className="name-is">{nameis}</span>
          <span className="date-is">{dateis}</span>
          <button id="delete-col" onClick={() => ondelete(id, imgId)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="m6.774 6.4l.812 13.648a.8.8 0 0 0 .798.752h7.232a.8.8 0 0 0 .798-.752L17.226 6.4h1.203l-.817 13.719A2 2 0 0 1 15.616 22H8.384a2 2 0 0 1-1.996-1.881L5.571 6.4zM9.5 9h1.2l.5 9H10zm3.8 0h1.2l-.5 9h-1.2zM4.459 2.353l15.757 2.778a.5.5 0 0 1 .406.58L20.5 6.4L3.758 3.448l.122-.69a.5.5 0 0 1 .579-.405m6.29-1.125l3.94.695a.5.5 0 0 1 .406.58l-.122.689l-4.924-.869l.122-.689a.5.5 0 0 1 .579-.406z"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
// function gooBaby() {
//   console.log('not implemented yt');
// }
