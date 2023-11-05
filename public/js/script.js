function quickset(id, val) {
    document.getElementById(id).value = val.innerHTML.split('<')[0];
}