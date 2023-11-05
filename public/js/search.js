try {
    const date = new Date();
    document.getElementById("datetime").value = date.toISOString().slice(0, 16);;
} catch (err) {

}

function search(value, id, ids) {
    console.log("hi");
    if (value.length === 0) {
        var list = document.getElementById(id);
        for(var k = 0; k < list.children.length; k++) {
            list.children[k].children[0].style.display = "none";
                var ele = list.children[k].children[0];
                ele.style.display = "none";
                ele = document.getElementById(ids);
                ele.style.display = "block";
        }
    }
    if (value.length > 0){
    var list = document.getElementById(id);
    for(var k = 0; k < list.children.length; k++) {
        if (list.children[k].children[0].innerHTML.toLowerCase().includes(value.toLowerCase())){
            var ele = list.children[k].children[0];
            ele.style.display = "block";
            console.log("hi");
        }
        else{
            var ele = list.children[k].children[0];
            ele.style.display = "none";
        }
    }
}
}
function keres() {
    var startDate = document.getElementById("datetime");
    var fromWhere = document.getElementById('quickset');
    var where = document.getElementById('quickset2');
    if (fromWhere.value === "" || where.value === "") {
        return $("#list").append(`<div class="alert alert-danger" role="alert">Minden mező kitöltendő!</div>`);
    }
    document.getElementById("fromWhere").innerHTML = fromWhere.value;
    document.getElementById("where").innerHTML = where.value;
    // $("#list").append(getCard(a,b,c,d))

}
