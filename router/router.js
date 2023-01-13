const router=require('express').Router()
const userContro=require('../controller/forgotPassController')

router.post('/save',userContro.add);
router.get('/email',userContro.search);

module.exports=router