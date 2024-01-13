// ==UserScript==
// @name         Navigation
// @namespace    Go fuck yourself
// @version      0.2
// @description  Fuck la rose des vents et la nav chelou
// @author       Shao
// @match        https://v8.fract.org/index.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fract.org
// ==/UserScript==
async function ficheperso(url) {
    let response= await fetch(url)
    let f= response.text();
  return f;
}
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
boutonnord.style="margin-left:200; margin-right:200;color:#cecece;background-color:#840202;opacity:1;border-radius: 20px;font-size: 14px;font-weight: 500;padding: 7px 18px;border: 2px solid transparent;border-color: #7a4444;"

let boutonnordouest=document.createElement("input");
boutonnordouest.type="button";
boutonnordouest.value="NO";
boutonnordouest.onclick = NordOuest;
boutonnordouest.style="position:relative;top:155;color:#cecece;background-color:#840202;opacity:1;border-radius: 20px;font-size: 14px;font-weight: 500;padding: 7px 18px;border: 2px solid transparent;border-color: #7a4444;";
let boutonnordest=document.createElement("input");
boutonnordest.type="button";
boutonnordest.value="NE";
boutonnordest.onclick = NordEst;
boutonnordest.style="position:relative;top:155;color:#cecece;background-color:#840202;opacity:1;border-radius: 20px;font-size: 14px;font-weight: 500;padding: 7px 18px;border: 2px solid transparent;border-color: #7a4444;";
let boutonsud=document.createElement("input");
boutonsud.type="button";
boutonsud.value="Sud";
boutonsud.onclick = Sud;
boutonsud.style="margin-left:200; margin-right:200;color:#cecece;background-color:#840202;opacity:1;border-radius: 20px;font-size: 14px;font-weight: 500;padding: 7px 18px;border: 2px solid transparent;border-color: #7a4444;"

let boutonsudouest=document.createElement("input");
boutonsudouest.type="button";
boutonsudouest.value="SO";
boutonsudouest.onclick = SudOuest;
boutonsudouest.style="position:relative;bottom:155;color:#cecece;background-color:#840202;opacity:1;border-radius: 20px;font-size: 14px;font-weight: 500;padding: 7px 18px;border: 2px solid transparent;border-color: #7a4444;";
let boutonsudest=document.createElement("input");
boutonsudest.type="button";
boutonsudest.value="SE";
boutonsudest.onclick = SudEst;
boutonsudest.style="position:relative;bottom:155;color:#cecece;background-color:#840202;opacity:1;border-radius: 20px;font-size: 14px;font-weight: 500;padding: 7px 18px;border: 2px solid transparent;border-color: #7a4444;";


if (document.getElementsByClassName("avatar-icon")[0].src.indexOf("png/c0")==-1)
{

document.getElementsByTagName("center")[0].prepend(boutonnordest);
document.getElementsByTagName("center")[0].prepend(boutonnord);
document.getElementsByTagName("center")[0].prepend(boutonnordouest);
document.getElementsByTagName("center")[0].appendChild(boutonsudouest);
document.getElementsByTagName("center")[0].appendChild(boutonsud);
document.getElementsByTagName("center")[0].appendChild(boutonsudest);
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
const btndemerde=document.getElementsByClassName("btn-group")[0]
btndemerde.remove()
//affiche perso, coef de prod et cout de dep au lieu de rose des vents
let rose=document.getElementsByClassName('card card-user')[0];
document.getElementsByClassName('col-md-4')[0].removeChild(rose);
document.getElementsByClassName('col-md-4')[0].appendChild(perso.getElementsByClassName('card card-user')[0]);
document.getElementsByClassName('col-md-4')[0].appendChild(people);
document.getElementsByClassName('col-md-4')[0].appendChild(charge);
document.getElementsByClassName('col-md-4')[0].appendChild(terrain);
document.getElementsByClassName('col-md-4')[0].appendChild(infos.getElementsByClassName('card')[2]);
