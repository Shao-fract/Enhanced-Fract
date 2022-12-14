// ==UserScript==
// @name        Fractal Resume : Communaute
// @namespace   CommuResume
// @description vieux script de marthus
// @author Marthus
// @match     https://v8.fract.org/c_mbr.php*
// @version     2.2
// @require     https://unpkg.com/vanilla-datatables@latest/dist/vanilla-dataTables.min.js
// ==/UserScript==

/* jshint undef: true, unused: true */
/* globals MY_GLOBAL */



let parseHtml = {
    charCards : null, // HTMLELements contenant les infos des personnages
    charList : [], // tableau d'objets Char dans lesquels on va mettre les infos récoltées
    init : function() {
        // récupération de toutes les cards des personnages dans le DOM
        parseHtml.charCards = document.querySelectorAll('.card');
        if (parseHtml.charCards !== null) {
            parseHtml.main();
        }
        else {
            console.warn('Impossible de trouver les informations des personnages');
        }
    },
    main : function() {
        for (const charCard of parseHtml.charCards) {
            let Char = {};
            Char.name = parseHtml.getCharName(charCard);
            let cardContent = parseHtml.getCharContent(charCard);
            Char.avatar = parseHtml.getCharAvatar(cardContent);
            //Char.popupDetails = parseHtml.getCharPopupDetails(cardContent);
            Char.contactLink = parseHtml.getCharContactLink(cardContent);
            Char.action = parseHtml.getAction(cardContent);
            Char.geo = parseHtml.getGeo(cardContent);
            Char.pv = parseHtml.getPV(cardContent);
            Char.carac = {
                'cbt' : parseHtml.getCombat(cardContent),
                'cmd' : parseHtml.getCommand(cardContent),
                'nrt' : parseHtml.getNrt(cardContent),
                'mat' : parseHtml.getMat(cardContent),
                'art' : parseHtml.getArt(cardContent),
                'eau' : parseHtml.getEau(cardContent),
                'med' : parseHtml.getMed(cardContent),
            };
            Char.inv = parseHtml.getInventory(cardContent);
            Char.obj = parseHtml.getObjects(cardContent);
            parseHtml.charList.push(Char);
        }
        //console.log(parseHtml.charList);
    },

    getCharContent : function (charCard) {
        return charCard.querySelector('.content');
    },

    getObjects : function(cardContent) {
        let objGr = cardContent.querySelectorAll('.row > div:nth-child(2) > img[width="100px"]') ?? [];
        let obj = [];
        for (const o of objGr) {
            obj.push(o.title);
        }
        return obj;
    },

    getInventory : function(cardContent) {
        let invGr = cardContent.querySelectorAll('.row > div:nth-child(2) > div > img') ?? [];
        let inv = {};
        for (const item of invGr) {
            let val = Number(item.nextSibling.nextSibling.data);
            let index = item.getAttribute('src').slice(-7,-4);
            inv[index] = val;
        }
        return inv;
    },

    getMed : function(cardContent) {
        let med = cardContent.querySelector('.row > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(4)').innerText;
        return Number(med);
    },

    getEau : function (cardContent) {
        let eau = cardContent.querySelector('.row > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(2)').innerText;
        return Number(eau);
    },

    getArt : function (cardContent) {
        let art = cardContent.querySelector('.row > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(6)').innerText;
        return Number(art);
    },

    getMat : function (cardContent) {
        let mat = cardContent.querySelector('.row > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(4)').innerText;
        return Number(mat);
    },

    getNrt: function (cardContent) {
        let nrt = cardContent.querySelector('.row > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(2)').innerText;
        return Number(nrt);
    },

    getCommand : function (cardContent) {
        let cmd = cardContent.querySelector('.row > div:nth-child(2) img[src="https://www.fract.org/pix/caracteristique/cmd.png"]').nextSibling.data;
        return Number(cmd);
    },

    getCombat : function (cardContent) {
        let cbt = cardContent.querySelector('.row > div:nth-child(2) img[src="https://www.fract.org/pix/caracteristique/cbt.png"]').nextSibling.data;
        return cbt;
    },

    getPV : function (cardContent) {
        let pv = cardContent.querySelector('.row > div:nth-child(2) img[src="https://www.fract.org/pix/caracteristique/pvm.png"]').nextSibling.textContent;
        pv = pv.split('/');
        let pvGr = {'real':Number(pv[0]), 'max':Number(pv[1])};
        return pvGr;
    },

    getGeo : function (cardContent) {
        let nbGeo = cardContent.querySelectorAll('.row > div:nth-child(2) img[src="../pix/geo.png"]').length;
        return Number(nbGeo);
    },

    getAction : function (cardContent) {
        let pixAction = cardContent.querySelector('.row > div.col-md-8 img').getAttribute('src');
        if (pixAction == "./pix/etat1.png") {
            return true;
        }
        else {
            return false;
        }
    },

    getCharName : function (cardContent) {
        return cardContent.querySelector('h4.panel-title').innerText;
    },

    getCharAvatar : function (cardContent) {
        return cardContent.querySelector('.row img').getAttribute('src');
    },

    /*getCharPopupDetails : function (cardContent) {
        let popupDetails = cardContent.querySelector('.row  div:nth-child(3) a[onclick]').getAttribute('onclick') ?? '';
        return popupDetails;
    },*/

    getCharContactLink : function (cardContent) {
        let content = cardContent.querySelector('.row  div:nth-child(3)');
        let contactLink = content.querySelector('a:first-child').getAttribute('href');
        if (contactLink == "#") {
            contactLink = content.querySelector('a:nth-child(3)').getAttribute('href');
        }
        return contactLink;
    }
};

