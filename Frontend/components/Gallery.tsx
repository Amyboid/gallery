import { useEffect } from "react";
import { useParams } from "wouter";
import { useAtom } from "jotai";
import { collectionAtom, testDataAtom } from "../src/context";

export default function Gallery() {
  const [testData, _] = useAtom(testDataAtom);
  const [collection] = useAtom(collectionAtom);

  useEffect(() => {
    console.log("testdata", testData);
  }, [testData]);

  const params = useParams();
  console.log("params,testdata", params.collId, testData);

  if (testData && params.collId) {
    console.log(testData.includes(params.collId));
    if (testData.includes(params.collId)) {
      return (
        <>
          {/* {collection.map((item) => {
            if (item.id.toString() === params.collId) {
              return (
                <>
                  <span style={{ display: "block" }}>{item.name}</span>
                  <span style={{ display: "block" }}>{item.id}</span>
                  <span style={{ display: "block" }}>{item.date}</span>
                </>
              );
            }
          })} */}

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
                        {/* <span></span> */}
                    </div>
                  );
                }
              })}
            </div>
            <div className="g-photos-box">
              <div className="g-photos-nav">
                <button className="g-create-btn">
                  + Upload photo
                </button>
              </div>
              <div className="g-photos"></div>
            </div>
          </div>
        </>
      );
    }
  } else {
    return <span>No collection found</span>;
  }
}
