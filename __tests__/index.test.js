const evalulate = require("../index");


test("Complex tag and basic text", () => {
  expect(evalulate("bq\tHi")).toBe("<blockquote>Hi</blockquote>");
});
test("Code Sanitation", () => {
  expect(evalulate("p\t<")).toBe("<p>&lt;</p>");
});
test("Complex text (Basic)", () => {
  expect(evalulate("p\tHello! /b\tHi/ Bye!")).toBe(
    "<p>Hello! <b>Hi</b> Bye!</p>"
  );
});
test("Complex text (At end)", () => {
  expect(evalulate("p\tHello! /b\tHi/")).toBe(
    "<p>Hello! <b>Hi</b></p>"
  );
});
test("Complex text (At start)", () => {
  expect(evalulate("p\t/b\tText/")).toBe(
    "<p><b>Text</b></p>"
  );
});
test("Complex text (Double-bound)", () => {
  expect(evalulate("p\tStart /b\tBold /i\tItalic// End")).toBe(
    "<p>Start <b>Bold <i>Italic</i></b> End</p>"
  );
});
test("Multiple lines", () => {
  expect(evalulate("h1\tHeading 1\np\t/u\tUnderlined text/ is cool")).toBe("<h1>Heading 1</h1><p><u>Underlined text</u> is cool</p>");
});
test("Lacking line separation", () => {
  expect(evalulate("p\tText...\n\t text...")).toBe("<p>Text... text...</p>");
});
test("No start tag", () => {
  expect(evalulate("\tHi")).toBe("Hi");
});