/**
 * displayBT4
 *
 * permet l'affichage des données sous forme de DataTable dans le site fractal qui est formaté avec Bootstrap 4 actuellement
 * usage : displayBT4.init(datas);
 *
 *
 * @require https://unpkg.com/vanilla-datatables@latest/dist/vanilla-dataTables.min.js
 *          Vanilla Datatable : https://github.com/Mobius1/Vanilla-DataTables
 */

let displayBT4 = {

    area: null,
    stylesheetFilename: 'https://unpkg.com/vanilla-datatables@latest/dist/vanilla-dataTables.min.css',
    nav: [
        {label: 'A ne pas rationner', method: 'getToFeed'},
        {label: 'A rationner', method: 'getToNotFeed'},
        {label: 'Avec jeton', method: 'getActionLeft'},
        {label: 'Combat', method: 'getWarStatus'},
        {label: 'Production', method: 'getProd'}
         ],
    datatable: null,

    construct: function() {
         // création du contenant pour l'affichage du datatable
        displayBT4.area = displayBT4.createContainer();
        document.querySelector('body > div > div.main-panel > div.content').prepend(displayBT4.area);
        // création du menu
        document.querySelector('body > div > div.main-panel > div.content').prepend(displayBT4.createNav());
        // ajout de la css de la lib Vanilla datatable
        displayBT4.addCss(displayBT4.stylesheetFilename);
    },

    display: function (datas) {
        // formatage des données pour qu'elles soient compatibles avec la lib vanilla datatable
        datas = displayBT4.formatForDatatable(datas);
        // affichage du datatable
        if (displayBT4.datatable != null) {
            displayBT4.datatable.destroy();
        }
        displayBT4.datatable = new DataTable("#resume", {data: datas,
                                                         perPageSelect:[10, 20, 30, 40, 50],
                                                         labels: {
                                                                    placeholder: "Chercher un habitant ...",
                                                                    perPage: "{select} habitants par page",
                                                                    noRows: "Aucun habitant à afficher",
                                                                    info: "{start} à {end} habitant sur {rows} (Page {page} sur {pages} pages)",
                                                                 },}
                                            );
        displayBT4.datatable.refresh();
    },
    createContainer: function () {
        let container = document.createElement("div");
        container.setAttribute('id','reorg');
        container.setAttribute('class','row');
        let col = document.createElement("div");
        col.setAttribute('class','col');
        col.appendChild(displayBT4.createTable());
        container.appendChild(col);
        return container;
    },
    createNav: function () {
        let nav = document.createElement("div");
        nav.setAttribute('id','nav-reorg');
        nav.setAttribute('class','row');
        let bar = document.createElement("ul");
        bar.setAttribute('class', 'nav nav-tabs');
        nav.appendChild(bar);
        for (let item of this.nav) {
            let li = document.createElement("li");
            li.setAttribute('class', "nav-item");
            bar.appendChild(li);
            let a = document.createElement("a");
            a.setAttribute('class', "nav-link");
            a.setAttribute('style', "background-color: #deb88754;cursor: pointer;border-top:1px solid #840202;border-left:1px solid #840202;");
            a.innerText = item.label;
            a.dataset.method = item.method;
            a.addEventListener('click',this.handleAction);
            li.appendChild(a);
        }
        bar.appendChild(displayBT4.createExportButton());
        return nav;
    },
    createExportButton: function(){
         let li = document.createElement("li");
         li.setAttribute('class', "nav-item");
         let span = document.createElement("span");
         span.setAttribute('class', "badge  badge-pill badge-warning");
         span.innerText = "Exporter";
         span.addEventListener('click',this.handleExport);
         li.appendChild(span);
        return li;
    },
    setNavActive: function(elt){
       elt.setAttribute('style', "background-color: #deb88754;cursor: pointer;border-top:2px solid #840202;border-left:2px solid #840202; font-weight:bolder;");
    },
    setNavInactive: function(){
        let navElt = document.querySelectorAll('#nav-reorg > ul > li > a');
        console.log(navElt);
        for (let item of navElt) {
            item.setAttribute('style', "background-color: #deb88754;cursor: pointer;border-top:1px solid #840202;border-left:1px solid #840202;");
        }
    },
    handleAction: function(evt) {
        displayBT4.setNavInactive();
        displayBT4.setNavActive(evt.target);
        let result = extract[evt.target.dataset.method]();
        displayBT4.display(result);
    },
    handleExport: function(evt) {
        displayBT4.datatable.export({
            type: "csv",
            filename: "fract-export",
            columnDelimiter:  ";",}
          );
    },
    createTable: function() {
        let table = document.createElement("table");
        table.setAttribute('id', 'resume');
        table.setAttribute('class', 'resume-datatable');
        //document.querySelectorAll('.resume-datatable td, .resume-datatable th').style.padding = '.3rem';
        let lastStylesheetIndex = window.document.styleSheets.length-1;
        let sheet = window.document.styleSheets[lastStylesheetIndex];
        sheet.insertRule('.resume-datatable td, .resume-datatable th { padding: .3rem; }', sheet.cssRules.length);
        sheet.insertRule('.resume-datatable tr:nth-of-type(odd) {color:FFFFFF;background-color: #66615b;}', sheet.cssRules.length);
        sheet.insertRule('.resume-datatable tr:nth-of-type(even) {color:FFFFFF;background-color: #333333;}', sheet.cssRules.length);
        return table;
    },
    addCss: function (fileName) {
        let head = document.head;
        let link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = fileName;
        head.appendChild(link);
    },
    formatForDatatable: function (data) {
        let obj = {
            headings: Object.keys(data[0]),
            data: []
        };
        for ( var i = 0; i < data.length; i++ ) {
            obj.data[i] = [];
            for (var p in data[i]) {
                if( data[i].hasOwnProperty(p) ) {
                    obj.data[i].push(data[i][p]);
                }
            }
        }
        return obj;
    },
};

