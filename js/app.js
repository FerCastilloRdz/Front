//Apartado para variables y constantes globales
const users = document.getElementById('users')
const templateUser = document.getElementById('template-user').content
const fragment = document.createDocumentFragment()
const btnSave = document.getElementById('btnSave')
let idUpdate = null
//Eventos de mi pagina 
document.addEventListener('DOMContentLoaded',() => {
    loadData()
})

btnSave.addEventListener('click', (e) => {
    e.preventDefault()
    sendData()
})


const sendData = () => {
    const firstname = document.getElementById('firstname').value
    const lastname = document.getElementById('lastname').value
    const address = document.getElementById('address').value
    const phone = document.getElementById('phone').value
    const city = document.getElementById('city').value
    const cp = document.getElementById('zipcode').value

    if(firstname.trim().lenght !== 0 && lastname.trim().lenght !== 0) {
        const obj = {
            firstname,
            lastname,
            address,
            phone,
            city,
            cp
        }

        fetch('http://localhost:9000/create', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }).then(async(res) => {
            const result = await res.json()
            if(result.msg === 'success') {
                loadData()
            }
            console.log('$$ result => ', result)
        }).catch((error) => {
            console.log('$$error => ', error)
        })
    }
}
const loadData = async() => {
    const data = await fetch('http://localhost:9000/')
    const usuarios = await data.json()
    if (usuarios.msg == 'success'){
        drawUsers(usuarios.data)
    }
}



const drawUsers = (items) => {
    users.innerHTML = ''
    items.forEach((user) => {
        const clone = templateUser.cloneNode(true)
        clone.querySelectorAll('th')[0].textContent = user.firstname
        clone.querySelectorAll('th')[1].textContent = user.lastname
        clone.querySelectorAll('th')[2].textContent = user.address
        clone.querySelectorAll('th')[3].textContent = user.phone
        clone.querySelectorAll('th')[4].textContent = user.city
        clone.querySelectorAll('th')[5].textContent = user.cp
        clone.querySelector('.btn-danger').dataset.id = user.id
        clone.querySelector('.btn-warning').dataset.id = user.id

        //crear evento para borrar
        const btnDelete = clone.querySelector('.btn-danger')
        btnDelete.addEventListener('click', () => {
            console.log('$$ espero funcione => ', btnDelete.dataset.id)
            deleteUser(btnDelete.dataset.id)
            window.location.replace('/')
        }) 

         // Crear btn para actualizar
        // const btnUpdate = clone.querySelector('.btn-warning');
        // btnUpdate.addEventListener('click', () => {
        //     idUpdate = btnUpdate.dataset.id;
             //window.location.replace(`/update-user.html?id=${idUpdate}`);
        //     window.location = (`http://localhost:5050/update-user.html?id=${idUpdate}`);

         //crear evento para actualizar
        const btnUpdate = clone.querySelector('.btn-warning')
        btnUpdate.addEventListener('click', () => {
            idUpdate = btnUpdate.dataset.id
            window.location.replace(`/update-user.html?id=${idUpdate}`)
        })

        
        fragment.appendChild(clone)
    })
    users.appendChild(fragment)
}


const deleteUser = async (id) => {
    console.log('$$$ id => ', id)
    const res = await fetch(`http://localhost:9000/delete/${id}`)
    const result = await res.json()
    if (result.msg === 'user deleted') {
        loadData()
    }
    //console.log('$$ result => ', result)
}

//const deleteUser = async (id) => {
//    const res = await fetch(`http://localhost:5000/delete/${id}`);
//    const result = await res.json();
//    console.log('@@@ result => ', result);
//    if (result.msg === 'user deleted'){
//        loadData();
//    }

//}