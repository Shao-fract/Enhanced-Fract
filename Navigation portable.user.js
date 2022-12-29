// ==UserScript==
// @name         Navigation portable
// @version      1.0
// @description  Navigation pour portable
// @author       Ce connard de Shao
// @match        https://v8.fract.org/
// @match        https://v8.fract.org/index.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fract.org

// ==/UserScript==

//facteur de diminution
let scale=1.5;

//constantes des scripts de kv ça gère les  coordonnées des clics
g_mapRowShiftTop  = 38/scale; // Y-Shift between two rows in a map
g_mapRowShiftLeft = 64/scale; // X-Shift between two rows in a map
g_mapImageHeight  = 76/scale;
g_mapImageWidth   = 128/scale;
g_mapSquareWidth  = g_mapRowShiftLeft*2;
g_mapSquareHeight = g_mapRowShiftTop
g_mapWidth=g_mapWidth/scale
g_mapHeight=g_mapHeight/scale

//recup une autre page et retourne le text
async function ficheperso(url) {
    let response= await fetch(url)
    let f= response.text();
  return f;
}

// On va chercher la map et on divise sa taille par scale
let placeHolder=document.getElementById('MapPlaceHolder');
let width=Number(placeHolder.style.width.split('px')[0])/scale;
placeHolder.style.width=width;
let mask=document.getElementById('MapClickMask');
mask.style.top=30;
mask.style.zIndex=4;
mask.style.height=Number(mask.style.height.split('px')[0])/scale;
mask.style.width=Number(mask.style.width.split('px')[0])/scale;
let target=document.getElementById('MapTargetHex');
target.getElementsByTagName('img')[0].style.width=128/scale;

let HexMap=document.getElementsByClassName('MapRow');
for (let row of HexMap){
    let left=row.style.left;
    row.style.left=Number(row.style.left.split('px')[0])/scale
    row.style.top=Number(row.style.top.split('px')[0])/scale+(45/scale)
    let hexs=row.getElementsByTagName('img');
    for (let img of hexs){
        img.style.width=128/scale;
    }
}

// ajout des boutons
const Nord = (e) => {
    window.location="https://v8.fract.org/index.php?act=go&quoi=n&";
};
const NordOuest = (e) => {
    window.location="https://v8.fract.org/index.php?act=go&quoi=no&";
};
const NordEst = (e) => {
    window.location="https://v8.fract.org/index.php?act=go&quoi=ne&";
};
const Sud = (e) => {
    window.location="https://v8.fract.org/index.php?act=go&quoi=s&";
};
const SudOuest = (e) => {
    window.location="https://v8.fract.org/index.php?act=go&quoi=so&";
};
const SudEst = (e) => {
    window.location="https://v8.fract.org/index.php?act=go&quoi=se&";
};

let boutonnord=document.createElement("input");
boutonnord.type="button";
boutonnord.value="Nord";
boutonnord.onclick = Nord;
boutonnord.style="position:relative;z-index:5;color:#cecece;background-color:#840202;opacity:1;border-radius: 20px;font-size: 14px;font-weight: 500;border: 2px solid transparent;border-color: #7a4444;"
boutonnord.style.margin='auto';
boutonnord.style.marginBottom=(76/scale);
let boutonnordouest=document.createElement("input");
boutonnordouest.type="button";
boutonnordouest.value="NO";
boutonnordouest.onclick = NordOuest;
boutonnordouest.style="position:relative;z-index:5;color:#cecece;background-color:#840202;opacity:1;border-radius: 20px;font-size: 14px;font-weight: 500;border: 2px solid transparent;border-color: #7a4444;";
boutonnordouest.style.marginRight=(64/scale)*5+10;
let boutonnordest=document.createElement("input");
boutonnordest.type="button";
boutonnordest.value="NE";
boutonnordest.onclick = NordEst;
boutonnordest.style="position:relative;z-index:5;color:#cecece;background-color:#840202;opacity:1;border-radius: 20px;font-size: 14px;font-weight: 500;border: 2px solid transparent;border-color: #7a4444;";

let boutonsud=document.createElement("input");
boutonsud.type="button";
boutonsud.value="Sud";
boutonsud.onclick = Sud;
boutonsud.style="position:relative;z-index:5;color:#cecece;background-color:#840202;opacity:1;border-radius: 20px;font-size: 14px;font-weight: 500;border: 2px solid transparent;border-color: #7a4444;"
boutonsud.style.margin='auto';

let boutonsudouest=document.createElement("input");
boutonsudouest.type="button";
boutonsudouest.value="SO";
boutonsudouest.onclick = SudOuest;
boutonsudouest.style="position:relative;z-index:5;color:#cecece;background-color:#840202;opacity:1;border-radius: 20px;font-size: 14px;font-weight: 500;border: 2px solid transparent;border-color: #7a4444;";
boutonsudouest.style.marginRight=(64/scale)*5+10;
let boutonsudest=document.createElement("input");
boutonsudest.type="button";
boutonsudest.value="SE";
boutonsudest.onclick = SudEst;
boutonsudest.style="position:relative;z-index:5;color:#cecece;background-color:#840202;opacity:1;border-radius: 20px;font-size: 14px;font-weight: 500;border: 2px solid transparent;border-color: #7a4444;";

if (document.getElementsByClassName("avatar-icon")[0].src.indexOf("png/c0")==-1)
{
let divnord=document.createElement('div');
let divsud=document.createElement('div');
placeHolder.prepend(document.createElement('br'));
placeHolder.prepend(boutonnord);
divnord.appendChild(boutonnordouest);
divnord.appendChild(boutonnordest);
divnord.style.height=76/scale;
divnord.style.marginBottom=(76/scale)*3.5+10;
placeHolder.appendChild(divnord);
divsud.appendChild(boutonsudouest);
divsud.appendChild(boutonsudest);
divsud.style.height=76/scale;
divsud.style.marginBottom=38/scale;
placeHolder.appendChild(divsud);
placeHolder.appendChild(boutonsud);
}
else
{
}
let perso=document.createElement('div');
let infos=document.createElement('div');
let groupe=document.createElement('div');
perso.innerHTML=await ficheperso('https://v8.fract.org/p_carac.php')
infos.innerHTML= await ficheperso('https://v8.fract.org/legende.php');
groupe.innerHTML= await ficheperso('https://v8.fract.org/g_carac.php');

let terrain=infos.getElementsByClassName('author')[0];
let avatar=terrain.getElementsByClassName('avatar border-white')[0];
terrain.getElementsByTagName('h4')[0].className='panel-title';
terrain.removeChild(avatar);
terrain.className='card';
let people=document.getElementsByClassName("col-lg-12 col-md-12")[0].getElementsByClassName("card")[0];
document.getElementsByClassName("col-lg-12 col-md-12")[0].removeChild(people);

let charge=groupe.getElementsByClassName("col-md-6")[0].getElementsByClassName("card")[0];
if (charge){
}
else{
    charge=perso.getElementsByClassName('card')[0];
}
//affiche perso, coef de prod et cout de dep au lieu de rose des vents
let rose=document.getElementsByClassName('card card-user')[0];
document.getElementsByClassName('col-md-4')[0].removeChild(rose);
document.getElementsByClassName('col-md-4')[0].appendChild(perso.getElementsByClassName('card card-user')[0]);
document.getElementsByClassName('col-md-4')[0].appendChild(people);
document.getElementsByClassName('col-md-4')[0].appendChild(charge);
document.getElementsByClassName('col-md-4')[0].appendChild(terrain);
document.getElementsByClassName('col-md-4')[0].appendChild(infos.getElementsByClassName('card')[2]);
