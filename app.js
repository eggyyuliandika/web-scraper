
const axios = require("axios");
const cheerio = require("cheerio");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const web = "https://www.bbc.com/";
const csvWriter = createCsvWriter({
  path: "bbc-headline.csv",
  header: [{ id: "title", title: "TITLE" }],
});

const fetchTitles = async () => {
  try {
    const response = await axios.get(web);
    const html = response.data;
    const $ = cheerio.load(html);
    const titles = [];

    $("h2.sc-4fedabc7-3.zTZri").each((index, element) => {
      const title = $(element).text();
      titles.push({ title });
    });

    //to check the selector if when running don't give any output
    if (titles.length === 0) {
      console.log("No titles found. Please check the selector.");
    }

    //insert data to csv file
    await csvWriter.writeRecords(titles);
    console.log("Data successfully written to titles.csv");
  } catch (error) {
    console.log("An error occurred:", error.message);
  }
};

fetchTitles();

