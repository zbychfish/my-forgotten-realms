document$.subscribe(function () {
    document.querySelectorAll("table").forEach(function(table) {
        if (!table.classList.contains("dataTable")) {
            
            let headerRow = table.querySelector("thead tr");
            if (headerRow && !headerRow.classList.contains("numbered-th")) {
                let th = document.createElement("th");
                th.innerText = "#";
                headerRow.insertBefore(th, headerRow.firstChild);
                headerRow.classList.add("numbered-th");
            }

            let rowIndex = 1;

            table.querySelectorAll("tbody tr").forEach(function(row) {
                if (!row.classList.contains("numbered-row")) {
                    let td = document.createElement("td");
                    row.insertBefore(td, row.firstChild);
                    row.classList.add("numbered-row");

                    // Zmieniono z "row-" na "q" -> daje ID typu q1, q2, q3...
                    row.id = "q" + rowIndex;
                    rowIndex++;
                }
            });

            // Inicjalizacja DataTables
            let dt = new DataTable(table, {
                order: [],
                pageLength: 25,
                columnDefs: [{
                    targets: 0,
                    data: null,
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                }]
            });

            // Obsługa skoku do wiersza po kliknięciu linku z innej strony (np. #q3)
            if (window.location.hash) {
                let targetId = window.location.hash.substring(1);
                let rowNode = document.getElementById(targetId);
                
                if (rowNode) {
                    let rowIdx = dt.row(rowNode).index();
                    if (rowIdx !== undefined) {
                        let page = Math.floor(rowIdx / dt.page.len());
                        dt.page(page).draw(false);
                        rowNode.classList.add("selected");
                    }
                }
            }
        }
    });
});