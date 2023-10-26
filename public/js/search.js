try {
    const date = new Date();
    document.getElementById("datetime").value = date.toISOString().slice(0, 16);;
} catch (err) {

}
function readJSON(file) {
    var request = new XMLHttpRequest();
    request.open('GET', file, false);
    request.send(null);
    if (request.status == 200)
        return request.responseText;
};
var temp = readJSON('../json/telepulesek.json');

function search(value) {


}



