import { test } from "node:test";
import assert from "node:assert/strict";
import { translateHindiText } from "../../revenex/src/lib/hindi-text";
import dictionary from "../../revenex/src/lib/hi-text.json";

test("Hindi catalog covers the complete public site, not only navigation", () => {
  assert.ok(Object.keys(dictionary).length > 1700);
  for (const phrase of [
    "Products", "Principal Dashboard", "Student Management", "Your full name",
    "Something went wrong. Please try again.", "Your Name *", "Submit Review",
    "Go Live", "Report Cards", "Daily tracking", "Software Solutions",
    "1. Acceptance of Terms", "1. Information We Collect", "Dashboard Overview",
    "Biometric Scan Zone", "School principal discussing requirements with a Revenex consultant on a video call",
  ]) {
    const translated = translateHindiText(phrase, "hi");
    assert.notEqual(translated, phrase, phrase);
    assert.match(translated, /[\u0900-\u097f]/u, phrase);
  }
});

test("changing to English restores original presentation values exactly", () => {
  const values = ["Attendance", "  Schedule a Demo ", "REVENEX", "एक विद्यालय"];
  for (const value of values) assert.equal(translateHindiText(value, "en"), value);
  const element = { type: "div", props: { children: "Attendance" } };
  assert.equal(translateHindiText(element, "hi"), element);
  assert.equal(translateHindiText(42, "hi"), 42);
});

test("Hindi handles mixed acronyms, sample classes, countdowns and dates", () => {
  assert.equal(translateHindiText("REVENEX के साथ", "hi"), "रेवेनेक्स के साथ");
  assert.equal(translateHindiText("स्कूल ERP प्लेटफॉर्म", "hi"), "स्कूल ईआरपी प्लेटफॉर्म");
  assert.equal(translateHindiText("Class X-A", "hi"), "कक्षा दसवीं-अ");
  assert.equal(translateHindiText("Starts in 12m 5s", "hi"), "12 मिनट 5 सेकंड में शुरू");
  assert.equal(translateHindiText("Jun 2026", "hi"), "जून 2026");
  assert.equal(translateHindiText("Contacted", "hi"), "संपर्क किया गया");
  assert.equal(translateHindiText("COMPLETED", "hi"), "पूरा हुआ");
  assert.equal(translateHindiText("  Attendance ", "hi"), "  उपस्थिति ");
});

test("Hindi never rewrites public addresses, URLs or contact details", () => {
  for (const value of ["team@revenex.in", "https://www.revenex.in/book-demo", "/book-demo", "+91 90217 44355"]) {
    assert.equal(translateHindiText(value, "hi"), value);
  }
});
