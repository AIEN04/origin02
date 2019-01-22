const list = (items, options)=>{
    console.log(options);
    let out = "<ul>";
    for(let i=0; i<items.length; i++) {
    items[i]['my-index']=i; //
    console.log(items[i]);
    out = out + "<li>" + options.fn(items[i]) + "</li>";
    }
    return out + "</ul>";
    };
    module.exports = list;