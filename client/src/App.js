import React, { Fragment, useState, useEffect } from 'react';
import Modal from 'react-modal'

function App() {
  const [file, setFile] = useState(null)
  const [imageList, setImageList] = useState([])
  const [listUpdate, setListUpdate] = useState(false)
  const [modalOpen, setmodalOpen] = useState(false)

  const [currentImage, setCurrentImage] = useState(null)

  useEffect(() => {

    Modal.setAppElement('body')

    fetch('http://localhost:9000/images/get')
    .then(res => res.json())
    .then(res => setImageList(res))
    .catch(err => {
      console.error(err)
    })
    setListUpdate(false)
  }, [listUpdate])

  const selecterHandler = e => {
    setFile(e.target.files[0])
  }
  const sendHandler = () => {
    if(!file) {
      alert('You must upload file')
      return
    }
    
    const formdata = new FormData()

    formdata.append('image', file)

    fetch('http://localhost:9000/images/post', {
      method: 'POST',
      body: formdata
    })
    .then(res => res.text())
    .then(res => {
      console.log(res)
      setListUpdate(true)
    })
    .catch(err => {
      console.error(err)
    })

    document.getElementById('fileinput').value = null

    setFile(null)
  }

  const modalHandler = (isOpen, image) => {
      setmodalOpen(isOpen)
      setCurrentImage(image)
  }

  const deleteHandler = () => {
    let imagenID = currentImage.split('-')

    imagenID = parseInt(imagenID[0])
    
    fetch('http://localhost:9000/images/delete/' +  imagenID, {
      method: 'DELETE'
    })
    .then(res => res.text())
    .then(res => console.log(res))
    setmodalOpen(false)
    setListUpdate(true)
  }

  return (
    <Fragment>
      <nav className = "navbar navbar-dark bg-dark">
        <div className = "container">
          <a href = "#!" className = "navbar-brand">Image App</a>
        </div>
      </nav>

      <div className = "container mt-2">
        <div className = "card p-4">
          <div className = "row">
            <div className = "col-10">
              <input id = "fileinput" onChange = {selecterHandler} className = "form-control" type = "file"/>
            </div>
            <div className ="col-2">
                <button onClick = {sendHandler} type ="button" className ="btn btn-primary mt-1 col-12">Upload</button>
            </div>
          </div>     
        </div>
      </div>

      <div 
      className = "container mt-3"
      style = {{display: "flex", flexWrap: "wrap"}}
      >
        {
          imageList.map(image => (
            <div key = {image} className = "card">
                <img 
                src = {'http://localhost:9000/' + image} 
                alt = "imagen" 
                className = "card-img-top m-1"
                style = {{height: "200px", width: "300px"}}
                />

                <div className = "card-body">
                  <button onClick = {() => modalHandler(true, image)} className = "btn btn-dark">
                    Click to view
                    </button>
                </div>
            </div>
          ))
        }
        
      </div>

      <Modal style = {{ content: {right: "20%", left: "20%"} }} isOpen = {modalOpen} onRequestClose = {() => modalHandler(false, null)}>
        <div className = "card">
          <img src = {'http://localhost:9000/' + currentImage} alt = "image"/>
          <div className = "card-body">
                  <button onClick = {() => deleteHandler()} className = "btn btn-danger">
                    Delete
                  </button>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}

export default App;

