// ==UserScript==
// @name         Groupe
// @namespace    http://fract.org
// @version      0.9
// @description  Script de gestion du groupe. Manque la gestion des veh encore
// @author       Ce connard de Shao
// @match    https://v8.fract.org/g_mbr.php*

// ==/UserScript==
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle(`
td {padding:5px;vertical-align: text-top;}
thead{border-bottom: 0.5px solid #eee;color:#cccccc}
tfoot{border-top: 0.5px solid #eee;}
.tdmarchandise{text-align: center;}
.tdnom{width:225px;}
.nrt{text-align: center;color:brown;}
.eau{text-align: center;color:blue;}
.med{text-align: center;color:green;}
petit{font-size:10px;}
.orange{color:orange}
.rouge{color:red}
.vert{color:green}
`);

class personnage{
 constructor(cazid,nom, pions, pv,cbt){
     this.nom=nom
     this.pions=pions
     this.nb=pv
     this.cbt=cbt
     this.arme=1
     this.degats=1
     this.nomarme=''
     this.poids=20
     this.nrt=0
     this.eau=0
     this.med=0
 }
}
class marchandise{
 constructor(nom, png, nb){
     this.nom=nom
     this.png=png
     this.nb=nb
 }
}
//recup des fiches persos
const fiches=document.getElementsByClassName("card");
let nom;
let cazid;
let pars;
let arme;
let degats;
let nomarme;
let parscbt;
let cbttotal=0
let totaldegats=0;
let march;
// marchandises contient des objets marchandise :)
let marchandises=[];
let fiche;
let alt;
let personnages=[];
let nrt,eau,med;
let png,nbmarch;
let poids;
let testpoids;
let charge;
let exist;

//boucle principale on scanne les fiches persos

for (fiche of fiches){
  //fiches perso
  let perso=new personnage();
//cazid et nom
  cazid=fiche.getElementsByClassName("col-md-2");
  cazid=cazid[1].innerHTML.split('cazid=');
  cazid=cazid[1].split('"');
  perso.cazid=cazid[0]
  perso.nom=fiche.getElementsByClassName("panel-title")[0].textContent;
  //poids
  pars=fiche.getElementsByClassName("col-md-8")[0];
  poids=pars.innerHTML.split('<hr>');
  poids=poids[2].split(':');
  poids=poids[1].split('kg');
  testpoids=Number(poids[0]);
  //gère la surcharge
  if (Number.isNaN(testpoids)){
   poids=poids[0].split('>');
   poids=Number(poids[1]);
  }
  else {
   poids=testpoids;
  }
  perso.poids=poids;

  // pions pv cbt
  pars=pars.innerHTML.split('<br>');
  perso.pions=pars[0];
  perso.pv=pars[1];
  //gère la présence d'une arme
  if (pars[2].includes('(')){

    nomarme=pars[2].split('(')[1];
    perso.nomarme=nomarme
    arme= pars[2].split('(x')[1];
    degats=arme.split('d')[1]
    degats=degats.split(')');
    arme=arme.split('d')[0];
    perso.degats=Number(degats[0]);
    perso.arme=Number(arme);
    pars[2]=pars[2].split('(')[0];
  }
  perso.cbt=Number((pars[2]).split('>')[1]);
  cbttotal+=perso.cbt*perso.arme;
  totaldegats+=perso.degats;
  //marchandises
  march=fiche.querySelectorAll("*[style]");
  for(let item of march){
    alt=item.innerHTML.split('alt="');
    alt=alt[1].split('"');
    png=item.innerHTML.split("<br>")[0];
    nbmarch=Number(item.textContent);
    //gère les nems
    if (png.includes('nrt')){
      perso.nrt=nbmarch;
    }
    else if (png.includes('eau')){
      perso.eau=nbmarch;
    }
    else if (png.includes('med')){
      perso.med=nbmarch;
    }
    //gère les autres marchandises en testant existance et ajout + incrément
    else {
      exist=marchandises.map(x => x.nom).indexOf(alt[0])
      if (exist ===-1){
        marchandises.push(new marchandise(alt[0],png,nbmarch));
      }
      else{
        marchandises[exist].nb+=nbmarch
      }
    }
  }
 //clôture de la boucle perso par ajout de l'objet perso au array personnages
 personnages.push(perso);
}

