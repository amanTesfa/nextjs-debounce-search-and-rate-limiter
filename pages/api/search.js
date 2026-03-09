// pages/api/search.js

export default function handler(req, res) {
  const { q } = req.query;
  const data = [
    "Apple",
    "mango",
    "Orange",
    "Pineapple",
    "Strawberry",
    "Watermelon",
    "Avocado",
    "Blueberry",
    "Cantaloupe",
    "Fig",
    "Grapefruit",
    "Kiwi",
    "Lemon",
    "Lime",
    "Melon",
    "Nectarine",
    "Papaya",
    "Peach",
    "Pear",
    "Plum",
    "Raspberry",
    "Strawberry",
    "Tangerine",
    "Ugli fruit",
    "Vanilla",
    "Watermelon",
    "Xigua",
    "Yellow passion fruit",
    "Zucchini",
    "Apricot",
    "Banana",
    "Cherry",
    "Date",
    "Elderberry",
    "Fig",
    "Grape",
    "Honeydew",
  ];
  const results = data.filter((item) =>
    item.toLowerCase().includes((q || "").toLowerCase()),
  );
  res.status(200).json({ results });
}
