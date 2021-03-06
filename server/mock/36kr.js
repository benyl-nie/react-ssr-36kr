import fetch from './fetch';
import https from 'https';

class Mock {
    fetchFlash(b_id, page = 10) {
        return fetch('/newsflash', { per_page: page, ...(b_id ? { b_id } : {}) })
    }

    fetchColumn(page = 1) {
        return fetch('/search-column/23', { per_page: 10, page })
    }

    fetchDetail(id = 5186022) {
        return new Promise(resolve => {
            https.get(`https://36kr.com/p/${id}.html`, res => {
                let htmlBuffer = [];
                let bufLength = 0;
                res.on('data', chunk => {
                    htmlBuffer.push(chunk);
                    bufLength += chunk.length;
                });
                res.on('end', () => {
                    const chunkAll = Buffer.concat(htmlBuffer, bufLength);
                    chunkAll.toString().replace(/var props={"detailArticle|post":{([\s\S]*?),"extra"/g, (_, word) => {
                        if (word) {
                            resolve(JSON.parse(`{${ word }}`))
                        }
                    });
                })
            })
        })
    }
}

export default new Mock();