const express = require('express')
const router = express.Router()

const mongoose = require('mongoose')
const Goods = require('./../models/Goods')

// 连接mongodb数据库
mongoose.connect('mongodb://localhost:27017/shoppingmall')
mongoose.connection.on("connected", function () {
  console.log(`mongodb 连接成功！`)
})
mongoose.connection.on("error", function () {
  console.log(`mongodb 连接失败！`)
})
mongoose.connection.on("disconnected", function () {
  console.log(`mongodb 断开连接！`)
})

// 商品列表接口
router.get('/list', function (req, res, next) {
  let page = parseInt(req.query.page)
  let pageSize = parseInt(req.query.pageSize)
  let skip = (page - 1) * pageSize
  let sort = parseInt(req.query.sort)
  let priceRange = req.query.priceRange
  let priceGT = ''
  let priceLTE = ''
  let params = {}
  if (priceRange != 'all') {
    switch (priceRange) {
      case '0':
        priceGT = 0;
        priceLTE = 100;
        break;
      case '1':
        priceGT = 100;
        priceLTE = 500;
        break;
      case '2':
        priceGT = 500;
        priceLTE = 1000;
        break;
      case '3':
        priceGT = 1000;
        priceLTE = 2000;
        break;
      case '4':
        priceGT = 2000;
        priceLTE = 5000;
        break;
    }
    params = {
      salePrice: {
        $gt: priceGT,
        $lte: priceLTE
      }
    }
  }

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize).sort({
    salePrice: sort
  })

  goodsModel.exec(function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
      })
    } else {
      if (doc) {
        res.json({
          status: 0,
          msg: "连接成功！",
          result: {
            count: doc.length,
            list: doc
          }
        })
      }
    }
  })
})

// 添加到购物车接口
router.post('/addCart', function (req, res, next) {
  let userId = req.cookies.userId
  let productId = req.body.productId
  let Users = require('./../models/Users')
  Users.findOne({
    userId: userId
  }, function (err, userDoc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result:''
      })
    } else {
      if (userDoc) {
        // 拿到user数据后 遍历user里面的cartList是否存在所点击的商品
        let goodsItem = ''
        userDoc.cartList.forEach(function (element) {
          if (element.productId == productId) {
            element.productNum += 1;
            element.checked = 1;
            goodsItem = element;
          }
        })
        // 用户购物列表里已经存在这件商品
        userDoc.cartList.splice(0, 0); //mongodb的坑！保存到数据库失败的解决办法！（https://cnodejs.org/topic/516ab9c96d38277306376cad）
        if (goodsItem) {
          userDoc.save(function (err2, doc2) {
            if (err2) {
              res.json({
                status: '1',
                msg: err2.message,
                result:''
              })
            } else {
              res.json({
                status: '0',
                msg: '保存成功。',
                result: ''
              })
            }
          })
        } else {
        // 购物车列表不存在这件商品，重新添加
          Goods.findOne({
            productId: productId
          }, function (err1, doc1) {
            if (err1) {
              res.json({
                status: '1',
                msg: err1.message,
                result:''
              })
            } else {
              doc1.productNum = 1;
              doc1.checked = 1;
              userDoc.cartList.push(doc1);
              userDoc.save(function (err2, doc2) {
                if (err2) {
                  res.json({
                    status: '1',
                    msg: err2.message,
                    result:''
                  })
                } else {
                  res.json({
                    status: '0',
                    msg: '保存成功。',
                    result: ''
                  })
                }
              })
            }
          })
        }
      }
    }
  })
})

router.get('/cart',function(req,res,next){
  //
})

module.exports = router
