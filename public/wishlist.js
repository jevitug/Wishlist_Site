var inname = document.getElementById("inname");
var inprice = document.getElementById("inprice");
var incat = document.getElementById("incat");
var inimg = document.getElementById("inimg");
var incom = document.getElementById("incom");
var editClicked = false;
// append edit and delete buttons to each item
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
    let text = document.createTextNode(`${name} ${price} ${cat} ${img} ${com}`);
    item.appendChild(text);
    item = appendEditDelete(item);
    document.getElementById("itemList").appendChild(item);
}
// go through all the elements and append the edit and delete buttons
var myitems = document.getElementsByTagName("li");
for (let i = 0; i < myitems.length; i++) {
    myitems[i] = appendEditDelete(myitems[i]);
}
// delete the item by deleting the item with the unique ID
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
// add the new item into the list
var saveItem = document.getElementById("saveItem");
saveItem.addEventListener('click', () => {
    // the selected item is edited
    if (editClicked) {
        // get the item that will be edited
        let editthis = document.getElementById("editthis").parentElement;
        editthis.innerHTML = `${inname.value} ${inprice.value} ${incat.value} ${inimg.value} ${incom.value}`;
        editthis = appendEditDelete(editthis);
        editClicked = false;
    }
    // a new item is added to the list
    else {
        createItem(inname.value, inprice.value, incat.value, inimg.value, incom.value);
    }
})
var cancel = document.getElementById("cancel");
cancel.addEventListener('click', () => {
    let editthis = document.getElementById("editthis");
    if (editthis != null) {
        // editthis.setAttribute('', '');
        // editthis = editthis.parentElement;
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