//affichage tableau perso
let nem=[0,0,0];
let poidstotal=0;
let tableperso=document.createElement("table");
let thead=document.createElement('thead');
let tbody=document.createElement('tbody');
let tfoot=document.createElement('tfoot');
//barre de titre
let titre=document.createElement('tr');
let titreperso=document.createElement('td');
titreperso.innerHTML='<h4 class="panel-title"> Nombre de persos : '+fiches.length+'</h4>'
let titrenrt=document.createElement('td');
titrenrt.innerHTML='<img src="./pix/caracteristique/nrt.png" >'
titrenrt.className="nrt";
let titreeau=document.createElement('td');
titreeau.innerHTML='<img src="./pix/caracteristique/eau.png" >'
titreeau.className="eau";
let titremed=document.createElement('td');
titremed.innerHTML='<img src="./pix/caracteristique/med.png" >'
titremed.className="med";
titre.appendChild(titreperso);
titre.appendChild(document.createElement('td'));
titre.appendChild(titrenrt);
titre.appendChild(titreeau);
titre.appendChild(titremed);
thead.appendChild(titre);
//boucle perso
let chef=0
for (let perso of personnages){

  let tr=document.createElement("tr");
  //nom et cbt
  let tdnom=document.createElement("td");
  tdnom.className="tdnom";
  //gère la présence d'une arme
  let affichearme='';
  if(perso.nomarme!=''){
    affichearme='<petit> ('+perso.cbt+' x '+perso.arme+'d'+perso.degats+' '+perso.nomarme+')</petit>';
  }
  tdnom.innerHTML='<a href="msg_ecrire.php?cazid='
                   +perso.cazid+'">'
                   +perso.nom
                   +'</a> <br> <img src="https://www.fract.org/pix/caracteristique/cbt.png" alt="Combat">'
                   +Math.round(perso.cbt*perso.arme*100)/100
                   +affichearme;

  //pv et geo
  let tdpions=document.createElement("td");
  let pv,pvmax;
  pv=perso.pv.split('>')[1];
  pvmax=pv.split('/')[1];
  pv=pv.split('/')[0];
  tdpions.innerHTML=perso.pions+'<br>'+perso.pv;
  //couleurs en fonction du nombre de pv restants
  if ((pv-pvmax) <=-1 & pv > 2.5){
    tdpions.className="orange";
  }
  else if (pv <=2.5){
    tdpions.className="rouge";
  }
  else {
   tdpions.className="vert";
  }
  //poids
  let tdpoids=document.createElement("td");
  tdpoids.innerHTML=perso.poids+' kg';
  poidstotal+=perso.poids;
  let tdcharge=document.createElement("td");
  //gestion affichage charge ou surcharge
  if (perso.poids<0){
    charge="Surcharge :";
    tdpoids.className="rouge";
  }
  else{
    charge="Libre :";
    tdpoids.className="vert";
  }
  tdcharge.innerHTML=charge;
  //nem
  let tdnrt=document.createElement("td");
  tdnrt.innerHTML=perso.nrt;
  tdnrt.className="nrt";
  nem[0]+=perso.nrt
  let tdeau=document.createElement("td");
  tdeau.innerHTML=perso.eau;
  tdeau.className="eau";
  nem[1]+=perso.eau
  let tdmed=document.createElement("td");
  tdmed.innerHTML=perso.med;
  tdmed.className="med";
  nem[2]+=perso.med

  //boutons actions
  let candid=document.createElement("td");
  candid.innerHTML='<a style="background-color: green !important;border-color:darkgreen !important;"  class="btn btn-info btn-fill btn-sm" href="https://v8.fract.org/msg_cand.php?cazid=' + perso.cazid + '" target=_blank><span class="ti-link"></span> Inviter</a>';
  let nompersoembarquer=document.createElement("td");
  nompersoembarquer.innerHTML= '<a style="background-color: green !important;border-color:darkgreen !important"class="btn btn-info btn-fill btn-sm" href="https://v8.fract.org/g_veh.php?embarquer=' + perso.cazid + '" target=_blank><span class="ti-upload"></span> Embarquer</a>';
  let nompersodebarquer=document.createElement("td");
  nompersodebarquer.innerHTML = '<a class="btn btn-info btn-fill btn-sm" href="https://v8.fract.org/g_veh.php?debarquer=' + perso.cazid + '"target=_blank><span class="ti-download"></span> Débarquer</a>';
  let nompersovirer=document.createElement("td");
  nompersovirer.innerHTML = '<a  class="btn btn-info btn-fill btn-sm" href="https://v8.fract.org/g_mbr.php?act=grp_virer&cazid=' + perso.cazid + '"target=_blank><span class="ti-unlink"></span> Kicker</a>';
  // on construit le tableau
  tr.appendChild(tdnom);
  tr.appendChild(tdpions);
  tr.appendChild(tdnrt);
  tr.appendChild(tdeau);
  tr.appendChild(tdmed);
  tr.appendChild(tdcharge);
  tr.appendChild(tdpoids);
  
  tr.appendChild(nompersoembarquer);
  tr.appendChild(nompersodebarquer);
  if(chef!==0){
    tr.appendChild(candid);
    tr.appendChild(nompersovirer);
  }

  tbody.appendChild(tr);
  chef+=1
}
// Dernière ligne :les totaux
let total=document.createElement("tr");
//cbt
let tdtotalcbt=document.createElement("td");
tdtotalcbt.innerHTML='<img src="https://www.fract.org/pix/caracteristique/cbt.png" alt="Combat Total">Cbt du groupe : '+Math.round(cbttotal*100)/100+'d'+totaldegats;
//nem
let totalnrt=document.createElement("td")
totalnrt.innerHTML=nem[0];
totalnrt.className="nrt";
let totaleau=document.createElement("td")
totaleau.innerHTML= nem[1];
totaleau.className="eau";
let totalmed=document.createElement("td")
totalmed.innerHTML= nem[2];
totalmed.className="med";
//poids
let tdpoidstotal=document.createElement("td");
tdpoidstotal.innerHTML=Math.round(poidstotal*10)/10+' kg';
let tdchargetotal=document.createElement("td");
//charge et surcharge
if (poidstotal<0){
    charge="Surcharge :";
    tdpoidstotal.className="rouge";
    }
    else{
      charge="Libre :";
      tdpoidstotal.className="vert";
     }
