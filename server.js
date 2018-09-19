var express=require('express');
var app=express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var bodyParser=require('body-parser');
app.use(express.static('static'));
app.engine('.html', require('ejs').__express);
app.set('port', process.env.PORT || 1345);

// providing directory detail so it can use files under this directory
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: false }));
//app.set('view engine','ejs');
var reForEmail = /^([a-zA-Z0-9_\-\.]+)@([b]{1}[u]{1}[l]{1}[l]{1}[h]{1}[o]{1}[r]{1}[n]{1})\.([a-zA-Z]{2,5})$/;
var reForPassword=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
var reForName=/^([a-zA-Z]+)$/;
var reForPhn=/[6-9]{1}[0-9]{9}/;
var loginErrors={
	               emailError : '',
	               pwdError : '',
	               message : ''

                };
var signupErrors={
	               fnameError : '',
	               mnameError : '',
	               lnameError : '',
	               pwdError : '',
	               repwdError : '',
	               dobError : '',
	               emailError : '',
	               phnError : '',
	               message : ''

                };
var Users = [];
app.get('/',function(req,res){
	if(req.cookies['hrmuser']==undefined || req.cookies['hrmuser']=='' || req.cookies['hrmuser']==null){
		res.render('login');
	}
	else{
		res.render('Home');
    }
});
app.post('/login',function(req,res){
	console.log(Users);
	loginErrors.emailError='';
    loginErrors.pwdError='';
    loginErrors.message='';
    var uname=req.body.uname;
    var pwd=req.body.pwd;
    console.log(uname+' '+pwd);
    if(reForEmail.test(uname)){
       loginErrors.emailError='';
       if(reForPassword.test(pwd)){
       loginErrors.pwdError='';
       let check=Users.filter(function(user){
       	return (user.email == uname && user.password == pwd);
       });
       if(check.length>0){
       	res.cookie('hrmuser',uname);
       	res.send(loginErrors);
       }
       else{
       	loginErrors.message='Invalid Username/Password';
       	res.send(loginErrors);
       }

       }
       else{
          loginErrors.pwdError='Invalid pwd';
          res.send(loginErrors);
       }
    }
    else{
      loginErrors.emailError='Invalid Email';
      res.send(loginErrors);
    }

});
app.get('/register',function(req,res){
	res.render('signup');
});
app.post('/signup',function(req,res){
	signupErrors.message='';
	var data=req.body;
	if(reForName.test(data.fname)){
		signupErrors.fnameError='';
		if(!(data.mname=='') && !(reForName.test(data.mname))){
			signupErrors.mnameError='*must contain only alphabets';
			res.send(signupErrors);
	    }
		else{
        	signupErrors.mnameError='';
        	if(reForName.test(data.lname)){
				signupErrors.lnameError='';
				if(reForPassword.test(data.password)){
					signupErrors.pwdError='';
					var date=new Date(data.dob);
					var now=new Date();
					if(date<now){
						signupErrors.dobError='';
						if(reForEmail.test(data.mail)){
							signupErrors.emailError='';
							
							if(reForPhn.test(data.phn)){
								signupErrors.phnError='';
								

								var matched=Users.filter(function(user){
															return user.email == data.mail;

														});	
								if(matched.length == 0)	{					
									var user={
										fname : data.fname,
										mname : data.mname,
										lname : data.lname,
										gender : data.gender,
										email : data.mail,
										password : data.cpassword,
										phn :  data.phn,
										dob : data.dob
									};
									Users.push(user);
									signupErrors.message='You are Successfully Registered.';
									console.log(Users);
									res.send(signupErrors);
							   }
							   else{
							   	signupErrors.emailError='EmailId already Exists';
							   	res.send(signupErrors);
							   }
							}
							else{
								signupErrors.phnError='*invalid Mobile Number';
								res.send(signupErrors);
							}
					
						}
						else{
							signupErrors.emailError='*invalid emailId';
							res.send(signupErrors);
						}
					
					}
					else{
						signupErrors.dobError='*invalid DOB';
						res.send(signupErrors);
					}

				}
				else{
					signupErrors.pwdError='*password must contain:<br> 1 uppercase<br>1 lowercase<br>1 specialcharacter<br>1 number<br>min 8 char length';
					res.send(signupErrors);
				}
			}
			else{
				signupErrors.lnameError='*must contain only alphabets';
				res.send(signupErrors);
			}

    	}

	}
	else{
        signupErrors.fnameError="*must contain only alphabets";
		res.send(signupErrors);
    }
	
});
app.get('/home',function(req,res){
	if(req.cookies['hrmuser']==undefined || req.cookies['hrmuser']=='' || req.cookies['hrmuser']==null){
		res.render('login');
	}
	else{
		res.render('Home');
    }
});
app.get('/logout',function(req,res){
   if(req.cookies['hrmuser']==undefined || req.cookies['hrmuser']=='' || req.cookies['hrmuser']==null){
		res.render('login');
	}
	else{
		res.clearCookie('hrmuser');
		res.render('login');
    }
});
var server = app.listen(app.get("port"));