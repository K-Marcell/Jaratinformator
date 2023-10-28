function order() {
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var zip = document.getElementById("zip").value * 1;
    var settlement = document.getElementById("settlement").value;
    var street = document.getElementById("street").value;
    var phoneNumber = document.getElementById("phoneNumber").value * 1;

    if (firstName.length === 0 || lastName.length === 0 || zip.toString().length === 0 ||
        settlement.length === 0 || street.length === 0 | phoneNumber.toString().length === 0) {
        return alert("Hiányzó adatok!");
    }
}
document.getElementById("zip").addEventListener("input", function () {
    if (this.value.length === 0) {
        return document.getElementById("settlement").value = "";
    }
    $.ajax({
        type: "GET",
        url: "https://hur.webmania.cc/zips/" + this.value + ".json",
        success: function (data) {
            document.getElementById("settlement").value = data.zips[0].name;
        },
    });
})