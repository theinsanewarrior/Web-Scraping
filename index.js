const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;


const movies = ["https://www.imdb.com/title/tt0242519/?ref_=nv_sr_srsg_3",
    "https://www.imdb.com/title/tt0419058/?ref_=tt_sims_tt_i_1",
    "https://www.imdb.com/title/tt9208876/?ref_=tt_rvi_tt_i_3",
];

(async() => {
        let imdbData = []
        
        for(let movie of movies){
            const response = await request({
                uri: movie,
                headers: {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "accept-encoding": "gzip, deflate, br",
                    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                },
                gzip: true
            });
    
    
            let $ = cheerio.load(response);
            const title = $('h1[class="TitleHeader__TitleText-sc-1wu6n3d-0 dxSWFG"]').text()
            const rating = $('span[class="AggregateRatingButton__RatingScore-sc-1ll29m0-1 iTLWoV"]').text()
            const summary = $('span[class="GenresAndPlot__TextContainerBreakpointXL-cum89p-2 gCtawA"]').text()
    
            imdbData.push({
                title, 
                rating, 
                summary,
            });
        }

        const j2cp = new json2csv();
        const csv = j2cp.parse(imdbData);

        fs.writeFileSync("./imdb.csv", csv, "utf-8");
    }
)()