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

            // Sortowanie alfabetyczne po Tytule tylko dla tabeli ksiąg
            let isBooksTable = table.id === "books-table";

            // Inicjalizacja DataTables
            let columnDefs = [
                {
                    targets: 0,
                    data: null,
                    width: "2.5rem",
                    render: function (data, type, row, meta) {
                        return meta.row + meta.settings._iDisplayStart + 1;
                    }
                }
            ];

            if (isBooksTable) {
                columnDefs.push({
                    targets: 1,
                    width: "37rem",
                    className: "dt-nowrap"
                });
            }

            let dt = new DataTable(table, {
                order: isBooksTable ? [[1, 'asc']] : [],
                pageLength: 25,
                autoWidth: false,
                language: {
                    search: "Szukaj:",
                    lengthMenu: "Pokaż _MENU_ wpisów",
                    info: "Wpisy _START_–_END_ z _TOTAL_",
                    infoEmpty: "Brak wpisów",
                    infoFiltered: "(przefiltrowano z _MAX_)",
                    paginate: {
                        first: "«",
                        last: "»",
                        next: "›",
                        previous: "‹"
                    },
                    zeroRecords: "Brak wyników"
                },
                columnDefs: columnDefs
            });

            // Tabela zajmuje całą dostępną szerokość kontenera
            table.style.width = "100%";
            dt.columns.adjust();

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
