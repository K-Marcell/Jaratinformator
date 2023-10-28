var taxiid = -1;
function order() {
    var firstName = document.getElementById("firstName").value;
    var lastName = document.getElementById("lastName").value;
    var zip = document.getElementById("zip").value * 1;
    var settlement = document.getElementById("settlement").value;
    var street = document.getElementById("street").value;
    var phoneNumber = document.getElementById("phoneNumber").value * 1;

    if (firstName.length === 0 || lastName.length === 0 || zip.toString().length === 0 ||
        settlement.length === 0 || street.length === 0 | phoneNumber.toString().length === 0 || taxiid == -1) {
        return alert("Hiányzó adatok!");
    }
    var url = "http://localhost:3000/ordertaxi/" +
        taxiid + "/" + firstName + " " + lastName + "/" + zip + " " + settlement + " " + street + "/" + phoneNumber;
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            alert(data);


        },
    });
}
document.getElementById("zip").addEventListener("input", function () {
    if (this.value.length === 0) {
        return document.getElementById("settlement").value = "";
    }
    $.ajax({
        type: "GET",
        url: "https://hur.webmania.cc/zips/" + this.value + ".json",
        success: function (data) {
            // a try-catch azért szükséges, hogy ne írjon olyankor hibát, mikor az írányitó szám nincs teljesen beírva
            try {
                document.getElementById("settlement").value = data.zips[0].name;
            } catch (err) {

            }

        },
    });
})

function loadDrivers() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/getAllTaxi",
        success: function (data) {
            $("#drivers").empty();
            data.forEach(i => {
                $("#drivers").append(`<li onclick="chooseTaxi(${i.id}, this)"><a class="dropdown-item">${i.driver} (${i.car}) (${i.lpn.toUpperCase()})</a></li>`);
            })

        },
    });

}
loadDrivers();
function chooseTaxi(id, item) {
    taxiid = id;
    document.getElementById("responseText").textContent = item.textContent;
    console.log(id);
}

