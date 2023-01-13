const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const appConst = require("../constant");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { response } = require("express");

const add = async (req, res) => {
  try {
    let userData = JSON.parse(JSON.stringify(req.body));
    console.log(userData);
    const regex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    console.log(userData.userPassword);
    if (!userData.userPassword.match(regex)) {
      res.status(400).json({
        status: appConst.status.fail,
        response: null,
        message: "Password is not matched...",
      });
    }
     else {
      userData.userPassword = await bcrypt.hash(userData.userPassword, 10);
      console.log(userData.userPassword)
      userData.token = await jwt.sign(
        {
          name: userData.userName,
          date: new Date(),
        },
        "misterytoken"
      );
    }
    console.log("------------------->" ,userData.token);
    const resp = await prisma.User.create({ data: userData });
    res.status(200).json({
      status: appConst.status.success,
      response: resp,
      message: "record saved in db...",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: appConst.status.fail,
      response: null,
      message: "record not saved in db....",
    });
  }
};
const search = async (req, res) => {
  try {
    console.log("-------------------> come in try block")
    console.log(req.body.userName)
    let forgotToken;
    const resp = await prisma.User.findFirst({
      where: { userName: req.body.userName },
    });
    console.log("User data is -->",resp);
    if (!resp) {
      res.status(400).json({
        status: appConst.status.success,
        response: null,
        message: "plese genrat the id or sing up",
      });
    } else {
      forgotToken = jwt.sign(
        {
          name: resp.userName,
          date: new Date(),
        },
        "secret"
      );
    }
    const cutshort=()=>{
     let token=forgotToken.slice(0,resp.token.length);
     console.log(token)
     return token;
    }
    let token= cutshort();
    console.log("---------------->",resp.token);
    console.log(resp.userName)
   const result = await prisma.User.update({
        where:{
          userName:resp.userName
        },
          data:{
            userName:"prk@gmail.com"
        }
      })
     res.send(result);
      // if (!result) {
      //   res.status(404).json({
      //     status: appConst.status.fail,
      //     response: null,
      //     message: "Password is not updated...",
      //   });
      // } else {
      //   token.sign({
      //     neme: resp.userName,
      //     date: new Date(),
      //   });
      // }
  } catch (error) {
    res.status(404).json({
      status: appConst.status.fail,
      response: null,
      message: "username is not define",
    });
  }
};
module.exports = {
  add,
  search,
};
