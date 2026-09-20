document$.subscribe(function () {

    document.querySelectorAll("table").forEach(function(table) {

        if (!table.classList.contains("dataTable")) {
            new DataTable(table, {
                order: []
            });
        }

    });

});