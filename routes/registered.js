var express = require('express');
var router = express.Router();
var Registered = require('../models/registered');
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');






router.route('/').get(function(req,res){
	Registered.find(function(err,reg){
		res.send(reg);
	});
});

router.route('/:id') 
  .get(function(req, res) {
  	var reg_id = req.params.id;
  	Registered.findOne({email: reg_id}, function(err, reg) {
  		if(err) {
        res.json({err: String(err)});

      } else if(reg === null) {
        res.json({err: " registration does not exist."});

      } else {
        res.json(reg); 
      }

  	});

 });
router.route('/login').post(function(req,res){
          
          	Registered.findOne({'email': req.body.email}, function(err, user){
          		if(err){
          			res.status(400);
          			res.json({err: String(err)});
          		}else if(user === null){
          			res.status(403);
          			res.send("No such user");
          		} else{

                bcrypt.compare(req.body.password, user.password, function(err, resp) {
                  if(err) resp.json({err: String(err)});
                  if(resp){
          			     res.status(202);
          			     res.send({status: 'ACCEPTED'});
                  }
          		  });
              }
          	});
});

  router.route('/').post(function(req, res) {
  




	 Registered.findOne({ 'email': req.body.email}, function(err, user){
	 	if(err) {
	 	res.status(400);
        res.json({err: String(err)}); 
      	} else if(user === null) {	

            bcrypt.genSalt(10, function(err, salt) {
                  bcrypt.hash(req.body.password, salt, function(err, hash) {
                  // Store hash in your password DB. 

                          if(err) res.json({err: String(err)});

                           var newUser = (new Registered({
                              firstName: req.body.firstName,
                              lastName:  req.body.lastName,
                              email:     req.body.email,
                              password:  hash
                          }));
                          newUser.save(function(err){
                            if(err){
                             throw err;
                            }else{
                              res.status(201);
                              res.send({ status: 'SUCCESS'});
                            }
                          });

                  });
            });  

      	} else{
      		 res.status(409);
      		res.json({err: "This user already exists"});
	

      	}

	 });
  });



  module.exports = router;