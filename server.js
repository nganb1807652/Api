const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 8080;
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./DB.js');
var md5 = require('md5');

// Model

const Person = require('./model/Persons.model');
const Product = require('./model/Products.model');
const Table = require('./model/Tables.model');
const Cart = require('./model/Cart.model');
const Checkout = require('./model/Checkout.model');
const Discount = require('./model/Discount.model');
mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Can not connect to the database'+ err)}
);


app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.listen(PORT, function(){
  console.log('Server is running on Port:',PORT);
});

// Bat dau viet BackEnd

app.post('/register' , function(req ,res) {
  // console.log(req.body); 
   let user1 = req.body.username;
   const pass1 = md5(req.body.password);
   const phone1 = req.body.phone;
  
   Person.create({
    username: user1,
    password: pass1,
    phone : phone1
  })
  res.send(200)
 })


app.post('/login', function(req,res){
  Person.findOne({username: req.body.user})
  .then((dt) => {
    // console.log(dt);
    if(dt == null){
        res.status(200).send({
        valid: false,
        message: "User not found !"
      })
    }else {
        dt.password == md5(req.body.pass) ? 
          res.status(200).send({
            valid: true,
            message: "Login successfully !",
            userID: dt._id,
            userName : dt.username
          })
          :
          res.status(200).send({
            valid: false,
            message: "Password Wrong"
         })
    }
  })
})

app.get('/data', function(req,res){
  Product.find({})
  .then(dt => {
    res.json(dt)
  })

})

app.get('/datatype/type=:type', function(req,res) {
  const typee = req.params.type;
  Product.find({type: typee})
 .then((dt) => {
   res.json(dt)
 })
})

app.get('/datadetails/id=:idd', function(req, res){
  // console.log(req.params.idd);
  Product.findOne({_id: req.params.idd})
  .then((dt) => {
  //console.log(dt);
    res.send(dt)
  })
}) 

app.post('/datatables', function(req,res){
  Table.find({})
  .then((dt) => {
    res.json(dt)
  })
})

app.post('/cart', async function(req, res){
  const productId = req.body.dataAPI._id;
  const quantity = req.body.num;
  const name = req.body.dataAPI.name;
  const price = req.body.dataAPI.price;
  const userId = req.body.userId; 
  const date = req.body.date;//TODO: the logged in user id
  const images =  req.body.dataAPI.images[0].imgimg;
  //console.log(price);
  let cart = await Cart.findOne({ userId });
  if (cart) {
    let itemIndex = cart.products.findIndex(p => p.productId == productId);
  if (itemIndex > -1) {
       let productItem = cart.products[itemIndex];
      //  console.log(productItem);
       productItem.quantity = productItem.quantity+=quantity;
      
    } else {
      cart.products.push({ productId, quantity, name, price , images });
    }
    cart = await cart.save();
  

  } else {
    const newCart = await Cart.create({
      userId,
      products: [{ productId, quantity, name, price , images}],
      date
    });

    return res.status(201).send(newCart);
  }

});


app.post('/cartDetail', function(req, res){
  // console.log(req.body.id);
  Cart.findOne({userId : req.body.id})
  .then(dt =>{
    // console.log(dt);
    res.send(dt)
  })
});

app.post('/deleteCart',async  function(req,res){
  // console.log(req.body);
  const userId = req.body.idUser; 
  // console.log(userId);
  let cart = await Cart.findOne({ userId: userId });
  let cartFilter = cart.products;
  let cartNew = cartFilter.filter(dt=>dt._id != req.body.idProduct)
  // console.log(cartNew);
  Cart.updateOne({userId: userId, products: cartNew})
  .then(dt=>{
    res.send(200)
  //   console.log(dt);
   })
})

app.post('/checkout', async function(req,res){
  let data = req.body.dataCheckOut;
  let time = req.body.time;
  let date = req.body.date;
  let saveToCheckOut = await Checkout.create({
    dataCart: req.body.dataCheckOut,
    time: req.body.time,
    date: req.body.date,
    idTable: req.body.idTable  
  })
  let saveToTable = await Table.findOne({idTable : req.body.idTable})
  if(saveToTable){
    saveToTable.dataTable.push({data, time, date})
  }
  saveToTable = await saveToTable.save();

  res.send(200)


})

app.post('/addProduct', function(req,res){
const name1 = req.body.namep;
const price1 = req.body.pricep;
const quantity1 = req.body.quantityp;
const type1 = req.body.typep;
const description1 = req.body.descriptionp
const image1 = req.body.imagep

let img = []
img.push({imgimg: image1})

let saveProduct = Product.create({
    images: img,
    name: name1,
    price: price1,
    quantity: quantity1,
    description: description1,
    type: type1
})
saveProduct.then(dt=>{
  res.send(200)
})

})

app.post('/addVouccher', function(req,res){
  // console.log(req.body);
  const code = req.body.code1;
  const condition2 = req.body.con1;
  const price2 = req.body.price1;
  const description2 = req.body.des1;
 
 Discount.create({
    codeDiscount: code,
    condition: condition2,
    price: price2,
    description: description2,
  })
  .then(dt=>{
    res.send(200)
    // console.log(dt);
   
  })
  
  })
app.post('/delete', function(req,res){
  //console.log(req.body);
  Product.findOneAndDelete({_id: req.body.id})
  .then(dt =>{
    // console.log(dt);
    res.send(200)
  })
})

app.get('/edit/id=:id', function(req, res){

  Product.findOne({_id: req.params.id})
  .then((dt) => {
    res.send(dt)
  })
}) 

app.post('/editProduct', function(req,res){
   
  Product.findByIdAndUpdate({_id: req.body.id},{
    name : req.body.nameedit,
    price : req.body.priceedit,
    type : req.body.typeedit,
    description : req.body.descriptionedit,
    quantity: req.body.quantityedit
  }) 
  
  .then(dt => {
    res.send(200)
  })
})

app.post('/checkCode', function(req,res){
  // console.log(req.body);
  Discount.find({})
  .then(dt=>{
    dt.map(dta =>{
      if(dta.codeDiscount == req.body.code){
        res.send(dta)
      }
    })
  })
  
})

// app.post('/checkoutfn', async (req, res) => {
 
//   let dataSend = await Checkout.find({})
//   // console.log("before:", dataSend);
//   dataSend = dataSend.filter( (dta) =>{
//     let newData = dta.dataCart.filter(item =>{
//         return item.userId == req.body.id ;
//     })
    
//     return newData.length
//   })
  

//   res.json(dataSend)
// })

app.get('/dataCode', function(req,res){
  Discount.find({})
  .then(dt => {
     res.json(dt)
    
  })
})
