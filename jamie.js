var botui = new BotUI('delivery-bot')
var passwordConfirmStatements = ['Could you confirm that for me?', 'Great, once more for good measure', 'Perfect, just to be sure can you please confirm your password...', 'Once more for good measure...', 'And again just to be sure...']
var data = {};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var question = function(text, answer) {
  botui.message
  .bot({
    delay: 2000/(getRandomIntInclusive(1, 5)),
    content: text
  }).then(function (){
    answer()
  })
}

// NAME ANSWER

var nameAnswer = function () {
  botui.action.text({
    delay: 1000,
    action: {
      size: 70
    }
  }).then(function (res) {
    validateName(res.value)
  })
}

var validateName =  function(name) {
  if (name.split(' ').length < 2) {
    botui.message
    .bot({
      delay: 2000,
      content: 'Please enter your full name'
    }).then(function (){
      nameAnswer()
    })
  } else {
    successName(name)
  }
}

var successName = function(name) {
  data.name = name
  botui.message
  .bot({
    delay: 1000,
    content: 'Hello ' + name.split(' ')[0]
  }).then(function() {
    question('What type of Data Scientist are you?', typeAnswer)
  });
}

// TYPE ANSWER

var typeAnswer = function () {
  botui.action.button({
    delay: 1000,
    action: [{
      text: 'Graduate',
      value: '1'
    }, {
      text: 'Junior',
      value: '2'
    }, {
      text: 'Experienced',
      value: '3'
    }]
  }).then(function (res) {
    data.level = res.value
    botui.message
    .bot({
      delay: 1000,
      content: 'Great! We have tons of roles at that level'
    }).then(function (){
      question('What\'s your email address so I can get an account set up?', emailAnswer)
    })
  })
}

// EMAIL ANSWER

var emailAnswer = function() {
  botui.action.text({
    delay: 1000,
    action: {
      size: 70
    }
  }).then(function (res) {
    validateEmail(res.value)
  })
}

var validateEmail =  function(email) {
  var emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  if (emailRe.test(email)) {
    botui.message
    .bot({
      delay: 2000/(getRandomIntInclusive(1, 5)),
      content: 'Thanks, are you sure this is your email?'
    }).then(function (){
      emailConfirmation(email)
    })
  } else {
    question('This is not a valid email address, please try again', emailAnswer)
  }
}

var emailConfirmation = function(email) {
  botui.action.button({
    delay: 1000,
    action: [{
      text: 'Yes',
      value: 'Yes'
    }, {
      text: 'No',
      value: 'No'
    }]
  }).then(function (res) {
    if (res.value == 'Yes') {
      data.email = email
      botui.message
      .bot({
        delay: 1000,
        content: 'Brilliant!'
      }).then(function (){
        question('Where are you currently located?', locationAnswer)
      })
    } else {
      question('Have another go...', emailAnswer)
    }
  })
}

// LOCATION

var locationAnswer = function() {
  botui.action.text({
    delay: 0,
    action: {
      size: 70,
      id: 'location'
    }
  }).then(function (res) {
    if (res.location == 'UK' || res.value.split(' ')[res.value.split(' ').length - 1] == 'Kingdom') {
      if (!res.location) {
        question('I would love to visit ' + res.value.split(',')[0] + '... Do you have the right to work here in the UK?', rightToWorkAnswer)
        data.location = res.value.split(',')[0]
      } else {
        question('I would love to visit ' + res.value + '... Do you have the right to work here in the UK?', rightToWorkAnswer)
        data.location = res.value
      }
    } else {
      if (!res.location) {
        question('I see you are based outside of the UK, do you currently have the right to work in EU?', rightToWorkAnswer)
        data.location = res.value.split(',')[0]
      } else {
        question('I see you are based outside of the UK, do you currently have the right to work in EU?', rightToWorkAnswer)
        data.location = res.value
      }
    }
  })
}

var rightToWorkAnswer = function () {
  botui.action.button({
    delay: 1000,
    action: [{
      text: 'Yes',
      value: 'Yes'
    }, {
      text: 'No',
      value: 'No'
    }]
  }).then(function (res) {
    botui.message
    .bot({
      delay: 1000,
      content: 'Ok!'
    }).then(function (){
      data.rightToWork = res.value
      console.log(data);
      $.ajax({
        url: 'url.com',
        type: 'POST',
        data: data,
        success: function (res) {
          question('Pick a password and I\'ll get you logged in...', passwordAnswer)
        },
        error: function (error) {
          console.log(error);
        }
      })
    })
  })
}

var passwordAnswer = function () {
  var password;
  botui.action.text({
    addMessage: false,
    delay: 0,
    action: {
      size: 70,
      sub_type: 'password'
    }
  }).then(function (res) {
    password = res.value
    passwordValidation(password)
  });
}

var passwordValidation = function (password) {
  if (password.length < 8) {
    question('Your pass word must conatin 8 characters please try again', passwordAnswer)
  } else {
    botui.message
    .bot({
      delay: 1000,
      content: passwordConfirmStatements[getRandomIntInclusive(0, passwordConfirmStatements.length)]
    }).then(function (){
      passwordConfirmation(password)
    })
  }
}

var passwordConfirmation = function (password) {
  var passwordConfirmation;
  botui.action.text({
    addMessage: false,
    delay: 0,
    action: {
      size: 70,
      sub_type: 'password'
    }
  }).then(function (res) {
    passwordConfirmation = res.value
    if (passwordConfirmation == password) {
      return botui.message.bot({
        delay: 1000,
        content: 'Give me a sec, loggin you in now....'
      });
    } else {
      question('They don\'t match dickhead, try again..', passwordAnswer)
    }
  });
}

question('Hi I\'m Jamie, what\'s your full name?', nameAnswer)
