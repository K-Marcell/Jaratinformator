try {
    const date = new Date();
    document.getElementById("datetime").value = date.toISOString().slice(0, 16);;
} catch (err) {

}

var fromWhere = "";
var where = ""
function addValue(item, honnan) {
    if (honnan == "honnan") {
        document.getElementById("honnan").value = item.textContent;
        fromWhere = item.textContent.split(" ")[1];
        console.log(fromWhere)
    } else if (honnan == "hova") {
        document.getElementById("hova").value = item.textContent;
        where = item.textContent.split(" ")[1];
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
function keres() {
    var startDate = document.getElementById("startDate");

    if (fromWhere.length === 0 || where.length === 0) {
        return $("#list").append(`<div class="alert alert-danger" role="alert">Minden mező kitöltendő!</div>`);
    }
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/trips",
        success: function (data) {
            $("#list").empty();

            data.forEach(i => {

            });
        },
    });
}
function getCard(fromWhere, startDate, arrivalDate, where) {
    return `
    <div class="busStop mt-3 mb-2">
                    <div class="d-flex justify-content-center"></div>
                    <div class="row">
                        <div class="col-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor"
                                class="bi bi-bus-front" viewBox="0 0 16 16">
                                <path
                                    d="M5 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-6-1a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H7Zm1-6c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9c1.876 0 3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44.303 44.303 0 0 0 8 4Zm0-1c-1.837 0-3.353.107-4.448.22a.5.5 0 1 1-.104-.994A44.304 44.304 0 0 1 8 2c1.876 0 3.426.109 4.552.226a.5.5 0 1 1-.104.994A43.306 43.306 0 0 0 8 3Z" />
                                <path
                                    d="M15 8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1V2.64c0-1.188-.845-2.232-2.064-2.372A43.61 43.61 0 0 0 8 0C5.9 0 4.208.136 3.064.268 1.845.408 1 1.452 1 2.64V4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v3.5c0 .818.393 1.544 1 2v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V14h6v1.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2c.607-.456 1-1.182 1-2V8ZM8 1c2.056 0 3.71.134 4.822.261.676.078 1.178.66 1.178 1.379v8.86a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5V2.64c0-.72.502-1.301 1.178-1.379A42.611 42.611 0 0 1 8 1Z" />
                            </svg>
                        </div>
                        <div class="col-sm-2 ms-5 mb-3">
                            <div>
                                <p class="fromWhere">HONNAN:</p>
                                <p class="ms-4 settlement d-flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="bi bi-pin me-2" style="margin-top: 5px;" viewBox="0 0 16 16">
                                        <path
                                            d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354zm1.58 1.408-.002-.001.002.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a4.922 4.922 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a4.915 4.915 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.775 1.775 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14c.06.1.133.191.214.271a1.78 1.78 0 0 0 .37.282z" />
                                    </svg>
                                    ${fromWhere}
                                </p>
                            </div>
                        </div>
                        <div class="col-sm-3 mb-3">
                            <div class="d-flex">
                                <div class="timeLine">
                                    <div class="cyl"></div>
                                    <div class="line"></div>
                                    <div class="cyl"></div>
                                </div>

                            </div>
                            <p class="text-center time">${startDate} - ${arrivalDate}</p>


                        </div>
                        <div class="col-sm-4 mb-3">
                            <div class="ms-5">
                                <p class="fromWhere">HOVA:</p>
                                <p class="ms-4 settlement d-flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="bi bi-pin me-2" style="margin-top: 5px;" viewBox="0 0 16 16">
                                        <path
                                            d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5c0 .276-.224 1.5-.5 1.5s-.5-1.224-.5-1.5V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354zm1.58 1.408-.002-.001.002.001zm-.002-.001.002.001A.5.5 0 0 1 6 2v5a.5.5 0 0 1-.276.447h-.002l-.012.007-.054.03a4.922 4.922 0 0 0-.827.58c-.318.278-.585.596-.725.936h7.792c-.14-.34-.407-.658-.725-.936a4.915 4.915 0 0 0-.881-.61l-.012-.006h-.002A.5.5 0 0 1 10 7V2a.5.5 0 0 1 .295-.458 1.775 1.775 0 0 0 .351-.271c.08-.08.155-.17.214-.271H5.14c.06.1.133.191.214.271a1.78 1.78 0 0 0 .37.282z" />
                                    </svg>
                                    ${where}
                                </p>
                            </div>
                        </div>

                    </div>


                </div>

    `;
}