tdchargetotal.innerHTML=charge
// Construction du tfoot
total.appendChild(tdtotalcbt);
total.appendChild(document.createElement("td"));
total.appendChild(totalnrt);
total.appendChild(totaleau);
total.appendChild(totalmed);
total.appendChild(tdchargetotal);
total.appendChild(tdpoidstotal);
tfoot.appendChild(total);

//finalisation tableau perso
tableperso.appendChild(thead);
tableperso.appendChild(tbody);
tableperso.appendChild(tfoot);

//affichage marchandises
let affichemarchandises=document.createElement("table");
affichemarchandises.appendChild(document.createElement('tr'))
let tdmarch;
//on boucle sur l'array marchandises pour creer 1 td par objet marchandise
for ( let item of marchandises){
  tdmarch=document.createElement("td");
  tdmarch.innerHTML= item.png +'<br>'+Math.round(item.nb*10)/10;
  tdmarch.className="tdmarchandise";
  affichemarchandises.getElementsByTagName('tr')[0].appendChild(tdmarch);
}

//insertion du bousin dans la page fract
let cadre=document.createElement("div");
cadre.innerHTML= '<div class="barre">'+
                   '<h3 class="title" style="padding-left:10px;">Synthèse du groupe</h3>'+
                   '</div> '+
                   '<div class=card>'+
                   '<div class="content">'+
                   '<div class="tableperso">'+
                   '</div>'+
                   '<br>'+
                   '<h4 class="panel-title"style="padding-left:5px;">Autres marchandises</h4>'+
                   '<hr>'+
                   '<div class="affichemarchandises">'+
                   '</div>'+
                   '</div>'

cadre.getElementsByClassName('tableperso')[0].appendChild(tableperso);
cadre.getElementsByClassName('affichemarchandises')[0].appendChild(affichemarchandises);


//load du script
function synthese (){
    document.getElementsByClassName("col-lg-12 col-md-12")[0].prepend(cadre);
}
document.body.onload=synthese;