// extraction des données utiles
let extract = {
    charList: null,
    init: function (datas) {
        this.charList = datas;
    },

    getToFeed: function () {
        let list = [];
        for (const char of this.charList) {
            if (char.pv.real <= (char.pv.max-1) || char.pv.real < 3 ) {
                let item = {
                    nom: '<a href="' + char.contactLink + '" class="btn btn-info btn-fill btn-wd" target="_blank">Contacter ' + char.name + '</a>',
                    pv: (char.pv.real < 3) ? '<span  class="badge  badge-pill badge-warning">' + char.pv.real + '</span>' : char.pv.real,
                    pv_max: char.pv.max,
                    inv_nrt: char.inv.nrt ?? 0,
                    inv_eau: char.inv.eau ?? 0,
                    inv_med: char.inv.med ?? 0,
                };
                list.push(item);
            }
        }
        return list;
    },

    getToNotFeed: function () {
        let list = [];
        for (const char of this.charList) {
            if (char.pv.real > (char.pv.max-1) && char.pv.real <= (char.pv.max) ) {
                let item = {
                    nom: '<a href="' + char.contactLink + '" class="btn btn-info btn-fill btn-wd" target="_blank">Contacter ' + char.name + '</a>',
                    pv: char.pv.real,
                    pv_max: char.pv.max,
                    inv_nrt: char.inv.nrt ?? 0,
                    inv_eau: char.inv.eau ?? 0,
                    inv_med: char.inv.med ?? 0,
                };
                list.push(item);
            }
        }
        return list;
    },

    getActionLeft: function () {
        let list = [];
        for (const char of this.charList) {
            if (char.action === true) {

                let item = {
                    nom: '<a href="' + char.contactLink + '" class="btn btn-info btn-fill btn-wd" target="_blank">Contacter ' + char.name + '</a>',
                    jeton: (char.action) ? '<img src="./pix/etat1.png" title="jeton">' : '<img src="./pix/etat0.png" title="jeton">',
                    outils: this.getObjetByType(char.obj, 'outil'),
                    chasse: char.carac.nrt ?? 0,
                    eau: char.carac.eau ?? 0,
                    medecine: char.carac.med ?? 0,
                    matosaure: char.carac.mat ?? 0,
                    artisan: char.carac.art ?? 0,
                };
                list.push(item);
            }
        }
        return list;
    },

    getWarStatus: function () {
        let list = [];
        for (const char of this.charList) {

                let item = {
                    nom: '<a href="' + char.contactLink + '" class="btn btn-info btn-fill btn-wd" target="_blank">Contacter ' + char.name + '</a>',
                    jeton: (char.action) ? '<img src="./pix/etat1.png" title="jeton">' : '<img src="./pix/etat0.png" title="jeton">',
                    combat: char.carac.cbt,
                    outils: this.getObjetByType(char.obj, 'arme'),
                    pdv: char.pv.real,
                    pdv_max: char.pv.max,

                };
                list.push(item);

        }
        return list;
    },

     getProd: function () {
        let list = [];
        for (const char of this.charList) {
                let item = {
                    nom: '<a href="' + char.contactLink + '" class="btn btn-info btn-fill btn-wd" target="_blank">Contacter ' + char.name + '</a>',
                    jeton: (char.action) ? '<img src="./pix/etat1.png" title="jeton">' : '<img src="./pix/etat0.png" title="jeton">',
                    outils: this.getObjetByType(char.obj, 'outil'),
                    chasse: char.carac.nrt ?? 0,
                    eau: char.carac.eau ?? 0,
                    medecine: char.carac.med ?? 0,
                    matosaure: char.carac.mat ?? 0,
                    artisan: char.carac.art ?? 0,
                };
                list.push(item);
        }
        return list;
    },

    getObjetByType: function (list, type) {
        let objList = [];
        for (let obj of list) {
            if (obj.indexOf(type) != -1) {
                objList.push(obj);
            }
        }
        return objList.join('<br>');
    },
};


parseHtml.init();
extract.init(parseHtml.charList);
displayBT4.construct();

//let result = extract.getActionLeft();

//displayBT4.display(result);