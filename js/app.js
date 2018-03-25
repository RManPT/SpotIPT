
var totalalbums = 0; listedalbums = 0;


// Registar o nosso "main" para quando o DOM está carregado.
// O 'DOMContentLoaded' é executado ligeiramente antes do 'load',
// logo, quando possível, deve ser usado.
document.addEventListener('DOMContentLoaded', function main(e) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/assets/xml/discot.xml');  // Configurar o URL para obter o XML.
    xhr.onload = function xmlLoaded(e) {  // Executado quando o conteúdo é carregado.
        if (xhr.status === 200) {  // OK
            var xml = xhr.responseXML;
            // 'xml' é um documento, tal como o 'document'.
            // Podemos desempenhar as mesmas tarefas nele que no 'document'.

            var appContainer = document.createElement('div');
            appContainer.setAttribute('id', 'app-container');

            
            var bcont = document.createElement('div');
            bcont.setAttribute('id', 'discoteca');
            var topbar = document.createElement('div');
            topbar.setAttribute('class', 'top-bar');
            var stats = document.createElement('div');
            topbar.appendChild(stats);

            //search box for albuns
            var searchAlbum = document.createElement('input');
            searchAlbum.setAttribute('type', 'text'); 
            searchAlbum.setAttribute('value', 'search by album name');
            searchAlbum.setAttribute('size', '30');
            searchAlbum.setAttribute('class', 'searchBox'); 
            searchAlbum.addEventListener('focus', function onFocusAlbum(evt) {
                searchAlbum.setAttribute('value', '');
            });
            searchAlbum.addEventListener('blur', function onBlurAlbum(evt) {
                searchAlbum.setAttribute('value', 'search by album name');
            });
            searchAlbum.addEventListener('input', function onChangeAlbum(evt) {
                var filter = searchAlbum.value, cds;
                var cds = filter != "" ? xml.querySelectorAll(`cd[titulo*="${filter}" i]`) : xml.querySelectorAll(`cd`);
                stats.innerHTML = "";
                stats.insertAdjacentHTML("afterbegin", `<p>${cds.length} of ${totalalbums}</p>`);
                bcont.innerHTML = "";
                if (cds.length != 0) listaCds(cds, bcont); else bcont.innerHTML = "<p><i>no results found</i></p>";
            });
            topbar.appendChild(searchAlbum);
            appContainer.appendChild(topbar);
            appContainer.appendChild(bcont);
            document.body.appendChild(appContainer);


            // Colocar os CDs do XML na página.
            var cds = xml.querySelectorAll('cd');
            totalalbums = cds.length;
            stats.insertAdjacentHTML("afterbegin", `<p>${totalalbums} of ${totalalbums}</p>`);
            listaCds(cds, bcont);


        } else {  // Erro
            console.error(`Status ${xhr.status}`, xhr.responseText);
        }
    };

    xhr.onerror = function communicationsError(e) {  // Problema de comunicação.
        console.error('An error occured.', e);
    };
    xhr.send();  // Enviar o pedido.
});

function putT(tag, parent, container) {
    container.textContent = tag;
    parent.appendChild(container);
}

function getData(from) {
    var dia = from.getAttribute('dia');
    var mes = from.getAttribute('mes');
    var ano = from.getAttribute('ano');
    return `${dia}/${mes}/${ano}`
}

function listaCds(cds, cont) {

    for (var i = 0, ncds = cds.length; i < ncds; i++) {
        //xml.querySelector('cd:nth-of-type(i) > capa').getAttribute('imagMini');
        let cd = cds[i];

        let container = document.createElement('div');
        container.setAttribute('id', `div${i}`);
        container.setAttribute('name', `div${i}`);
      

        var topinfo = document.createElement("div")
        let tracksinfo = document.createElement("div")
        var AlbumCover = document.createElement('img');
        AlbumCover.setAttribute('src', `assets/images/${cd.querySelector('capa').getAttribute('imagMini')}`);
        topinfo.appendChild(AlbumCover);

        var AlbumTitle = document.createElement('H1');
        putT(cd.getAttribute('titulo'), topinfo, AlbumTitle);

        var AlbumAuthor = document.createElement('H2');
        putT("by " + cd.getAttribute('autoria'), topinfo, AlbumAuthor);
       // putT(cd.getAttribute('autoria'), sidebar, AlbumAuthor);

        var AlbumBuy = document.createElement('a');
        AlbumBuy.setAttribute('href', `http://${cd.getAttribute('amazon')}`);
        AlbumBuy.textContent = "Buy on Amazon";
        topinfo.appendChild(AlbumBuy);

        var AlbumEdit = document.createElement('p');
        putT(cd.getAttribute('editora') + " (" + getData(cd.querySelector('data')) + ")", topinfo, AlbumEdit);

 
        AlbumCover.insertAdjacentHTML("afterend", "<br>");

        //search box for tracks
        let olist;
        let searchTracks = document.createElement('input');
        searchTracks.setAttribute('class', 'searchBox'); 
        searchTracks.setAttribute('type', 'text');
        searchTracks.addEventListener('input', function onChangeTracks(evt) {
            var filter = searchTracks.value;
            var olists = tracksinfo.querySelectorAll("ol");
            for (var i = 0, n = olists.length; i < n; i++) {
                while (olists[i].firstChild) {
                    olists[i].removeChild(olists[i].firstChild);
                }
            }
            for (var i = 0, n = olists.length; i < n; i++) {
                var faixas = filter != "" ? cd.querySelectorAll("conteudo")[i].querySelectorAll(`faixa[ref*="${filter}" i]`) : cd.querySelectorAll("conteudo")[i].querySelectorAll(`faixa`);

                console.log(faixas);
                if (faixas.length != 0) listaTracks(faixas, olists[i]); else olists[i].innerHTML = "<p><i>no results found</i></p>";
            }
        });
        tracksinfo.appendChild(searchTracks)
        //coloca a lista de faixas na pagina
        let conteudos = cd.querySelectorAll("conteudo");
        for (var j = 0, n = conteudos.length; j < n; j++) {
            if (n > 1) {
                var DiskNum = document.createElement('H3');
                putT(`Disk ${j + 1}`, tracksinfo, DiskNum);
            }
            olist = document.createElement('ol');
            let faixas = conteudos[j].querySelectorAll('faixa');
            listaTracks(faixas, olist);
            tracksinfo.appendChild(olist);
        }
        container.appendChild(topinfo);
        container.appendChild(tracksinfo);
        cont.appendChild(container);
    }
}

function listaTracks(faixas, olist) {
    for (var k = 0, o = faixas.length; k < o; k++) {
        var faixa = faixas[k];
        var ilist = document.createElement('li');
        putT(faixa.getAttribute('ref'), olist, ilist);
    }
}