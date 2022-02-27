if (localStorage.cadastros == undefined) {localStorage.cadastros = 0}
var idE = '';
var htmlMesAtual = ''
data = new Date();
const maise = document.getElementById('mais')
mesAtual = data.getMonth()
mes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
var descricao, valor, parcelas, idElemento, conclused;
var total = 0
var totalPago = 0
var totalaPagar = 0
var poderGasto = 0;
contas = []
var result;

function inicio(){
    atualizaDados();
    upaStorage();
    carregaRegistros();
    getValues()
    puxaSalario()
}
function atualizaDados() {
    eMes = mesAtual % 12
    eAno = data.getFullYear() + parseInt((mesAtual / 11).toString().split(".")[0])
    document.getElementById('mesAno').innerText = mes[eMes].toUpperCase() + " - " + eAno
}
function getValues(){
    result = new Map()
    get = window.location.href.split('?')[1]
    if (get != undefined){  
        for (let e of get.split('&')){
            aray = e.split('=')
            key = aray[0]
            value = aray[1]
            result.set(key, value);
        }
        console.log(result)
        save()
    }
}
function upaStorage(){
    if(localStorage.contas != undefined){
        contas = JSON.parse(localStorage.contas)
    }
}
function salvaStorage(){
    var emString = JSON.stringify(contas)
    localStorage.contas = emString
    window.location.href = window.location.href.replace(window.location.search, '')
}
function pegaValores(exist) {
    descricao = decodeURI(result.get('descricao')).replace('+', ' ');
    descricao = descricao.toUpperCase();
    valor = result.get('valor')
    valor = parseFloat(valor)
    tipo = result.get('tipo')
    if(result.get('idElemento') != undefined){
        idElemento = result.get('idElemento')
    }
    if (exist) {
        parcelas = result.get('parcelas')
        parcelas = parseInt(parcelas)
    }
}
const avancaMes = function () {
    mesAtual++
    atualizaDados()
    carregaRegistros()
}
const recuaMes = function () {
    if (mesAtual != 0) {
        mesAtual--
    }
    atualizaDados()
    carregaRegistros()
}
function openB() {
    window.location.href = './form.html'
}
function openO() {
    document.getElementById(idE).style.backgroundColor = '#a3f8f1'
    document.getElementById('menumes').style.display = 'none'
    document.getElementById('opcoes').style.display = 'block'
    document.getElementById('restoTela').style.marginTop = '20vh'
    document.getElementById('restoTela').addEventListener('click', closeO)
}
function closeO() {
    if (idE != ''){
        document.getElementById(idE).style.backgroundColor = '#D9D9D9'
    }
    document.getElementById('menumes').style.display = 'block'
    document.getElementById('opcoes').style.display = 'none'
    document.getElementById('restoTela').style.marginTop = '0vh'
    document.getElementById('restoTela').removeEventListener('click', closeO)
}
function start (el) {
    if (idE != '') {
        document.getElementById(idE).style.backgroundColor = '#D9D9D9'
    }
    idE = el.id
    timeout = window.setTimeout(openO, 500);
}
function end () {
    window.clearTimeout(timeout);
}
function alerta() {
    alert(("foi").toUpperCase)
}
function carregaRegistros() {
    htmlMesAtual = ''
    arrei = contas[mesAtual]
    if (arrei != undefined){ 
        for (e of Object.entries(arrei)){
            thisColor = e[1].concluido ? 'style="color: rgb(5, 95, 117)"' : ''
            htmlMesAtual += '\n                    <div class="contas" id="' + e[1].id + '"  ontouchstart="start(this)" onmousedown="start(this)" ontouchend="end()" onmouseup="end()">\n                        <span class="fa-solid fa-circle-check checkar"' + thisColor + ' onclick="concluir()"></span>\n                        <span class="desc">' + e[1].descricao + '</span>\n                        <span class="valorDesc">R$ ' + parseFloat(e[1].valor).toFixed(2) + '</span>\n</div>\n                '
        }
    }
     document.querySelector('#contas').innerHTML = htmlMesAtual;
     calcula()
}

