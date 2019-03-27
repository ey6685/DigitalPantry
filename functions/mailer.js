/*
this fuction contains our mailer for new pantry user credentionals sending to enghlish is great 
*/

const mail = require("nodemailer");

var transporter = mail.createTransport({
    service: "gmail",
    auth:{
        user:'wsu.digital.pantry@gmail.com',
        pass: 'D1giT@l1'
    }
})

// var options = {
//     from: 'wsu.digital.pantry@gmail.com',
//     to: "et8492@wayne.edu",
//     subject:"test email from our server",
//     text: "welcome to the jungle"
// }

function send_mail(email,subject,msg){
    try{
        if(email == null || msg == null)
        {
            throw "can't send mail"
        }

        var options = {
            from: 'wsu.digital.pantry@gmail.com',
            to: email,
            subject: subject,
            html: msg
        }

        transporter.sendMail(options,function(error,info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }
    catch(e)
    {
        console.log(e)
    }
}

function password_change(email){
    try{
        if(email == null)
        {
            throw "can't send mail"
        }

        var options = {
            from: 'wsu.digital.pantry@gmail.com',
            to: email,
            subject: "Digital Pantry: Password Change",
            html: "Hello " + email +
            ",<br>Your pasword has been changed."
        }

        transporter.sendMail(options,function(error,info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }
    catch(e)
    {
        console.log(e)
    }

}

function password_reset(email,pass){
    try{
        if(email == null || pass == null)
        {
            throw "can't send mail"
        }

        var options = {
            from: 'wsu.digital.pantry@gmail.com',
            to: email,
            subject: "Digital Pantry: Password reset",
            html: "Hello " + email + ",<br>Your pasword has been resest.<hr>" +
            "<b>New Passord: </b>" + pass +"<hr><br><br><b><u>this is TEMPORTARY. Please change the next time you log in!"
        }

        transporter.sendMail(options,function(error,info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }
    catch(e)
    {
        console.log(e)
    }
}
module.exports.send_mail = send_mail;
module.exports.password_change= password_change;
module.exports.password_reset = password_reset;