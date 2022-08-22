const modal =  document.querySelector(".modal-overlay")


const openModal = () => modal.classList.add("active");
const closeModal = () => modal.classList.remove("active");


document.addEventListener("click", e =>{

    if(e.target.matches(".button.new")){
        openModal()
    }
    
    if(e.target.matches(".button.cancel")){
        closeModal()
    }
})