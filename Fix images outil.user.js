// ==UserScript==
// @name      Fix images outil
// @version 1.1
// @author   Ce connard de Shao
// @description fix l'absence d'image sur les outils
// @match     https://v8.fract.org/msg_ecrire.php?*

// ==/UserScript==


let objets=document.querySelectorAll("*[bgcolor]");
for (let fix of objets){
  fix=fix.getElementsByTagName('img')[0];
  let objet=fix.src.indexOf('liste//');
  if(objet !==-1){
    let type=fix.src.split('//')[2];
    type=Number(type.split('.')[0]);
    if (type < 38){
      fix.src=fix.src.replace('liste//', 'liste/outil/')
    }
    else{
      fix.src=fix.src.replace('liste//', 'liste/objet/')
    }
  }
}



