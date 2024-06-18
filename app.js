const axios = require("axios");
const cheerio = require("cheerio");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const web = "https://www.bbc.com/";
const csvWriter = createCsvWriter({
  path: "bbc-headline.csv",
  header: [
    { id: "number", title: "NUMBER" },
    { id: "title", title: "TITLE" },
    { id: "description", title: "DESCRIPTION" },
  ],
});

const fetchItems = async () => {
  try {
    const response = await axios.get(web);
    const html = response.data;
    const $ = cheerio.load(html);
    const items = [];

    $("div[data-testid='card-text-wrapper']").each((index, element) => {
      const title = $(element).find("h2[data-testid='card-headline']").text();
      const description = $(element)
        .find("p[data-testid='card-description']")
        .text();

      if (title && description) {
        items.push({ number: index + 1., title, description });
      } else {
        console.log(`Missing title or description for item ${index + 1}`);
      }
    });

    //to check the selector if when running don't give any output
    if (items.length === 0) {
      console.log("No items found. Please check the selector.");
    }

    //insert data to csv file
    await csvWriter.writeRecords(items);
    console.log("Data successfully written to bbc-headline.csv");
  } catch (error) {
    console.log("An error occurred:", error.message);
  }
};

fetchItems();
