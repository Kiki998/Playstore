var localStorage = window.localStorage; //Creamos el LocalStorage
var data; //Variable utilizada para obtener la data de las categorias

//El siguiente código es el encargado de generar la información de prueba. Se recomienda no modificarlo.
var categorias = [];
(()=>{
    //Este arreglo es para generar textos de prueba
    let textosDePrueba=[
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore, modi!",
        "Quos numquam neque animi ex facilis nesciunt enim id molestiae.",
        "Quaerat quod qui molestiae sequi, sint aliquam omnis quos voluptas?",
        "Non impedit illum eligendi voluptas. Delectus nisi neque aspernatur asperiores.",
        "Ducimus, repellendus voluptate quo veritatis tempora recusandae dolorem optio illum."
    ]

    //Genera dinamicamente los JSON de prueba para esta evaluacion,
    //Primer ciclo para las categorias y segundo ciclo para las apps de cada categoria
    let contador = 1;
    for (let i=0;i<5;i++){//Generar 5 categorias
        let categoria = {
            nombreCategoria:"Categoria "+i,
            descripcion:textosDePrueba[Math.floor(Math.random() * (5 - 1))],
            aplicaciones:[]
        };
        for (let j=0;j<10;j++){//Generar 10 apps por categoria
            let aplicacion = {
                codigo:contador,
                nombre:"App "+contador,
                descripcion:textosDePrueba[Math.floor(Math.random() * (5 - 1))],
                icono:`img/app-icons/${contador}.webp`,
                instalada:contador%3==0?true:false,
                app:"app/demo.apk",
                calificacion:Math.floor(Math.random() * (5 - 1)) + 1,
                descargas:1000,
                desarrollador:`Desarrollador ${(i+1)*(j+1)}`,
                imagenes:["img/app-screenshots/1.webp","img/app-screenshots/2.webp","img/app-screenshots/3.webp"],
                comentarios:[
                    {comentario:textosDePrueba[Math.floor(Math.random() * (5 - 1))],calificacion:Math.floor(Math.random() * (5 - 1)) + 1,fecha:"12/12/2012",usuario:"Juan"},
                    {comentario:textosDePrueba[Math.floor(Math.random() * (5 - 1))],calificacion:Math.floor(Math.random() * (5 - 1)) + 1,fecha:"12/12/2012",usuario:"Pedro"},
                    {comentario:textosDePrueba[Math.floor(Math.random() * (5 - 1))],calificacion:Math.floor(Math.random() * (5 - 1)) + 1,fecha:"12/12/2012",usuario:"Maria"},
                ]
            };
            contador++;
            categoria.aplicaciones.push(aplicacion);
        }
        categorias.push(categoria);
    }
    console.log(categorias);

    localStorage.clear();//Limpiamos todos los elementos del localStorage
    //Llenamos el LocalStorage
    for (var i = 0; i < categorias.length; i++) {
        localStorage.setItem(categorias[i].nombreCategoria, JSON.stringify(categorias[i]));
    }
    //Llenamos el select con las categorias del LocalStorage
    for(var i = 0; i < localStorage.length; i++){
        $('#categoria').append(`<option value=${localStorage.key(i).replace(' ', '_')}>${localStorage.key(i)}</option>`);
    }
    data = JSON.parse(localStorage.getItem(localStorage.key(0)));//obtenemos la data del primer elemento del LocalStorage
    generarPantalla();
})();

//Funcion encargada de obtener la data de la categoria seleccionada por el usuario desde el LocalStorage
function cargarApps(){
    data = JSON.parse(localStorage.getItem($("#categoria").val().replace('_', ' ')));//Leemos el LocalStorage
    generarPantalla();
}

