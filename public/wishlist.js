var inname = document.getElementById("inname");
var inprice = document.getElementById("inprice");
var incat = document.getElementById("incat");
var inimg = document.getElementById("inimg");
var incom = document.getElementById("incom");
var editClicked = false;
var myStorage = window.localStorage;

// onload check if the username/access_token is not in local storage
if (!('userkey' in myStorage) || !('tokenkey' in myStorage)) {
    window.location.href = './login.html';
}

function appendEditDelete(item) {
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
        let txt = editspan.parentElement.textContent.split(' ');
        let name = txt[0];
        let price = txt[1].replace('$', '');
        let cat = txt[2];
        let img = txt[3];
        let com = txt[4];
        // set the default values for the input boxes
        inname.value = name;
        inprice.value = price;
        incat.value = cat;
        inimg.value = img;
        incom.value = com;
        itemdialog.showModal();
    });
    delspan.addEventListener('click', () => {
        delspan.parentElement.setAttribute("id", "deletethis");
        deleteitemdialog.showModal();
    });
    item.appendChild(editspan);
    item.appendChild(delspan);
    return item;
}

function createItem(name, price, cat, img, com) {
    let item = document.createElement("li");
    let section = document.createElement('section');
    section.className ='listItem';
    
    let tdiv = document.createElement('div');
    tdiv.className = 'textBlock';
    let pspan = document.createElement('span');
    pspan.className = 'itemPrice';
    pspan.innerHTML = "$" + price;
    let nspan = document.createElement('span');
    nspan.className = 'itemName';
    nspan.innerHTML = name;
    let cspan = document.createElement('span');
    cspan.className = 'itemCat';
    cspan.innerHTML = cat;
    tdiv.appendChild(pspan);
    tdiv.appendChild(nspan);
    tdiv.appendChild(cspan);

    let idiv = document.createElement('div');
    idiv.className = 'itemImg';
    let currImg = document.createElement('img');
    currImg.src = img;
    currImg.height = '400';
    currImg.width = '600';
    let currCom = document.createElement('p');
    currCom.className = 'itemCom';
    currCom.innerHTML = com;
    idiv.appendChild(currImg);
    idiv.appendChild(currCom);

    // let text = document.createTextNode(`${name} ${price} ${cat} ${img} ${com}`);
    // item.appendChild(text);
    section.appendChild(tdiv);
    section.appendChild(idiv);
    item.appendChild(section);
    item = appendEditDelete(item);
    document.getElementById("itemList").appendChild(item);
}

var data = null;
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        console.log(this.responseText);
        let txt = JSON.parse(this.responseText).wishItems;
        // iterating through all the items and saving the name and id into local storage
        for(let i = 0; i < txt.length; i++){
            myStorage[txt[i].item] = txt[i].id;
            createItem(txt[i].item, txt[i].price, txt[i].category, txt[i].image, txt[i].comment);
        }
    }
});
xhr.open("GET", `http://fa19server.appspot.com/api/wishlists/myWishlist?access_token=${myStorage['tokenkey']}`);
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
xhr.send(data);

// delete the item by deleting the item with the unique ID
var okdelete = document.getElementById("okdelete");
okdelete.addEventListener('click', () => {
    let deletethis = document.getElementById("deletethis");
    console.log(deletethis);
    // deletes the item from myStorage
    let itemvals = deletethis.textContent.split(' ');
    let name = itemvals[0];
    let itemid = myStorage[name];
    myStorage.removeItem(name);
    var data = null;
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
    if (this.readyState === 4) {
        console.log(this.responseText);
    }
    });

    xhr.open("DELETE", `http://fa19server.appspot.com/api/wishlists/${itemid}?access_token=${myStorage['tokenkey']}`);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);

    deletethis.remove();
});
// dont delete and change the  unique ID to something safe
var dontdelete = document.getElementById("dontdelete");
dontdelete.addEventListener('click', () => {
    let dontdelete = document.getElementById("deletethis");
    dontdelete.setAttribute("id", "notyet");
})
// add the new item into the list
var saveItem = document.getElementById("saveItem");
saveItem.addEventListener('click', () => {
    // the selected item is edited
    if (editClicked) {
        // get the item that will be edited
        let editthis = document.getElementById("editthis").parentElement;
        let txt = editthis.textContent.split(' ');
        let name = txt[0];
        let itemid = myStorage[name];
        editthis.innerHTML = `${inname.value} ${inprice.value} ${incat.value} ${inimg.value} ${incom.value}`;
        editthis = appendEditDelete(editthis);
        editClicked = false;
        var data = `item=${inname.value}&price=${inprice.value}&category=${incat.value}&image=${inimg.value}&comment=${incom.value}`;
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
        }
        });

        xhr.open("POST", `http://fa19server.appspot.com/api/wishlists/${itemid}/replace?access_token=${myStorage['tokenkey']}`);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }
    // a new item is added to the list and added to the backend array
    // the item is also added to the local storage
    else {
        createItem(inname.value, inprice.value, incat.value, inimg.value, incom.value);
        var data = `item=${inname.value}&price=${inprice.value}&category=${incat.value}&image=${inimg.value}&comment=${incom.value}`;
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            console.log(this.responseText);
        }
        });

        xhr.open("POST", `http://fa19server.appspot.com/api/wishlists?access_token=${myStorage['tokenkey']}`);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(data);
    }
})
var cancel = document.getElementById("cancel");
cancel.addEventListener('click', () => {
    let editthis = document.getElementById("editthis");
    if (editthis != null) {
        editthis.setAttribute("id", "dontedit");
        editClicked = false;
    }
});
// get the add item button and give it an event listener
var addButton = document.getElementById('addButton');
addButton.addEventListener('click', () => {
    inname.value = '';
    inprice.value = '';
    incat.value = '';
    inimg.value = '';
    incom.value = '';
    itemdialog.showModal();
});

// get the logout button and give it an event listener
// Send a request to the endpoint and remove the tokenkey and userkey 
// for the localstorage and navigate the user to the login page
var logoutButton = document.getElementById('logoutButton');
logoutButton.addEventListener('click', () => {
    var data = null;

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
            myStorage.removeItem('tokenkey');
            myStorage.removeItem('userkey');
            window.location.href = './login.html';
        }
    });
    xhr.open("POST", `http://fa19server.appspot.com/api/Users/logout?access_token=${myStorage['tokenkey']}`);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(data);
})