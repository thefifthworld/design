# Changelog

## v1

### v1.0

#### v1.0.4

Released 20 March 2021

##### Fixed

* Bug fix: There is no `<tcaption>` tag. It's just `<caption>`. Documentation and styles corrected.

##### Added

* Table `<caption>` tags are now automatically numbered (e.g., 'Table 1.', 'Table 2.', and so on).
* New `.footnote` class for `tfoot td` elements styles footnotes for tables.

##### Changed

* JavaScript bundles are now published to `/js/lib` instead of `/js`

#### v1.0.3

Released 10 March 2021

##### Added

- The **Sequence** component
- The **Preformatted text** component

##### Changed

- Fixed the **Pulse** component

#### v1.0.2

Released 28 December 2020

##### Added

- The **Pulse** component
- The **Cover** component
- The **Novel listing** component
- The **Image preview** component

##### Changed

- Improved hyphenation rules.
- Fixed grid on the **File upload** component.
- Fixed uneven columns in the **Page diff** component.
- Fix `checkPath` function in the **Page form** component so that it doesn't flag editing as trying to use an existing path.
- Fixed a bug that could generate multiple click events on the **Like/Unlike** component.

#### v1.0.1

Released 4 October 2020

##### Added

- The **Example Request/Response** component

#### v1.0.2

Released 28 December 2020

##### Fixed

- **Like/Unlike**: Fixed an issue that prompted two events from a single click.
- **Page form**: If the path has an error, render it as open by default. Also, fix how the API is queried.
- **File upload**: Fix margins to line up with other form components.
- **Page diff**: Fixed column width.
- Improved hyphenation rules.

##### Added

- The **Image preview** component
- The **Novel listing** component
- The **Cover** component
- The **Pulse** component