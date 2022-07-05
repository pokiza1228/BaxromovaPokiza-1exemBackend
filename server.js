const http=require('http')
const {read, write}=require('./utils/FS.js')

const server=http.createServer((req,res)=>{
    const url1=req.url.split('/')[1]
    const url2=req.url.split('/')[2]
    const options={
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin':'*'
    }
    //market get 
    if(req.method=='GET'){
        const market=read('./model/markets.json')
        const branchs=read('./model/branches.json')
        const worker=read('./model/workers.json')
        const product=read('./model/products.json')
        if(url1=='markets'){
            const marketFound=market.find(e=>e.id==url2)
            if (marketFound){
                marketFound.branches= branchs.filter(e=>e.id==marketFound.baranjsId.find(el=>el==e.id))
                delete marketFound.baranjsId

                marketFound.branches.forEach(element => {
                    element.workers=worker.filter(ishchi=>ishchi.id==element.workersId.find(e=>e==ishchi.id))
                    delete element.workersId
                })

                marketFound.branches.forEach(element => {
                    element.products=product.filter(e=> e.id==element.productsId.find(p=>p==e.id))  
                    delete element.productsId
                })
               
                res.writeHead(200,options)
                return res.end(JSON.stringify(marketFound))
            }
            res.writeHead(200,options)
            return res.end(JSON.stringify(market))
        }
        if(url1=='branchs') {
            const branch=branchs.find(e=>e.id==url2)
            if(branch) {
                
                branch.workers=worker.filter(ishchi=>ishchi.id==branch.workersId.find(e=>e==ishchi.id))
                delete branch.workersId
    
                branch.products=product.filter(e=> e.id==branch.productsId.find(p=>p==e.id))  
                delete branch.productsId
                res.writeHead(200,options)
                return res.end(JSON.stringify(branch))
            }
            return
        }
        if (url1=='product'){
            const branch=branchs.find(e=>e.id==url2)
            if(branch) {
                delete branch.workersId
    
                branch.products=product.filter(e=> e.id==branch.productsId.find(p=>p==e.id))  
                delete branch.productsId
                res.writeHead(200,options)
                return res.end(JSON.stringify(branch))
            }
            return
        }
        if (url1=='workers'){
            const branch=branchs.find(e=>e.id==url2)
            if(branch) {
                branch.workers=worker.filter(ishchi=>ishchi.id==branch.workersId.find(e=>e==ishchi.id))
                delete branch.workersId
    
                delete branch.productsId
                res.writeHead(200,options)
                return res.end(JSON.stringify(branch))
            }
            return
        }
    }
    if(req.method=='POST'){
        if(url1=='markets'&&url2=='add'){
            req.on('data',chunk=>{
                const allMarket=read('./model/markets.json')
                const {name}=JSON.parse(chunk)
                allMarket.push({
                    id:allMarket[allMarket.length-1].id+1||1,
                    name,
                    baranjsId:[]
                })
                write('./model/markets.json',allMarket)
                res.end('market yozildi')
            })
            return
        }
        if (url1=='branchs'){
            
             
            req.on('data',chunk=>{
                const allBranch=read('./model/branches.json')
                const alMarket=read('./model/markets.json')
                const {name,address,marketId}=JSON.parse(chunk)
                allBranch.push({
                    id:allBranch[allBranch.length-1].id+1||1,
                    name,
                    address,
                    workersId:[],
                    productsId:[]
                })
                alMarket.find(e=>e.id==marketId).baranjsId.push(allBranch[allBranch.length-1].id)
                write('./model/branches.json',allBranch)
                write('./model/markets.json', alMarket)
            })
            return res.end('filial qoshildi')
        }
        if(url1=="product"){
            req.on('data',chunk=>{
                const {name,price,count,branchId}=JSON.parse(chunk)
                const allProduct=read('./model/products.json')
                const allBranch=read('./model/branches.json')
                allProduct.push({
                    id:allProduct[allProduct.length-1].id+1||1,
                    name,
                    price,
                    count
                })
                allBranch.find(e=>e.id==branchId).productsId.push(allProduct[allProduct.length-1].id)
                write('./model/branches.json',allBranch)
                write('./model/products.json', allProduct)
            })
            return res.end('product qoshildi')
        }
        if(url1=='workers'){
            req.on('data',chunk=>{
                const {name,position,branchId}=JSON.parse(chunk)
                const allWorker=read('./model/workers.json')
                const allBranch=read('./model/branches.json')
                allWorker.push({
                    id:allWorker[allWorker.length-1].id+1||1,
                    name,
                    position
                })
                allBranch.find(e=>e.id==branchId).workersId.push(allWorker[allWorker.length-1].id)
                write('./model/branches.json',allBranch)
                write('./model/workers.json', allWorker)
            })
            return res.end('worker qoshildi')
        }
        return
    }
    if(req.method=='DELETE'){
        if(url1=='markets' && url2){
            const alMarket=read('./model/markets.json')
            const allBranch=read('./model/branches.json')
            const deletMarket=alMarket.find(e=>e.id==url2)
            deletMarket.baranjsId.forEach(element => {
                allBranch.splice(allBranch.findIndex(e=>e.id==element),1)
            })
            write('./model/branches.json',allBranch)
            const deletIndex=alMarket.findIndex(e=>e.id==url2) 
            alMarket.splice(deletIndex,1)
            write('./model/markets.json',alMarket)
            return res.end("market o'chdi")
        }
        if(url1=='branchs' && url2){
            const allBranch=read('./model/branches.json')
            const alMarket=read('./model/markets.json')
            const deletMarkId=allBranch.find(e=>e.id==url2).id
            alMarket.forEach(element => {
                element.baranjsId.splice(element.baranjsId.findIndex(e=>e==deletMarkId),1)
            })
            write('./model/markets.json',alMarket)
            const deletIndex=allBranch.findIndex(e=>e.id==url2) 
            allBranch.splice(deletIndex,1)
            write('./model/branches.json',allBranch)
            return res.end("filial o'chdi")
        }
        if(url1=='product'&&url2){
            const allBranch=read('./model/branches.json')
            const allProduct=read('./model/products.json')
            const deletId=allProduct.find(e=>e.id==url2).id
            allBranch.forEach(element => {
                element.productsId.splice(element.productsId.findIndex(e=>e==deletId),1)
            })
            write('./model/branches.json',allBranch)
            const deletIndex=allProduct.findIndex(e=>e.id==url2) 
            allProduct.splice(deletIndex,1)
            write('./model/products.json',allProduct)
            return res.end("product o'chdi")
        }
        if(url1=='workers' && url2) {
            const allBranch=read('./model/branches.json')
            const allWorker=read('./model/workers.json')
            const deletId=allWorker.find(e=>e.id==url2).id
            allBranch.forEach(element => {
                element.workersId.splice(element.workersId.findIndex(e=>e==deletId),1)
            })
            write('./model/branches.json',allBranch)
            const deletIndex=allWorker.findIndex(e=>e.id==url2) 
            allWorker.splice(deletIndex,1)
            write('./model/workers.json',allWorker)
            return res.end("ishchi o'chdi")
        }
        return
    }
    if(req.method=='PUT'){
        if(url1=='markets' && url2){
            req.on('data',chunk=>{
                const {name}=JSON.parse(chunk)
                const alMarket=read('./model/markets.json')
                alMarket.find(e=>e.id==url2).name=name

                write('./model/markets.json',alMarket)
            })
            return res.end("nomi o'zgardi marketni")
        }
        if(url1=='branchs' && url2){
            req.on('data',chunk=>{
                const {name, address,workersId,productsId}=JSON.parse(chunk)
                const allBranch=read('./model/branches.json')
                const branch=allBranch.find(e=>e.id==url2)
                branch.name=name?name:branch.name
                branch.address=address?address:branch.address
                branch.workersId.push(workersId)
                branch.productsId.push(productsId)
                write('./model/branches.json',allBranch)
            })
            return res.end("branch o'zgardi")
        }
        if(url1=='product'&&url2){
            req.on('data',chunk=>{
                const {name,count,price}=JSON.parse(chunk)
                const allProduct=read('./model/products.json')
                const product=allProduct.find(e=>e.id==url2)
                product.name=name?name:product.name
                product.price=price?price:product.price
                product.count=count?count:product.count
                write('./model/products.json',allProduct)
            })
            return res.end("product o'zgardi")
        }
        return
    }
})

server.listen(5050,console.log(5050))