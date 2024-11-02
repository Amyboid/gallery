import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Form from "./Form";
import { Link } from "wouter";
import {
  collectionAtom,
  isCollectionsVisibleAtom,
  testDataAtom,
} from "../src/context";
import { useAtom } from "jotai";

interface CollectionFrameProps {
  nameis: string;
  dateis: string;
  bg: string;
  id: number;
  imgId: string;
  ondelete: (id: number, imgId: string) => void;
}
interface NewCollectionPromptProps {
  onclicks: () => void;
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
        <Link href={`upload/${id}`}>
          <div className="frame-hero"></div>
        </Link>

        <div className="frame-footer">
          <span className="name-is">{nameis}</span>
          <span className="date-is">{dateis}</span>

          <svg
            id="delete-col"
            onClick={() => ondelete(id, imgId)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M21.03 3L18 20.31c-.17.96-1 1.69-2 1.69H8c-1 0-1.83-.73-2-1.69L2.97 3zM5.36 5L8 20h8l2.64-15zM9 18v-4h4v4zm4-4.82L9.82 10L13 6.82L16.18 10z"
            />
          </svg>
        </div>
      </div>
    </>
  );
}

function NewCollectionPrompt({ onclicks }: NewCollectionPromptProps) {
  return (
    <>
      <p>You have no collections</p>
      <button className="create-btn" onClick={() => onclicks()}>
        + Create New
      </button>
    </>
  );
}

export default function Coll() {
  // const [collection, setCollection] = useState<CollectionProps[]>([]);
  // const [isCollectionsVisible, setisCollectionsVisible] = useState(true);
  const [isFormVisible, setisFormVisible] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [collectionError, setCollectionError] = useState("");
  const [loading, setLoading] = useState(false);

  const [_, setTestData] = useAtom(testDataAtom);
  const [collection, setCollection] = useAtom(collectionAtom);
  const [isCollectionsVisible, setisCollectionsVisible] = useAtom(
    isCollectionsVisibleAtom
  );

  const storeTestdata = (data: any) => {
    const array = data.reduce((array: any, current: any) => {
      if (!array.includes(current.id.toString())) {
        array.push(current.id.toString());
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
      setCollection([...data]);
      console.log("voy", collection);
    } catch (error) {
      console.log("errr:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      fetchData();
    }, 100);
  }, []);

  useEffect(() => {
    const ddd = storeTestdata(collection);
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
    setCollection(collection.filter((item) => item.id !== id));
    const galleryFolder = collection.map((item) => {
      if (item.id == id) {
        return item.galleryFolder;
      }
    });
    axios.delete("http://localhost:8080/deleteData", {
      data: { id, imgId, galleryFolder },
    });
  }

  return (
    <div className="collection-box">
      <header className={loading ? "loading" : ""}>
        <span>
          Collections
          <p className={isBlinking ? "blink" : ""}>{collectionError}</p>
        </span>

        <button onClick={OpenForm}>+ Create New</button>
      </header>
      <div className="collections">
        {isCollectionsVisible &&
          collection.map((item) => (
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
          {!isCollectionsVisible && !isFormVisible && (
            <NewCollectionPrompt onclicks={OpenForm} />
          )}
          {isFormVisible && (
            <Form
              setLoading={setLoading}
              setIsBlinking={setIsBlinking}
              setCollectionError={setCollectionError}
              setisFormVisible={setisFormVisible}
            />
          )}
        </div>
      </div>
    </div>
  );
}