/*----------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------
-----------------------------------------------------------------------------------------------------------------*/
function save() {
    
    existe = result.get('parcelas') != ''
    pegaValores(existe)
    if (idElemento == undefined || idElemento == ""){
        localStorage.cadastros++
        idDado = 'dado' + localStorage.cadastros
    } else {
        idDado = idElemento

    }
    if (contas[mesAtual] == undefined) {
        contas[mesAtual] = new Object()
    }
    mapaAtual = new Object()
    if (contas[mesAtual][idDado] != undefined){
        conclused = contas[mesAtual][idDado].concluido
    } else {
        conclused = false
    }
    mapaAtual = {'id' : idDado, 'descricao': descricao, 'valor' : valor, 'concluido' : conclused, 'tipo' : tipo}
    if (tipo == 'parcela'){
        mapaAtual.parcelas = parcelas
        ultimo = mesAtual + parseInt(parcelas)
        for(x = mesAtual; x < ultimo; x++){
            if (contas[x] == undefined) {
                contas[x] = new Object()
            }
            contas[x][idDado] = mapaAtual
        }
    } else {
        contas[mesAtual][idDado] = mapaAtual
    }
    salvaStorage()
    carregaRegistros()
}
function deletar() {
    delete contas[mesAtual][idE]
    salvaStorage()
    idE = ''
    closeO()
    carregaRegistros()
}
function concluir(){
    if (!contas[mesAtual][idE].concluido){
        contas[mesAtual][idE].concluido = true
    } else {
        contas[mesAtual][idE].concluido = false
    }
    salvaStorage()
    carregaRegistros()
}
function editar(){
    window.location.href = './form.html' + '?tipo=' + contas[mesAtual][idE].tipo + '&descricao=' + contas[mesAtual][idE].descricao + '&valor=' + contas[mesAtual][idE].valor + '&parcelas=' + contas[mesAtual][idE].parcelas + '&id=' + idE + '&concluido=' + contas[mesAtual][idE].concluido
}
function puxaSalario(){
    if (localStorage.salario == undefined){
        localStorage.salario = 0.00
        document.querySelector('#salario').value = '0.00'
    } else {
        document.querySelector('#salario').value = (parseFloat(localStorage.salario)).toFixed(2);
    }
}
function seila(){
    vai = (parseFloat((document.querySelector('#salario').value).replace('.', '').replace(',', '.'))).toFixed(2)
    document.querySelector('#salario').value = vai
    localStorage.salario = vai
    calcula()
    document.querySelector('#salario').removeEventListener('focusout', seila)
}
function salario(){
    cont = 0
    document.querySelector('#salario').addEventListener('focusout', seila)
}


function calcula(){
    total = 0
    totalPago = 0
    totalaPagar = 0
    poderGasto = 0;
    arrei = contas[mesAtual]
    if (arrei != undefined){ 
        for (e of Object.entries(arrei)){
            if(e[1].concluido){
                totalPago += parseFloat(e[1].valor)
            } else {
                totalaPagar += parseFloat(e[1].valor)
            }
            total += parseFloat(e[1].valor)
        }
    }
    poderGasto = parseFloat(localStorage.salario) - total
    document.querySelector('#total').innerText = '' + total;
    document.querySelector('#pago').innerText = '' + totalPago;
    document.querySelector('#pagar').innerText = '' + totalaPagar;
    document.querySelector('#poder').innerText = '' + poderGasto;
}


function startBackup (el) {
    if (idE != '') {
        document.getElementById(idE).style.backgroundColor = '#D9D9D9'
    }
    idE = el.id
    timeout = window.setTimeout(backup, 10000);
}
function endBackup () {
    window.clearTimeout(timeout);
}
function backup(){
    alert("backup copiado!")
    document.querySelector('#InputBackup').value = localStorage.contas
    let textoCopiado = document.querySelector('#InputBackup');
    textoCopiado.select();
    textoCopiado.setSelectionRange(0, 99999)
    document.execCommand("copy");
}














document.querySelector('#salario').addEventListener('focus', function(){
    vai = (document.querySelector('#salario').value).replace(',', '')
    vai = vai.toString();
    vai = vai.split('.')
    document.querySelector('#salario').value = vai[0]
})