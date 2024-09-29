import axios from 'axios';
import { useEffect, useState } from 'react'

interface FormProps {
  collection:any,
  setCollections: Function,
  setLoading: Function,
  setIsBlinking: Function,
  setisFormVisible: Function,
  setCollectionError: Function,
  setisCollectionsVisible: Function;
}
export default function Form({ setLoading, setIsBlinking, setCollectionError, setisFormVisible, setCollections, setisCollectionsVisible }: FormProps) {

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  // const [bg, setBg] = useState("")
  const [imgId, _] = useState("")
  const [bg, setBg] = useState<File | null>(null)

  const [formError, setFormError] = useState("")

  useEffect(() => {
    if (name || date || bg) {
      setFormError("");
    }
  }, [name, date, bg])



  function closeForm() {
    setisFormVisible(false)
    setName("")
    setDate("")
    setisCollectionsVisible(true)
  }

  function errorBlink(err: any) {
    setCollectionError("Error: " + err)
    setIsBlinking(true);
    setTimeout(() => {
      setIsBlinking(false);
      setCollectionError('')
    }, 5000);
  }

  function createCollection(e: any) {
    setLoading(true) 
    e.preventDefault();
    const newCollection = {
      name: name,
      date: date,
      bg: bg,
      imgId: imgId
    }

    // console.log(newCollection)

    if (!name || !date || !bg) {
      setFormError('provide all data correctly');
      return;
    }
    else {
      setFormError("")
    }
    const maxFileSize = 2 * 1024 * 1024;

    if (bg) {
      if (bg.size > maxFileSize) {
        let err = "Background size should be less than 2 mb"
        errorBlink(err);
      }

      const formdata = new FormData() 
      formdata.append('file', bg)
      console.log('basss: ',formdata);
      axios.post('http://localhost:8080/storebackground', formdata, {
        headers: {
          "Content-Type": 'multipart/form-data'
        }
      }).then(res => {
        if (res.data.error) {
          errorBlink(res.data.error)
        }
        else {
          setCollectionError("")
          newCollection.bg = res.data.url

          newCollection.imgId = res.data.imgId
          // console.log('klurl', newCollection.bg, res.data.imgId);

          axios.post('http://localhost:8080/storedata', newCollection)
            .then((res) => {
              setLoading(false)
              
              setCollections((prev: any) => [...prev, res.data[0]]
              )
            })
            .catch((error) => {
              console.log('post error: ', error);
            })

        }
      }
      ).catch(_err => {
        console.log("server error 🐦‍🔥");
      })
    }


    setName("")
    setDate("")
    setisFormVisible(false)
    setisCollectionsVisible(true)

  }

  return (
    <>
      <button className="close-btn" onClick={closeForm}>X</button>
      <form className="creation-form" onSubmit={createCollection}>
        <div className="name">
          <label htmlFor="name">Collection Name</label>
          <input placeholder='type name ...' type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="date">
          <label htmlFor="date" >Date</label>
          <input value={date} type="date" onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="photo">
          <label htmlFor="photo" >Choose photo</label>

          <input id="phoo" accept="image/*" type="file" required onChange={(event) => {
            if (!event.target.files) return;
            setBg(event.target.files[0]);
          }} />


        </div>
        <button className="submit-btn" type="submit">Create</button>
        <div className="form-error">{formError}</div>
      </form>
    </>
  )
}
