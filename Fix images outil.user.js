// ==UserScript==
// @name      Fix images outil
// @version 1.0
// @author   Ce connard de Shao
// @description fix l'absence d'image sur les outils
// @match     https://v8.fract.org/msg_ecrire.php?*

// ==/UserScript==


let outils=document.querySelectorAll("*[bgcolor]");
for (let fix of outils){
    fix=fix.getElementsByTagName('img')[0];
    let outil=fix.src.indexOf('liste//');
    if(outil !==-1){
     fix.src=fix.src.replace('liste//', 'liste/outil/')
    }
    }