//Funcion encargada de crear la pantalla de visualizacion de las aplicaciones
function generarPantalla(){
    $('#apps').html('');
    for (var i = 0; i < data.aplicaciones.length; i++){
        var estrellas = "";
        //Obtenemos las estrellas de cada app
        for (var j = 0; j < data.aplicaciones[i].calificacion; j++)
            estrellas += '<i class="fas fa-star fa-xs"></i>';
        for (var j = data.aplicaciones[i].calificacion; j < 5; j++)
            estrellas += '<i class="far fa-star fa-xs"></i>';
        $('#apps').append(
            `<div class="col-sm-6 col-md-3 col-lg-2">
                    <div class="card" onclick="generarModal(${i})">
                        <img class="card-img-top" src="${data.aplicaciones[i].icono}" >
                        <div class="card-body">
                            ${data.aplicaciones[i].nombre}<br>
                            <label style="font-family: 'Ralewey-Ligth'; font-size: 10pt">
                                ${data.aplicaciones[i].desarrollador}
                            </label><br>
                            <label>
                                ${estrellas}
                            </label>
                        </div>
                    </div>
                </div>`
        );
    }
}

//Funcion encargada de generar el modal de la app
function generarModal(index){
    const app = data.aplicaciones[index];
    var estrellas = "";
    //Obtenemos las estrellas de cada app
    for (var i = 0; i < app.calificacion; i++)
        estrellas += '<i class="fas fa-star fa-xs"></i>';
    for (var i = app.calificacion; i < 5; i++)
        estrellas += '<i class="far fa-star fa-xs"></i>';
    //Verificamos si mostramos el boton de instalar o no
    const boton = !app.instalada ? '<button type="button" class="btn btn-success">Instalar</button>' : '';
    const color = app.calificacion < 3 ? 'red':'green'; //Obtenemos el color a mostrar de las estrellas

    //Obtendremos los comentarios de las apps
    var comentarios = "";
    for (var i = 0; i < app.comentarios.length; i++){
        comentarios += `<div class="col-4">
                            <img src="img/user.webp" style="width: 100%;" class="profile">
                        </div>
                        <div class="col-8">
                            <label style="font-size: 24pt; margin-bottom: 0px">
                                ${app.comentarios[i].usuario}
                            </label><br>
                            <label style="font-family: 'Ralewey-Ligth'; font-size: 10pt; color: #909090; margin-bottom: 0px">
                                ${app.comentarios[i].comentario}
                            </label>
                        </div>`;
    }
    //Ciclo para las imagenes apartir de la segunda, esto es por si se llegara a tener mas de 3 para no hacer HardCode
    var imagenes = "";
    for (var i = 1; i < app.imagenes.length; i++){
        imagenes += `<div class="carousel-item">
                        <img class="d-block w-100" src="${app.imagenes[i]}">
                    </div>`
    }
    $('#modalApp').html(
        `<div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="container col-12">
                        <div class="row">
                            <div class="col-4">
                                <img src="${app.icono}" style="width: 100%">
                            </div>
                            <div class="col-8">
                                <label style="font-size: 24pt; margin-bottom: 0px">
                                    ${app.nombre}
                                </label><br>
                                <label style="font-family: 'Ralewey-Ligth'; font-size: 10pt; color: #909090; margin-bottom: 0px">
                                    ${app.desarrollador}
                                </label><br>
                                <label style="font-family: 'Ralewey-Ligth'; font-size: 14pt;">
                                    ${app.descripcion}
                                </label><br>
                            </div>
                            <div class="col-12">
                                <hr>
                                    <center style="color: ${color};">${estrellas}</center>
                                <hr>
                            </div>
                        </div>
                        <div>
                            <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                                <div class="carousel-inner">
                                    <div class="carousel-item active">
                                        <img class="d-block w-100" src="${app.imagenes[0]}" alt="First slide">
                                    </div>
                                    ${imagenes}
                                </div>
                                <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Previous</span>
                                </a>
                                <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Next</span>
                                </a>
                            </div>
                        </div>
                        <hr>
                        <div class="row">
                            ${comentarios}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-danger" onclick="eliminarApp(${index})">Eliminar</button>
                    ${boton}
                </div>
            </div>
        </div>`
    );
    $('#modalApp').modal('show');
}

function eliminarApp(index){
    data.aplicaciones.splice(index, 1);
    localStorage.setItem(data.nombreCategoria, JSON.stringify(data));
    $('#modalApp').modal('hide');
    generarPantalla();
}