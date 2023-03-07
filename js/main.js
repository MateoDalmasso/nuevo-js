const grupoCartas = document.getElementById('grupoCartas')
const precioTotal = document.getElementById('precioTotal')
const tablaBody = document.getElementById('tablaBody')

let carrito = []

const solicitarProductos = async () =>{

    const respuesta = await fetch('api.json')
    const data = await respuesta.json()
    
    mostrarProductos(data)

}

// Solicito productos y los muestro por pantalla
solicitarProductos()

document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault();
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito')) || [] 
        actualizarCarrito();
    }
    
})

function mostrarProductos(data) {
    
    data.forEach( producto => {
        grupoCartas.innerHTML += `<div class="card text-center">
        <img src="${producto.foto}" class="card-img-top" alt="..." >
        <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">$${producto.precio}</p>
        </div>
        <div class="card-footer bg-white">
            <a id="agregar${producto.id}" href="#" class="btn ">Comprar</a>
        </div>
    </div>`;
    })

    //Evento para para el boton 'comprar'
    data.forEach(producto => {

        document.getElementById(`agregar${producto.id}`).addEventListener('click', function(){

        const item = data.find( prod => prod.id === producto.id)

        Swal.fire({
            position: 'bottom-end',
            icon: 'success',
            title: producto.nombre + ' agregado al carrito',
            showConfirmButton: false,
            timer: 970
        })

        if(carrito.includes(item)){
            
            item.cantidad++
            
        }else{ 
        carrito.push(item)
        }

        actualizarCarrito();

        })
    })

}

const eliminarDelCarrito = (prodID) => {
    const item = carrito.find((prod)=> prod.id === prodID) 
    const indice = carrito.indexOf(item)

    Swal.fire({
        position: 'bottom-end',
        icon: 'error',
        title: item.nombre + ' eliminado del carrito',
        showConfirmButton: false,
        timer: 970
    })
    
    item.cantidad--;

    if(item.cantidad == 0){
        item.cantidad = 1 
        carrito.splice(indice,1)
    }

    actualizarCarrito();

}


const actualizarCarrito = () => {
    
    precioTotal.innerHTML = `<button onclick="pagarTodo(${carrito.reduce((acc,prod) => acc + (prod.precio*prod.cantidad), 0)})" class="btn px-5"> Pagar Todo
                                <span  class="badge  text-white ms-1 rounded-pill">${carrito.reduce((acc,prod) => acc + (prod.precio*prod.cantidad), 0)}</span>
                            </button>
                            `

    tablaBody.innerHTML = ``
    
    carrito.forEach( (producto ) => { 
        tablaBody.innerHTML+=`
        <tr>
            <td > <button onclick="eliminarDelCarrito(${producto.id})"  class="btn"> <i class="bi bi-trash3-fill"> </i> </button> </td>
            <td >${producto.nombre} <span id="cantidad">x${producto.cantidad} </span> </td>
            <td >$ ${producto.precio*producto.cantidad}</td>
        </tr>
        `;

        localStorage.setItem('carrito', JSON.stringify(carrito))
    })
    
}


const pagarTodo = async (precio)=>{
    if(precio==0){ 
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No hay productos en el carrito',
            
        })
    }else{ 
        const correo = await Swal.fire({
            title: 'Ingresa tu correo',
            input: 'email',
            inputPlaceholder: 'correo@ejemplo.com',
            
        })
        
        if (correo.value) {
            Swal.fire('Muchas Gracias!',
            `Se ha enviado un mail a ${correo.value} con los detalles de la misma`
            )
        }else{
            Swal.fire('Usted no ha ingresado ningun correo')
        }
        
    reset()

    
    }

}


const reset = () =>{
    
    carrito.splice(0,carrito.length)
    
    tablaBody.innerHTML =''

    document.querySelector('.badge').innerText=0

    localStorage.setItem('carrito', JSON.stringify(carrito))
    

}


