// @ts-check

var cds;
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


            //search box for albuns
            var searchAlbum = document.createElement('input');
            searchAlbum.setAttribute('type', 'text');
            searchAlbum.setAttribute('id', 'searchAlbum');
            searchAlbum.setAttribute('name', 'searchAlbum');
            searchAlbum.addEventListener('input', function onChangeAlbum(evt) {
                //                evt.preventDefault();
                var filter = searchAlbum.value.toUpperCase();
                var albuns = document.querySelectorAll('div');
                for (var i = 0, l = albuns.length; i < l; i++) {
                    if (albuns[i].querySelector('h1').textContent.toUpperCase().includes(filter)) {
                        albuns[i].style.display = "";
                    } else {
                        albuns[i].style.display = "none";
                    }
                }
            });
            document.body.appendChild(searchAlbum);

            // Colocar os CDs do XML na página.
            cds = xml.querySelectorAll('cd');
            for (var i = 0, ncds = cds.length; i < ncds; i++) {
                //xml.querySelector('cd:nth-of-type(i) > capa').getAttribute('imagMini');
                var cd = cds[i];

                let container = document.createElement('div');
                container.setAttribute('id', `div${i}`);
                container.setAttribute('name', `div${i}`);
                container.insertAdjacentHTML("afterbegin", "<hr>");

                var AlbumTitle = document.createElement('H1');
                putT(cd.getAttribute('titulo'), container, AlbumTitle);

                var AlbumAuthor = document.createElement('H2');
                putT("by " + cd.getAttribute('autoria'), container, AlbumAuthor);

                var AlbumBuy = document.createElement('a');
                AlbumBuy.setAttribute('href', `http://${cd.getAttribute('amazon')}`);
                AlbumBuy.textContent = "Buy on Amazon";
                container.appendChild(AlbumBuy);

                var AlbumEdit = document.createElement('p');
                putT(cd.getAttribute('editora') + " (" + getData(cd.querySelector('data')) + ")", container, AlbumEdit);

                var AlbumCover = document.createElement('img');
                AlbumCover.setAttribute('src', `assets/images/${cd.querySelector('capa').getAttribute('imagMini')}`);
                container.appendChild(AlbumCover);

                AlbumCover.insertAdjacentHTML("afterend", "<br>");

                //search box for tracks
                let searchTracks = document.createElement('input');
                searchTracks.setAttribute('type', 'text');
                searchTracks.setAttribute('id', `searchTracks${i}`);
                searchTracks.setAttribute('name', `searchTracks${i}`);
                searchTracks.addEventListener('input', function onChangeTracks(evt) {
                    // evt.preventDefault();
                    // evt.stopPropagation();
                    var filter = searchTracks.value.toUpperCase();
                    let tracks = container.querySelectorAll('li');
                    for (var j = 0, l = tracks.length; j < l; j++) {
                        if (tracks[j].textContent.toUpperCase().includes(filter)) {
                        //if (a.indexOf(filter) > -1) {
                            tracks[j].style.display = "";
                        } else {
                            tracks[j].style.display = "none";
                        }
                    }
                });
                container.appendChild(searchTracks);


                var conteudos = cd.querySelectorAll("conteudo");
                for (var j = 0, n = conteudos.length; j < n; j++) {
                    if (n > 1) {
                        var DiskNum = document.createElement('H3');
                        putT(`Disk ${j + 1}`, container, DiskNum);
                    }
                    var olist = document.createElement('ol');
                    var faixas = conteudos[j].querySelectorAll('faixa');
                    for (var k = 0, o = faixas.length; k < o; k++) {
                        var faixa = faixas[k];
                        var ilist = document.createElement('li');
                        putT(faixa.getAttribute('ref'), olist, ilist);
                    }
                    container.appendChild(olist);
                }
                document.body.appendChild(container);
            }

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
