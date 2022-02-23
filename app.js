var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');
var zip = require('express-zip');
const adm = require('adm-zip');
// const alert=require('alert');
// var popup = require('popups');
// var multer=require('multer');
// hello mr mhatma how are u

var name1;
// connection for database

const db = mysql.createConnection({
  user: "root",
  host: 'localhost',
  password: "Abcd-1234ASKD",
  database: "plasma",
});
db.connect((err) => {
  if (!err) {
    console.log(" the connection got success");
  } else {
    console.log("the connection got failed" + err);
  }
});









var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const multer = require('multer');
const { dirname } = require('path');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//<-----------------------------------------------------------middleware start---------------------------------->
app.use(express.static(__dirname + "./public/"));

var Storage = multer.diskStorage({
  destination: "./public/uploadResults/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname)
    // export(uniquesuffix);
    name1 = file.fieldname + '-' + uniqueSuffix
    cb(null, name1);
    // console.log("hello world");
  }
});

var upload = multer({
  storage: Storage
}).single('file')

//<-------------------------------------------------------------middleware end----------------------------------->


// app.use('')
app.use('/', indexRouter);
app.use('/aboutus', indexRouter);
app.use("/mri", indexRouter);
app.use("/covid", indexRouter);
app.use("/ctscan", indexRouter);
app.use("/bloodtest", indexRouter);
app.use("/ordersection", indexRouter);
app.use("/appointment.html", indexRouter);

//<------------------handling adminLogin link from indexMain.ejs and givin admin login page start here------------------>

app.get("/adminLogin",(req,res)=>{
  res.render('adminlogin');
})
//<------------------handling adminLogin link from indexMain.ejs and givin admin login page ends here------------------>



//<-----------------------handeling loggedInAdmin from login button from adminLogin.ejs page start here---------------->

app.post("/loggedInAdmin",(req,res)=>{
 if((req.body.fname=="lab@plasmadiagnostics.net")&&(req.body.Password=="Abcd-1234"))
 {
  db.query("SELECT * FROM booking", (err, result) => {
    if (err) {
      res.send("invaild record");
    } else {
      res.render('allOrder',{akshay:result});
      // ,{akshay:result});
      console.log(result);

    }
  
});
 }else
 {
   res.send("the login credential is not valid");
 }
})

//<------------------handeling loggedInAdmin from login button from adminLogin.ejs page ends here---------------------------->


app.get("/res", (req, res) => {
  res.render('res');
})

// <-----------------------------------------------------admin panel routing--------------------------------------------->

app.get("/adminOrder", (req, res) => {

  db.query("SELECT * FROM booking where status='active'", (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.render('allOrder',{akshay:result});
      // ,{akshay:result});

    }
  
});
});
app.get("/adminResWithoutOrder", (req, res) => {
  res.render('adminnoorder',{karthik:""});
});
app.post("/uploadresWithoutOrder",upload,(req,res,next)=>{
  const mobile = req.body.mobile;
  const name2 = req.body.customerName;
  const test = req.body.test;
  const file = req.file.fieldname;
  // +'-'+ Date.now()+path.extname(file.originalname);
  // const idee = req.body.uniqueId;

  //  var pd= import (uniquesuffix);

 
  var sql = "INSERT INTO resultwithoutorder (mobile,name,test,fileName) VALUES ('" + mobile + "','" + name2 + "','" + test + "','" + name1 + "')";
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  // alert("uploaded success fully");
  res.render('adminnoorder',{karthik:"the result has been uploaded successfully"});

    

  });
  

})
app.get("/adminResWithOrder", (req, res) => {
  res.render('admin',{karthik:""});
});
app.post("/adminResWithOrder", (req, res) => {
  res.render('admin',{karthik:"successfully uploaded"});
});

//<-------------------------------------------------------end of admin panel routing------------------------------------------->





// app.use("/adminpanel", indexRouter);

//<---------------------------------------------booking appointment handling post meyhod--------------------------------------->
app.post("/booking",(req, res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const mail = req.body.mail;
  const phoneNo = req.body.Phone;
  const dateOfBooking = req.body.date;
  const timeOfBooking=req.body.time;
  const test=req.body.tests;
  const homeservice=req.body.home;
  console.log(homeservice);
  // console.log("the name is =" + firstName);
  // console.log("the name is =" + lastName);
  // console.log("the name is =" + mail);
  // console.log("the name is =" + phoneNo);
  // console.log("the name is =" + dateOfBooking);
  console.log(test);
  var sql = "INSERT INTO booking (fname,lname,mail,phone,date,time,testname,homeservice) VALUES ('" + firstName + "','" + lastName + "','" + mail + "','" + phoneNo + "','" + dateOfBooking + "','"+timeOfBooking+"','"+test+"','"+homeservice+"')";
  db.query(sql,  function(err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    // window.alert('confirm your booking');
    res.render('indexmain');
    
  });
});

