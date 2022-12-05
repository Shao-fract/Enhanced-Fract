// ==UserScript==
// @name         Navigation
// @namespace    Go fuck yourself
// @version      0.1
// @description  Fuck la rose des vents
// @author       Ce connard de Shao
// @match        https://v8.fract.org/index.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fract.org
// ==/UserScript==
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
