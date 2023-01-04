// ==UserScript==
// @name      Fix images outil
// @version 1.2
// @author   Ce connard de Shao
// @description fix l'absence d'image sur les outils
// @match     https://v8.fract.org/msg_ecrire.php?*

// ==/UserScript==
let sacs=["Sac","sac","Besace","ravois","andau","hariot","artable","este","alise","T-shirt","T-Shirt cycliste","seau","Seau","acoche","Housse","alette à outils","anier","Etui","Dry","Chicom","Ceinture","Cantine","Caddie","Cabas","Brouette","Body bag","Banane","Attaché-case"]
let outils=["Pelle","rongeurs","Filtre à eau","Mortier","Dico Médical","biche","Scie à métaux","à outils","Clef anglaise","Charrue","Bâche","Marteaux","Collet","calpel","Kit","Pioche","Outil","secours","ournevis","Manuel","Pompe","Cage","Piège","Ciseaux","Outre","Jerican","Lasso","Coupe Chaines",]
let objets=document.querySelectorAll("*[bgcolor]");
for (let fix of objets){
  fix=fix.getElementsByTagName('img')[0];
  let objet=fix.src.indexOf('liste//');
  if(objet !==-1){
    let type="objet";
    let nom=fix.title;
    if (sacs.some(v => nom.includes(v))) {
      type="sac";
    }
   else if(outils.some(v => nom.includes(v))) {
      type="outil";
    }
  fix.src=fix.src.replace('liste//', 'liste/'+type+'/')
  }
}



