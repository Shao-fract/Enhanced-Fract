// ==UserScript==
// @name      Messagerie
// @version 1.1
// @author   Ce connard de Shao
// @description Ajoute une interface cliquable pour les propals. Incrémente et décrémente de 1. Shift+clic transfère tout le stock, ctrl+clic incrémente de 0.1
// @match     https://v8.fract.org/msg_ecrire.php?*
// ==/UserScript==
//insertion CSS
function addGlobalStyle(css) {
    let head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle(`
.tdmarchandise{
     display:flex;
     flex-flow: column wrap;
     flex-grow:0;
     align-content:center;
     text-align:center;
     font-size:10px;
     width:50px;
     height:auto;
     }
.tdmarchandise img{
     display:flex;
     width:40px;
     height:auto;
     }
.tdmarchandise:hover{
     opacity:0.5;
     }
.don {
    display:flex;
    flex-flow: row wrap;
    flex-shrink:0;
    flex-basis:22%;
    border: 1px solid;
    border-color:#ddd;
    border-radius: 4px;
    box-shadow: 0 1px 1px rgb(0 0 0 / 5%);
    box-sizing: border-box;
    padding:5px;
    align-items: stretch;
    margin:10px;

    }
#stock{
     display: flex;
     flex-flow: column nowrap;
     padding-bottom: 0px
     }
.tableau{
     display:flex;
     flex-flow: row nowrap;
     flex-grow:0;
     margin:5px;
     }
.perso{
    display:flex;
    flex-flow: row wrap;
    flex-basis:28%;
    flex-grow:0;
    margin:10px;
    }
.titre{
    flex-grow:1;
    text-align:center;
    flex-shrink:0;
    flex-basis:25%;
    font-size:15px;
    }
 .total{
    flex-grow:1;
    text-align:center;
    flex-shrink:0;
    flex-basis:25%;
    font-size:15px;

   }
 .charge{
 display:inline;
 }
`);
class marchandise{
 constructor(nom, png, nb,index){
    this.nom=nom
    this.png=png
    this.nb=nb
    this.nbmax=nb
    this.index=index
 }
 add(addnb){
     this.nb+=Number((addnb)*10)/10
     if (this.nb>this.nbmax){
         this.nb=this.nbmax
     }
 }
}
let shift,ctrl=false
function logshift(e) {
  shift=e.shiftKey;
  ctrl=e.ctrlKey;
}
//fonction qui ajoute une marchandise dans la propal
const fonctionDon= (qui,alt,march,casemarch) => {
  let addnb,nb=0;
  document.getElementById('marchandises').setAttribute("class","panel-collapse collapse show");
  if (nbpropal.length< 10 && march.nb!==0){
    if(shift===true){
      addnb=march.nb;
      march.nb=0;

    }
    else if (ctrl===true){
      addnb=0.1;
      march.nb-=addnb;

      }
    else if (march.nb<1){
    addnb=march.nb;
    march.nb=0;
    }
    else {
      addnb=1;
      march.nb-=addnb;
    }

    casemarch.innerHTML='<img src="'+march.png+'" title="'+march.nom+'">'+march.nb;

    if (addnb !==0){
      let exist=exmarchandises[qui].map(x => x.nom).indexOf(alt);
      if (exist===-1){
        propal[nbpropal.length].style="";
        propal[nbpropal.length].getElementsByTagName("select")[0].value=qui+1;
        propal[nbpropal.length].getElementsByTagName("select")[1].value=alt;
        nb=Number(propal[nbpropal.length].getElementsByTagName("input")[0].value);
        nb=Math.round((nb+addnb)*10)/10;
        propal[nbpropal.length].getElementsByTagName("input")[0].value=nb;
      }
      else{
       exist=exmarchandises[qui][exist].index
       nb=Number(propal[exist].getElementsByTagName("input")[0].value);
       nb=Math.round((nb+addnb)*10)/10;
       propal[exist].getElementsByTagName("input")[0].value=nb
      }
    }
    affechange()
  }
  else{
    if (march.nb==0){
      alert('Y\'en a plus connard !');
      addnb=0;
    }
    else{
      alert("Trop de marchandises pour une seule prop, plains toi à Kv !");
    }
  }
}

const fonctionback= (qui,item)=>{
  let addnb=0;
  if (shift===true){
      addnb=item.nb
  }
  else if (ctrl===true){
      addnb=0.1;
      item.nb-=addnb;
  }

  else if (item.nb<1){
    addnb=item.nb;
  }
  else{
    addnb=1
  }
  let nb=Number(propal[item.index].getElementsByTagName("input")[0].value);
  nb-=addnb;
  propal[item.index].getElementsByTagName("input")[0].value=Math.round(nb*10)/10;
  let exist=marchandises[qui].map(x => x.nom).indexOf(item.nom);
    
  if (exist===-1){
  }
    
  else{
    marchandises[qui][exist].add(addnb);
  }

  affechange()
}

//recup une autre page et retourne le text
async function ficheperso(url) {
    let response= await fetch(url)
    let f= response.text();
  return f;
}

//fonction retournant un array d'objets marchandises par perso
function getmarch(){
  let tempmarch=[[],[]];
  for (let i=0;i<2 ;i++) {
    perso=persos[i].split('stock">');
    perso=perso[1].split('<div class="card">');
    pars.innerHTML=perso[0];
    let marchs=pars.getElementsByClassName('gauche');
    for(let item of marchs){
      let nbmarch=Number(item.textContent.split("kg")[0]);
      if (nbmarch!==0){
        let alt=item.innerHTML.split('title="');
        alt=alt[1].split('"')[0];
        let png=item.innerHTML.split("src=");
        png=png[1].split('"')[1];
        let march=new marchandise(alt,png,nbmarch);
        march.nbmax=march.nb;
        tempmarch[i].push(new marchandise(alt,png,nbmarch));
      }
    }
  }
  return tempmarch
}
function affechange () {
  //affiche les marchandises des deux persos
  perso1.innerHTML=''
  perso2.innerHTML=''
  for(let i=0 ;i<2;i++){
    for (let item of marchandises[i]){
      let casemarch=document.createElement('div');
      casemarch.className="tdmarchandise";
      casemarch.innerHTML='<img src="'+item.png+'" title="'+item.nom+'">'+Math.round(item.nb*10)/10;
      casemarch.addEventListener('click', logshift);
      casemarch.onclick=function(){fonctionDon(i,item.nom,item,casemarch)}
      tdpersos[i].appendChild(casemarch);
    }
  }
  //recup de la propal
  exmarchandises=[[],[]]
  propal=document.getElementById('marchandises');
  propal=propal.getElementsByClassName('panel-body')[0].childNodes;
  propal=[...propal].filter((item) => item.nodeName !=="#text");
  //on cherche tout ce qui n'a pas 0 en quantité
  nbpropal=[...propal].filter((item)=>item.getElementsByTagName("input")[0].value!=="0");
  //on clean la propal en remontant uniquement les quantité !=0
  let j=0
  if (nbpropal!==0){
    for (let thing of nbpropal){
      propal[j].getElementsByTagName("select")[0].value=thing.getElementsByTagName("select")[0].value;
      propal[j].getElementsByTagName("select")[1].value=thing.getElementsByTagName("select")[1].value;
      propal[j].getElementsByTagName("input")[0].value=thing.getElementsByTagName("input")[0].value;
    j+=1
    }
    //sauf la première et la dernière sinon ça fait des trucs chelous
    if(j!==0 && j<10){
      propal[j].getElementsByTagName("input")[0].value=0 ;
      propal[j].style.display='none';
    }
  }
  //On remplit l'array exmarchandises des trucs contenu dans la propal
  let i=0;
  let chargeaff,chargeaff2=0;
  let poids=[0,0];
  for (let march of propal){
    let nb =Number(march.getElementsByTagName("input")[0].value);
    if(nb!==0){
      let qui=Number(march.getElementsByTagName("select")[0].value)-1;
      let expng=march.getElementsByTagName("select")[1].value;
      expng='./pix/march/'+expng+'.png'
      let alt=march.getElementsByTagName("select")[1].value;
      let exmarch=new marchandise(alt,expng,nb,i);
      i+=1
      exmarchandises[qui].push(exmarch);
      poids[qui]+=nb
    }
  }
//affichage de l'echange
  don.innerHTML='';
  demande.innerHTML='';

  for(let i=0 ;i<2;i++){
    for (let item of exmarchandises[i]){
    let casemarch=document.createElement('div');
    casemarch.className="tdmarchandise"
    casemarch.innerHTML='<img src="'+item.png+'" title="'+item.nom+'">'+Math.round(item.nb*10)/10;
    casemarch.addEventListener('click', logshift);
    casemarch.onclick=function(){fonctionback(i,item)}
    tdpropal[i].appendChild(casemarch);
    }
  }
  chargeaff=charge+poids[0]-poids[1];
  chargeaff2=chargeaff2+poids[1]-poids[0];
  tdcharge.innerHTML=Math.round((chargeaff)*10)/10;
  tdcharge2.innerHTML=Math.round((Math.abs(chargeaff2))*10)/10;
  if (chargeaff <= 0.1){
    tdcharge.style='color:red';
    persocharge.textContent='Surcharge : ';
    persocharge.appendChild(tdcharge)
  }
  if (chargeaff >= 0){
    tdcharge.style='';
    persocharge.textContent='Charge libre : ';
    persocharge.appendChild(tdcharge)
  }
  if (chargeaff2 < 0){
    perso2charge.textContent='Poids en plus : ';
    perso2charge.appendChild(tdcharge2)
  }
  else{
    perso2charge.textContent='Poids en moins : ';
    perso2charge.appendChild(tdcharge2)
  }
}
// on chope le cazid des deux persos
let fiche = await ficheperso('https://v8.fract.org/p_carac.php');
let cazid=fiche.split('class="avatar-icon" src="./png/')[1] ;
cazid=cazid.split('.')[0];
let cazidcible=document.getElementsByClassName("avatar-icon")[0] ;
cazidcible=cazidcible.src.split('https://v8.fract.org/png/')[1];
cazidcible=cazidcible.split('.')[0];
//  On recup la charge dispo du joueur
let charge=fiche.split('Libre<br />')[1];
charge=Number(charge.split('kg')[0]);
let chargeperso2=0;
//On charge leur fiche dans le array persos
let ficheperso1= await ficheperso('https://v8.fract.org/map_perso.php?cazid='+cazid);
let ficheperso2= await ficheperso('https://v8.fract.org/map_perso.php?cazid='+cazidcible);
let persos=[ficheperso1,ficheperso2];
//variables de traitement
let perso;
let pars=document.createElement('div');
let m=0;
let marchandises=getmarch();
let exmarchandises=[[],[]]
let propal,nbpropal;
//affichage
let stock=document.createElement('div');
stock.className='panel panel-border panel-default';
stock.id='stock';
//ligne de titre
let titre=document.createElement('div');
titre.className="tableau"
let tdnom1=document.createElement('h4');
tdnom1.className="titre";
tdnom1.innerHTML='Ton stock';
let tdnom2=document.createElement('h4');
tdnom2.className="titre";
tdnom2.innerHTML='Stock du pigeon';
let tddon=document.createElement('h4');
tddon.className="titre";
tddon.innerHTML='Donner';
let tddemande=document.createElement('h4');
tddemande.className="titre";
tddemande.innerHTML='Demander';
titre.appendChild(tdnom1);
titre.appendChild(tddon);
titre.appendChild(tddemande);
titre.appendChild(tdnom2);
//stock et propal
let tableau=document.createElement('div');
tableau.className="tableau"
let perso1=document.createElement('div');
perso1.className="perso"
let perso2=document.createElement('div');
perso2.className="perso"
let don=document.createElement('div');
don.className='don';
let demande=document.createElement('div');
demande.className='don';
let total=document.createElement('div');
total.className="tableau"
let persocharge=document.createElement('h4');
persocharge.className="total";
persocharge.innerHTML='Charge : ';
let tdcharge=document.createElement('p');
tdcharge.className="charge";
tdcharge.innerHTML=charge;
let chargeholder1=document.createElement('h4');
chargeholder1.className="total";
let chargeholder2=document.createElement('h4');
chargeholder2.className="total";
let perso2charge=document.createElement('h4');
perso2charge.className="total";
perso2charge.innerHTML='Poids échangé : ';
let tdcharge2=document.createElement('p');
tdcharge2.className="charge";
tdcharge2.innerHTML=chargeperso2;
persocharge.appendChild(tdcharge);
perso2charge.appendChild(tdcharge2);
total.appendChild(persocharge);
total.appendChild(chargeholder1);
total.appendChild(chargeholder2);
total.appendChild(perso2charge);
//Placement
tableau.appendChild(perso1);
tableau.appendChild(don);
tableau.appendChild(demande);
tableau.appendChild(perso2);
stock.appendChild(titre);
stock.appendChild(document.createElement('hr'));
stock.appendChild(tableau);
stock.appendChild(total);
document.getElementsByTagName('form')[0].insertBefore(stock,document.getElementsByClassName("card-content")[0])
//array pour faciliter le traitement
let tdpersos=[perso1,perso2];
let tdpropal=[don, demande]

//fonction principale
affechange();


