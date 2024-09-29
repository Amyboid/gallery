import Coll from "../../components/Coll"  

export default function Home() {

  const navUrl = ['Collections', 'Settings']

  return (
    <div className="container">
      <div className="nav">
        <header>FrameNest</header>
        <div className="nav-links">
          {
            navUrl.map((e,i) => (
              <a href="" key={i}>{e}</a>
            ))
          }
        </div>
      </div>
      <div className="upload">  
        <Coll></Coll>
      </div>
    </div>
  )
}
