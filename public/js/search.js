try {
    const date = new Date();
    document.getElementById("datetime").value = date.toISOString().slice(0, 16);;
} catch (err) {

}
function addValue(item, honnan) {
    if (honnan == "honnan") {
        document.getElementById("honnan").value = item.textContent;
    } else if (honnan == "hova") {
        document.getElementById("hova").value = item.textContent;
    }

}
function search(value) {
    if (value.length === 0) {
        $("#telepulesek").empty();
        $("#telepulesek2").empty();
        return $("#telepulesek").append(`<li> <a class=" dropdown - item" href="#">Kezdj el gépelni a
                    kereséshez</a ></li > `);
    }
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/telepuleskereses/" + value,
        success: function (data) {
            $("#telepulesek").empty();
            $("#telepulesek2").empty();
            data.forEach(i => {
                $("#telepulesek").append(`<li onclick="addValue(this, 'honnan')"><a class="dropdown-item">${i.zip}, ${i.name}</a></li >`);
                $("#telepulesek2").append(`<li onclick="addValue(this, 'hova')"><a class="dropdown-item">${i.zip}, ${i.name}</a></li >`);
            });
        },
    });
}

