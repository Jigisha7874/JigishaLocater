document.addEventListener(
  "DOMContentLoaded",
  function () {
    var map = L.map("map").setView([51.505, -0.09], 13);
    // The global variable for the database connection
    var Storage = openDatabase(
      "Locator",
      "1.0",
      "Map locator project",
      1024 * 1024
    );
    var locater = new L.marker([0, 0]);
    createTables();

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }).addTo(map);

    L.control.scale({ imperial: true, metric: true }).addTo(map);

    // The delete all pointer
    const RemoveLocater = () => {
      var deleteRows = "DELETE FROM markers";
      Storage.transaction(function (tx) {
        tx.executeSql(deleteRows, []);
      });
      window.location.href = "index.html";
    };

    // The select all function
    const FIndAll = (callBack) => {
      var chooseAll = "SELECT * FROM markers";
      Storage.transaction(function (tx) {
        tx.executeSql(chooseAll, [], function (tx, result) {
          callBack(result);
        });
      });
    };

    FIndAll(promplocater);

    function promplocater(data) {
      var dataset = data.rows;
      var length = dataset.length;

      if (length > 0) {
        for (var i = 0, item = null; i < length; i++) {
          item = dataset.item(i);
          locater = new L.marker(new L.LatLng(item["lat"], item["lng"]))
            .on("click", onMarkerClick)
            .addTo(map);
        }
      }
    }

    document
      .getElementById("deletepointer")
      .addEventListener("click", RemoveLocater);

    const ToAddPointer = (e) => {
      locater = new L.marker(e.latlng).on("click", onMarkerClick).addTo(map);
      document.getElementById("poppup").show();
      form = document.getElementById("form");
      form.addEventListener("submit", finalvalue);
      lt = e.latlng.lat;
      lg = e.latlng.lng;
    };

    const finalvalue = (event) => {
      event.preventDefault();

      name = document.querySelector("input").value;
      NewPointer(name, lt, lg);
      document.getElementById("Pointervalue").value = "";
      document.getElementById("poppup").hide();
    };

    var form = document.getElementById("form");

    var name = document.getElementById("Pointervalue");
    var lt = 0;
    var lg = 0;

    var popup_btn = document.getElementById("popup-btn");

    const onMarkerClick = (e) => {
      selectMarker(e.latlng.lat, e.latlng.lng);
    };

    map.on("click", ToAddPointer);

    function createTables() {
      var createMarkersTable = "lng VARCHAR(20) NOT NULL);";
      Storage.transaction(function (tx) {
        tx.executeSql(createMarkersTable);
      });
    }

    const NewPointer = (name, lat, lng) => {
      var insert = "INSERT INTO markers (name, lat, lng) VALUES (?, ?, ?)";
      Storage.transaction(function (tx) {
        tx.executeSql(insert, [name, lat, lng]);
      });
    };
  },
  false
);
