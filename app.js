const modal =  document.querySelector(".modal-overlay");
const form = document.querySelector("form");

const openModal = () => modal.classList.add("active");
const closeModal = () => modal.classList.remove("active");



const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}


const Transation = {

    all: Storage.get(),
    
    add(transaction){
        Transation.all.push(transaction)  
        App.reload()
    },

    remove(index){
         Transation.all.splice(index,1)

         App.reload()
    },
    
    incomes(){
        let income = 0;


        Transation.all.forEach(transaction =>{
            if(transaction.amount > 0){
                income += transaction.amount
            }

        })

        return income;
      
    },
    expenses(){
        let expense = 0;
        Transation.all.forEach(transaction =>{
            if(transaction.amount < 0){
                expense += transaction.amount
            }
        })

        return expense;
    },
    total(){
        return Transation.incomes() + Transation.expenses()
    }
}


const DOM = {

    transactionsContainer : document.querySelector("#data-table tbody"),
 

    addTransaction(transaction,index){

        const tr = document.createElement("tr");
        tr.innerHTML = DOM.innerHTMLTransaction(transaction);
        tr.dataset.index = index;

        DOM.transactionsContainer.appendChild(tr)

    },

    innerHTMLTransaction(transaction,index){

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class=${CSSclass}>${amount}</td>
            <td class="date">${transaction.date}</td>
            <td >
                <img onclick="Transation.remove(${index})"   src="./assets/minus.svg" alt="remove transactions"  id="icon-revome">
            </td>
        `
        return html
    },

    updateBalance(){
        document.querySelector(".incomeDisplay").textContent =Utils.formatCurrency(Transation.incomes())

        document.querySelector(".expenseDisplay").textContent =Utils.formatCurrency( Transation.expenses())

        document.querySelector(".totalDisplay").textContent = Utils.formatCurrency(Transation.total())

    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }

}

const Utils ={
    formatCurrency(value){
        const singnal = Number(value) < 0 ? "-" :  ""

        value = String(value).replace(/\D/g, "")
        value = Number(value) /100

        value = value.toLocaleString("fr-FR",{
            style : "currency",
            currency: "EUR"
        })

        return singnal + value 
    },
    formatAmount(value){
        value = Number(value) * 100; 
        return value;
    },
    formatDate(date){
        const splitDate = date.split("-");
        return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`
    }
}



const Form = {
    validateFields(formData){
        const {description,amount,date} = formData;

        if(!description.trim() || !amount.trim() || !date ){
            throw new Error("Vous devez remplir les champs");
        }

    },
    formatValues(formData){
        let {description,amount,date} = formData;
        amount = Utils.formatAmount(amount) 
        date = Utils.formatDate(date)

        return{
            description,
            amount,
            date
        }
    },
    
    submit(){
        form.addEventListener("submit", e =>{
            e.preventDefault()
          
            let formData = {
                description : document.querySelector("#description").value,
                amount:  document.querySelector("#amount").value,
                date : document.querySelector("#date").value,
            }

            const clearFields = ()=>{
                document.querySelector("#description").value = ""
                document.querySelector("#amount").value = ""
                document.querySelector("#date").value = ""
              }


            try {
            Form.validateFields(formData)
             const transaction =  Form.formatValues(formData)
            Transation.add(transaction)
            clearFields()
            closeModal()

            } catch (error) {
                console.log(error.message)
                
            }
            
        }) 
    },

   
}

Form.submit()

const App = {
    init(){
        Transation.all.forEach(DOM.addTransaction)
        DOM.updateBalance()

        Storage.set(Transation.all)
    },
    reload(){
        DOM.clearTransactions()
        App.init()
    }
}

App.init()


document.addEventListener("click", e =>{

    if(e.target.matches(".button.new")){
        openModal()
    }
    
    if(e.target.matches(".button.cancel")){
        closeModal()
    }


})














