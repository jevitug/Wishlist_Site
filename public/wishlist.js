var intitle = document.getElementById("intitle");
var inyear = document.getElementById("inyear");
var inrating = document.getElementById("inrating");
var editClicked = false;

// append edit and delete buttons to each item
function appendEditDelete(movie, title, year, rating) {
    var editspan = document.createElement("span");    
    var pencil = document.createElement('img');
    pencil.setAttribute('src', './pencil.png');
    pencil.setAttribute('height', '20px');
    pencil.setAttribute('width', '20px');
    
    var trash = document.createElement('img');
    trash.setAttribute('src', './trash.png');
    trash.setAttribute('height', '20px');
    trash.setAttribute('width', '20px');

    var delspan = document.createElement("span");  
    editspan.appendChild(pencil);  
    delspan.appendChild(trash);
    editspan.addEventListener('click', () => {
        editspan.setAttribute("id", "editthis");
        editClicked = true;
        let txt = editspan.parentElement.textContent;
        let end = txt.indexOf('(');
        let currtitle = txt.substr(0, end -1)
        let curryear = txt.substr(end+1, 4);
        let colon = txt.search('Rated:');
        let currrating = txt.substring(colon + 7);
        intitle.value = currtitle;
        inyear.value = curryear;
        inrating.value = currrating;
        // set the default values for the dialog
        moviedialog.showModal();
    });
    delspan.addEventListener('click', () => {
        delspan.parentElement.setAttribute("id", "deletethis");
        deletemoviedialog.showModal();
    });
    movie.appendChild(editspan);
    movie.appendChild(delspan);
    return movie;
}

function createMovieItem(title, year, rating) {
    let movie = document.createElement("li");
    let text = document.createTextNode(`${title} (${year}) - Rating: ${rating}`);
    movie.appendChild(text);
    movie = appendEditDelete(movie, title, year, rating);
    document.getElementById("movieList").appendChild(movie);
}
// go through all the elements and append the edit and delete buttons
var movieItems = document.getElementsByTagName("li");
for (let i = 0; i < movieItems.length; i++) {
    let txt = movieItems[i].textContent;
    let end = txt.indexOf('(');
    let title = txt.substr(0, end -1)
    let year = txt.substr(end+1, 4);
    let colon = txt.search('Rated:');
    let rating = txt.substring(colon + 7);
    movieItems[i] = appendEditDelete(movieItems[i], title, year, rating);
}
// delete the movie by deleting the movie w the unique ID
var okdelete = document.getElementById("okdelete");
okdelete.addEventListener('click', () => {
    let deletethis = document.getElementById("deletethis")
    deletethis.remove();
});
// dont delete and change the  unique ID to something safe
var dontdelete = document.getElementById("dontdelete");
dontdelete.addEventListener('click', () => {
    let dontdelete = document.getElementById("deletethis");
    dontdelete.setAttribute("id", "notyet");
})
// add the new movie into the list
var saveMovie = document.getElementById("saveMovie");
saveMovie.addEventListener('click', () => {
    // the selected movie is edited
    if (editClicked) {
        // get the movie that will be edited
        let editthis = document.getElementById("editthis").parentElement;
        editthis.innerHTML = `${intitle.value} (${inyear.value}) - Rated: ${inrating.value}`;
        editthis = appendEditDelete(editthis, intitle.value, inyear.value, inrating.value);
        editClicked = false;
    }
    // a new movie is added to the list
    else {
        createMovieItem(intitle.value, inyear.value, inrating.value);
    }
})
var cancel = document.getElementById("cancel");
cancel.addEventListener('click', () => {
    let editthis = document.getElementById("editthis");
    if (editthis != null) {
        editthis = editthis.parentElement;
        editthis.setAttribute("id", "dontedit");
    }
});
// get the add movie button and give it an event listener
var addButton = document.getElementById('addButton');
addButton.addEventListener('click', () => {
    intitle.value = '';
    inyear.value = '';
    inrating.value = 'G';
    moviedialog.showModal();
});