// ==UserScript==
// @name        Don't hide
// @namespace   Map
// @autor       Marthus>Lekteur>Shao
// @description Affiche les élèments superposés
// @match    https://v8.fract.org/index.php
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @version     2024
// @grant       GM_xmlhttpRequest
// ==/UserScript==

$(function(){
    'use strict';

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

.MapRow {    position: absolute;	display:block;	border : none; }.MapElt {    position: absolute;	display:block;	border : none; }
.MapElt:hover {	opacity: 0.4;    filter: alpha(opacity=40);	    border-style: solid;    border-width: 1px;	border-style: dotted;    border-color: blue;}img{margin:0px;padding:0px;}
`);

var iframeisopen = 0;
var total = document.getElementsByClassName("col-md-8")[0].innerHTML;
var element = [];
var i=0;
var j=0;
var txt ="";



//récupération des infos éléments dans la page-----------------------------------------------------------

  var block = total.split("fract_addElement (");

for (i = 0; i < block.length; i++) { element[i] = []; }

var tab = [];for (i = 0; i < block.length; i++) { tab[i] = []; }

var cooX = [];
var cooY = [];
var cooN = [];

//répartition des infos des éléments-----------------------------------------------------------


for (i = 2; i < block.length; i++) {
  j = i - 2;
  element[j] = block[i].split(", ");
  cooX[j] = element[j][0];
  cooY[j] = element[j][1];
  tab = element[j][2].split("\"");
  element[j][2]=tab[1];
  cooN[j] = element[j][2];
}
var long = block.length-2;




//écriture de la carte -------------------------------------------------------------

var texte_a_afficher = `<div>`;



var n = [];for (i = -4; i < 5; i++) { n[i] = []; }
//remplissage n[x][y]
for (i=-4;i<=4;i++) //x
{
	for (j=-4;j<=4;j++) //y
	{
		n[i][j]=-1;
	}
}

var k=0;
var numb = 1;
var place = [];
  for (i = -4; i < 5; i++) {
    place[i] = [];
    for (j = -4; j < 5; j++) {
      place[i][j] = [];
    }
  }



txt="";
//remplissage tableau de données
for(i=0;i<long;i++)
	{
		for (j=-4;j<5;j++) //x
		{
			if(cooX[i] == j)
			{
				for (k=-4;k<5;k++) //y
				{
					if(cooY[i] == k)
					{
					n[j][k]+=1;
					numb=n[j][k];
					place[j][k][numb]=cooN[i];
					}
				}
			}
		}
	}

var x=-1;
var cx=0;
var cy=0;
var nombre=0;
var compte=0;
var nbp=0;
var cazid=0;
var elt = [];
var href="";
var hreff="";
for(i=-4;i<=4;i++) {//x
	x+=1;
	for(j=-4;j<=4;j++) {//y
		nbp = n[i][j];
		if(nbp >= 0) {
			for(k=0;k <= nbp;k++) {//nb d'éléments
				cx=(x-1)*64+k*10; //calcul de cx

				switch (i){ //calcul de cy
					case -4:
						cy=76*(0.5-j);
					break;
					case -3:
						cy=76*(1-j);
					break;
					case -2:
						cy=76*(1.5-j);
					break;
					case -1:
						cy=76*(2-j);
					break;
					case 0:
						cy=76*(2.5-j);
					break;
					case 1:
						cy=76*(3-j);
					break;
					case 2:
						cy=76*(3.5-j);
					break;
					case 3:
						cy=76*(4-j);
					break;
					case 4:
						cy=76*(4.5-j);
					break;
				}

				cy+=38; //calcul de cy

			
				

				txt += "<div class=\"MapElt\" style=\"margin-left:" + cx + "px ;margin-top:"+ cy+"px;z-index:10\">"+href+" <img src=\""+place[i][j][nombre]+"\" alt=\""+place[i][j][nombre]+"\" title=\""+place[i][j][nombre]+"\" >"+hreff+"</div>";
				nombre+=1;
			}
            nombre=0;
		}
	}
}

texte_a_afficher +=txt+"</div>";

//---Affichage de la carte
$("#MapPlaceHolder").append(texte_a_afficher);


});