//<--------------------------------------------booking end here ------------------------------------------------------------>


// module.exports();

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/uploadResults')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix)
//   }
// })

// var upload = multer({ storage: storage })


//<----------------------------------------------upload result from admin panel with --------------------------------------->

app.post("/upload", upload, (req, res, next) => {
  const mobile = req.body.mobile;
  const name2 = req.body.customerName;
  const test = req.body.test;
  const file = req.file.fieldname;
  // +'-'+ Date.now()+path.extname(file.originalname);
  const idee = req.body.uniqueId;

  //  var pd= import (uniquesuffix);

  console.log(mobile);
  console.log(name2);
  console.log(test);
  console.log(name1);
  var sql = "INSERT INTO resul2 (name,mobile,testName,testResult,id) VALUES ('" + name2 + "','" + mobile + "','" + test + "','" + name1 + "','" + idee + "')";
  db.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
    // alert("uploaded success fully");
     res.render('admin',{karthik:"sucessfully uploaded"});

    

  });
  

//    popup.alert({
//     content: 'Hello!'
// });


})

// <--------------------------------------------------------------upload result from admin panel ends here-------------------->



//<-----------------------------------------------------------getting phone number from user and fetch the result---------->
app.post("/getresult", (req, res) => {
  var ph1 = req.body.ph;
  // console.log(ph1);
  // where mobile='"+ph1+"'
  // SELECT * FROM resul2 r1,resultwithoutorder r2 where r1.mobile='"+ph1+"' AND r2.mobile='"+ph1+"


  try {
    db.query("SELECT r1.testResult AS t1 FROM resul2 r1 where r1.mobile='" + ph1 + "' UNION SELECT r2.fileName AS t1 FROM resultwithoutorder r2 where r2.mobile='"+ph1+"'", (err, result) => {
      if (err || result.length==0) {
        // res.send("Please insert the correct mobile number. For further information contact administration"+<a href="contactus">Contact us</a>);
        res.send("The number is incorrect or not registerd with the test for further information contact Administration");
        // for(i=0;i<2;i++){
        //   if(i==0){
        //   res.send("hello");
        //   }
        //   else{
        //   res.render('contactus');
        //    }
        //   }
        // res.redirect('/contactus')
          

        // res.send("");
      } else {
        console.log(result); 


        // res.render('download',{shashikant:result});
        const zip = new adm();
        for (var i = 0; i < result.length; i++) {
          // filepath = path.join(__dirname, './public/uploadResults/') + result[i].testResult;
          // zip.addLocalFile(filepath);
          // filepath = path.join(__dirname, './public/uploadResults/') + result[i].fileName;
          // zip.addLocalFile(filepath);


          filepath = path.join(__dirname, './public/uploadResults/') + result[i].t1;
          zip.addLocalFile(filepath);


        }

        const downloadName = 'download.zip';
        const data = zip.toBuffer();

        res.set('Content-Type', 'application/octet-stream');

        res.set('Content-Disposition', `attachment; filename=${downloadName}`);

        res.set('Content-Length', data.length);




        res.send(data);

      }
      // res.render('about');  
    });

  } catch (error) {
    res.send(error);
  }


});
//<--------------------------------------------getting phone number from user panel to fetch the result ends here------------->







//<------------------------------------download result---------------------------------------------------->
app.get("/downloadResult1", (req, res) => {


  db.query("SELECT * FROM resul2", (err, result) => {
    if (err) {
      res.send(err);
    } else {
      // res.render('download',{shashikant:result});
      // for(var i=0;i<2;i++)
      //  {

      // const zip=new adm();
      // for(var i=0;i<result.length;i++){
      //   filepath=path.join(__dirname,'./public/uploadResults/')+result[i].testResult;
      //   zip.addLocalFile(filepath);


      // }

      // const downloadName='download.zip';
      // const data = zip.toBuffer();

      // res.set('Content-Type','application/octet-stream');

      // res.set('Content-Disposition',`attachment; filename=${downloadName}`);

      // res.set('Content-Length',data.length);

      // res.send(data);

      // res.download(filepath);
      // console.log(filepath);
      // console.log(result.length);
      // //  }

      //  res.zip([
      //    result.forEach(element => {
      //     { path:path.join(__dirname,'./public/uploadResults/')+element.testResult,name: '1.pdf'};
      //    }),
      //   //  {//

      //   //  }//
      //   // { path:path.join(__dirname,'./public/uploadResults/')+result[result.legth-1].testResult}
      //     //  '/path/to/file1.name', name: '/path/in/zip/file1.name' },
      //   // { path: '/path/to/file2.name', name: 'file2.name' }
      // ]);

    }
  });

})
//<-----------------------------------------download result ends here-------------------------------------------->



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;