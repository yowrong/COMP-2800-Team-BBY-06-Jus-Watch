document.body.innerHTML =
    `<div>'
        <div id="group-list"></div>
    </div>`;

let groupSection = document.getElementById("group-list");
let name = ["Test Movie"];
let desc = ["Test Description"];
let id = ["TestID"];

function renderGroups(id, name, desc, groupSection) {
    let groupCard = "";
    for (let i = 0; i < id.length; i++) {

        // Bootstrap card template, "Enter Group" button redirects to Group Center page
        groupCard += `<div class="card mb-3" style="max-width: 540px;">
    <div class="row g-0">
    <div class="col-md-4">
    <!-- <img src="..." alt="..."> -->
    </div>
    <div class="col-md-8">
    <div class="card-body">
    <h5 class="card-title">${name[i]}</h5>
    <p class="card-text">${desc[i]}</p>
    <a href="./index.html?${id[i]}">
    <button id="${id[i]}" type="button" class="btn btn-primary btn-lg enter">Enter Group</button>
    </a>
    </div>
    </div>
    </div>
    </div>`;
    }
    groupSection.innerHTML = groupCard;
}

test("Sets groupSection's innerHTML to display group cards", () => {
    renderGroups(id, name, desc, groupSection);

    expect(groupSection.innerHTML).toEqual(`<div class="card mb-3" style="max-width: 540px;">
    <div class="row g-0">
    <div class="col-md-4">
    <!-- <img src="..." alt="..."> -->
    </div>
    <div class="col-md-8">
    <div class="card-body">
    <h5 class="card-title">Test Movie</h5>
    <p class="card-text">Test Description</p>
    <a href="./index.html?TestID">
    <button id="TestID" type="button" class="btn btn-primary btn-lg enter">Enter Group</button>
    </a>
    </div>
    </div>
    </div>
    </div>`);
});