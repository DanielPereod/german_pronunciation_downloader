import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as https from "https";
import { OutgoingHttpHeader } from "http";
import * as chrome from "chrome-cookies-secure";
import * as readline from "readline";

class Downloader {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  saveCookieOnDatabase = async () => {
    await chrome.getCookies("https://es.forvo.com/", async (err, cookies) => {
      const cookie = `__cfduid=${cookies["__cfduid"]}; PHPSESSID=${cookies["PHPSESSID"]};`;
      fs.writeFileSync("cookies", cookie);
    });
  };

  cookieLoader = async () => {
    const data = fs.readFileSync("cookies", { encoding: "utf8", flag: "r" });
    return data;
  };
  downloadLinks = async (link: string, cookie: OutgoingHttpHeader) => {
    try {
      const filename = link.split("/")[5];
      const file = fs.createWriteStream(`./audios/${filename}.mp3`);
      const request = https.get(
        link,
        {
          headers: {
            cookie: cookie,
          },
        },
        (response) => {
          response.pipe(file);
        }
      );
    } catch (error) {
      return;
    }
  };

  scrapLinksByWord = async (word: string) => {
    try {
      const pageContent = await axios.get(
        `https://es.forvo.com/word/${word}/#de`
      );
      const $ = cheerio.load(pageContent.data);
      const data_id_element = $(
        "#language-container-de > article:nth-child(1) > ul > li:nth-child(1) > div > div > div"
      ).get();

      const data_id = data_id_element[0].attribs["data-id"];
      console.log(
        `Downloading`,
        `https://es.forvo.com/download/mp3/${word}/de/${data_id}`
      );
      return `https://es.forvo.com/download/mp3/${word.toLocaleLowerCase()}/de/${data_id}`;
    } catch (error) {
      return;
    }
  };

  recursiveAsyncReadLine = async () => {
    try {
      this.rl.question("Word: ", async (answer) => {
        if (answer == "exit") return this.rl.close();
        const cookie = await this.cookieLoader();
        const link = await this.scrapLinksByWord(answer);
        await this.downloadLinks(link, cookie);
        this.recursiveAsyncReadLine();
      });
    } catch (error) {
      this.rl.question("Word: ", async (answer) => {
        if (answer == "exit") return this.rl.close();
        const cookie = await this.cookieLoader();
        const link = await this.scrapLinksByWord(answer);
        await this.downloadLinks(link, cookie);

        this.recursiveAsyncReadLine(); //Calling this function again to ask new question
      });
    }
  };
}

async function init() {
  const downloader = new Downloader();
  await downloader.saveCookieOnDatabase();
  await downloader.recursiveAsyncReadLine();
}
init();
