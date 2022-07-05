const fs=require('fs')
const path=require('path')
const read=(dir)=>{
    return JSON.parse(fs.readFileSync(path.resolve(__dirname,`../${dir}`)))
}
const write=(dir,data)=>{
    fs.writeFileSync(path.resolve(__dirname,`../${dir}`),JSON.stringify(data,null,4))
}

module.exports={
    read,
    write
}