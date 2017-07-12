function getRandomIntInclusive(e,t){return e=Math.ceil(e),t=Math.floor(t),Math.floor(Math.random()*(t-e+1))+e}var botui=new BotUI("delivery-bot"),passwordConfirmStatements=["Could you confirm that for me?","Great, once more for good measure","Perfect, just to be sure can you please confirm your password...","Once more for good measure...","And again just to be sure..."],data={},question=function(e,t){botui.message.bot({delay:2e3/getRandomIntInclusive(1,5),content:e}).then(function(){t()})},nameAnswer=function(){botui.action.text({delay:1e3,action:{size:70}}).then(function(e){validateName(e.value)})},validateName=function(e){e.split(" ").length<2?botui.message.bot({delay:2e3,content:"Please enter your full name"}).then(function(){nameAnswer()}):successName(e)},successName=function(e){data.name=e,botui.message.bot({delay:1e3,content:"Hello "+e.split(" ")[0]}).then(function(){question("What type of Data Scientist are you?",typeAnswer)})},typeAnswer=function(){botui.action.button({delay:1e3,action:[{text:"Graduate",value:"1"},{text:"Junior",value:"2"},{text:"Experienced",value:"3"}]}).then(function(e){data.level=e.value,botui.message.bot({delay:1e3,content:"Great! We have tons of roles at that level"}).then(function(){question("What's your email address so I can get an account set up?",emailAnswer)})})},emailAnswer=function(){botui.action.text({delay:1e3,action:{size:70}}).then(function(e){validateEmail(e.value)})},validateEmail=function(e){/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e)?botui.message.bot({delay:2e3/getRandomIntInclusive(1,5),content:"Thanks, are you sure this is your email?"}).then(function(){emailConfirmation(e)}):question("This is not a valid email address, please try again",emailAnswer)},emailConfirmation=function(e){botui.action.button({delay:1e3,action:[{text:"Yes",value:"Yes"},{text:"No",value:"No"}]}).then(function(t){"Yes"==t.value?(data.email=e,botui.message.bot({delay:1e3,content:"Brilliant!"}).then(function(){question("Where are you currently located?",locationAnswer)})):question("Have another go...",emailAnswer)})},locationAnswer=function(){botui.action.text({delay:0,action:{size:70,id:"location"}}).then(function(e){"UK"==e.location||"Kingdom"==e.value.split(" ")[e.value.split(" ").length-1]?e.location?(question("I would love to visit "+e.value+"... Do you have the right to work here in the UK?",rightToWorkAnswer),data.location=e.value):(question("I would love to visit "+e.value.split(",")[0]+"... Do you have the right to work here in the UK?",rightToWorkAnswer),data.location=e.value.split(",")[0]):e.location?(question("I see you are based outside of the UK, do you currently have the right to work in EU?",rightToWorkAnswer),data.location=e.value):(question("I see you are based outside of the UK, do you currently have the right to work in EU?",rightToWorkAnswer),data.location=e.value.split(",")[0])})},rightToWorkAnswer=function(){botui.action.button({delay:1e3,action:[{text:"Yes",value:"Yes"},{text:"No",value:"No"}]}).then(function(e){botui.message.bot({delay:1e3,content:"Ok!"}).then(function(){data.rightToWork=e.value,console.log(data),$.ajax({url:"url.com",type:"POST",data:data,success:function(e){question("Pick a password and I'll get you logged in...",passwordAnswer)},error:function(e){console.log(e)}})})})},passwordAnswer=function(){var e;botui.action.text({addMessage:!1,delay:0,action:{size:70,sub_type:"password"}}).then(function(t){e=t.value,passwordValidation(e)})},passwordValidation=function(e){e.length<8?question("Your pass word must conatin 8 characters please try again",passwordAnswer):botui.message.bot({delay:1e3,content:passwordConfirmStatements[getRandomIntInclusive(0,passwordConfirmStatements.length)]}).then(function(){passwordConfirmation(e)})},passwordConfirmation=function(e){var t;botui.action.text({addMessage:!1,delay:0,action:{size:70,sub_type:"password"}}).then(function(o){if((t=o.value)==e)return botui.message.bot({delay:1e3,content:"Give me a sec, loggin you in now...."});question("They don't match dickhead, try again..",passwordAnswer)})};question("Hi I'm Jamie, what's your full name?",nameAnswer);