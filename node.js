const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url')

////////////////////////////
//FILES 
//blocking
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// const textOut = `This is what we know about the avocado: ${textIn}. \n Created on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log('File written!')


//non blocking
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2)
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3)
//             fs.writeFile('./txt/final.txt',`${data2}\n${data3}`, 'utf-8', err =>{
//                 console.log('File has been written 🚙')
//             })
//         })
//     })
// })
// console.log('Will read file!')

///////////////////////////////
//SERVER
const replaceTemplate = (temp, product) =>{
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    return output
}
const tempOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const tempProduct = fs.readFileSync('./templates/template-product.html', 'utf-8');
const data = fs.readFileSync('./dev-data/data.json', 'utf-8')

const productData = JSON.parse(data)



const server = http.createServer((req, res)=>{
    // console.log(req.url)
    const {query, pathname} = (url.parse(req.url, true))

    //overview page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type': 'text/html'})

        const cardsHtml = productData.map(el => replaceTemplate(tempCard, el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output)

    //product page
    }else if(pathname === '/product') {
        // console.log(query)
        res.writeHead(200, {'Content-type': 'text/html'})
        const product = productData[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)

    //api
    }else if(pathname === '/api'){
        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data)

    //not found
    }else{
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-header': "hello-world"
        });
        res.end('<h2>This page cannot be found</h2>')
    }}
)

server.listen(8000, '127.0.0.1', () => {
    console.log("The server is running! Port 8000")
})




