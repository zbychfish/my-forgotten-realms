"""Hooki MkDocs."""

import re

# Licznik lokacji w dividerze: "Beregost&nbsp;<span class="cb">5</span>" ->
# w spisie treści zostaje sam tytuł "Beregost".
_COUNTER = re.compile(r"(?:&nbsp;|\xa0).*$")


def _strip_counters(items):
    for item in items:
        item.title = _COUNTER.sub("", item.title)
        _strip_counters(item.children)


def _count(items):
    return sum(1 + _count(item.children) for item in items)


def on_page_content(html, page, config, files):
    _strip_counters(page.toc)

    # Spis z 0-1 wpisem jest zbędny - opróżniamy go, ale kolumnę panelu
    # zostawiamy (bez `hide: [toc]`), żeby układ strony był stały.
    if _count(page.toc) < 2:
        page.toc.items.clear()

    # Tabela ksiąg: dodaj id="books-table" do pierwszej tabeli na stronie books
    if page.file.src_path in ("other/books.md", "other\\books.md") or page.file.src_path.endswith("books.md"):
        html = html.replace("<table>", '<table id="books-table">', 1)

    return html
