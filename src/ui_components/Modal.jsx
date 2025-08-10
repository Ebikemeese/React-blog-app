import React from 'react'

const Modal = ({children, toggleModal}) => {

  function handleToggleModal(e){
    if(e.target.id === "modal") {
      toggleModal()
    }
  }

  return (
    <div id="modal" className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50 h-s" onClick={handleToggleModal}>
        {children}
    </div>
  )
}

export default Modal