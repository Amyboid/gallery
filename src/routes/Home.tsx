import Collections from "../../components/Collections"

 

export default function Home() {

  const navUrl = ['Collections', 'Settings']

  return (
    <div className="container">
      <div className="nav">
        <header>Gallery</header>
        <div className="nav-links">
          {
            navUrl.map((e,i) => (
              <a href="" key={i}>{e}</a>
            ))
          }
        </div>
      </div>
      <div className="upload">
        <Collections></Collections>
      </div>
    </div>
  )
}
