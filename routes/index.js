var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('indexmain');
});
router.get('/aboutus', (req, res, next) => {
    res.render('about');
});
router.get("/bloodtest", (req, res, next) => {
    res.render("bloodtestslots");
});
router.get("/covid", (req, res) => {
    res.render("covidslots");
});
router.get("/mri", (req, res) => {
    res.render("MRIslots");
});
router.get("/ctscan", (req, res) => {
    res.render("CTscanslots")
});
// router.get("/otp", (req, res) => {
//     res.render("otp");
// });
router.get("/appointment.html", (req, res) => {
    res.render("appointment");
});
router.get("/contactus",(req,res)=>{
  res.render("contactus");
});
// router.get("/adminpanel",(req,res)=>{
//     res.render("allOrder");
// })
router.get("/ordersection",(req,res)=>{
    res.render("allOrder");
})

module.exports = router;