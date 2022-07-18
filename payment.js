(function() {
    var customCheckout = customcheckout();
  
    var isCardNumberComplete = false;
    var isCVVComplete = false;
    var isExpiryComplete = false;
  
    var customCheckoutController = {
      init: function() {
        console.log('checkout.init()');
        this.createInputs();
        this.addListeners();
      },
      createInputs: function() {
        console.log('checkout.createInputs()');
        var options = {};
  
        // Create and mount the inputs
        console.log("in mount ")
        options.placeholder = 'Card number';
        customCheckout.create('card-number', options).mount('#card-number');
  
        options.placeholder = 'CVV';
        customCheckout.create('cvv', options).mount('#card-cvv');
  
        options.placeholder = 'MM/YY';
        customCheckout.create('expiry', options).mount('#card-expiry');

      },
      addListeners: function() {
        var self = this;
         console.log("in submit")
        // listen for submit button
        if (document.getElementById('checkout-form') !== null) {
          document
            .getElementById('checkout-form')
            .addEventListener('submit', self.onSubmit.bind(self));
        }
         console.log("submit done")




        customCheckout.on('brand', function(event) {
          console.log('brand: ' + JSON.stringify(event));
  
          var cardLogo = 'none';

          if (event.brand && event.brand !== 'unknown') {
            var filePath =
              'https://cdn.na.bambora.com/downloads/images/cards/' +
              event.brand +
              '.svg';
            cardLogo = 'url(' + filePath + ')';
          }
          document.getElementById('card-number').style.backgroundImage = cardLogo;
          document.getElementById('card-number').style.backgroundRepeat = "no-repeat";
          document.getElementById('card-number').style.backgroundPosition = "right";
        console.log("button")
        });
  
        customCheckout.on('blur', function(event) {
          console.log('blur: ' + JSON.stringify(event));
        });
  
        customCheckout.on('focus', function(event) {
          console.log('focus: ' + JSON.stringify(event));
        });
  
        customCheckout.on('empty', function(event) {
          console.log('empty: ' + JSON.stringify(event));
  
          if (event.empty) {
            if (event.field === 'card-number') {
              isCardNumberComplete = false;
            } else if (event.field === 'card-cvv') {
              isCVVComplete = false;
            } else if (event.field === "card-expiry") {
              isExpiryComplete = false;
            }
            self.setPayButton(false);
          }
        });
  
        customCheckout.on('complete', function(event) {
          console.log('complete: ' + JSON.stringify(event));
  
          if (event.field === 'card-number') {
            isCardNumberComplete = true;
            self.hideErrorForId('card-number');
          } else if (event.field === 'cvv') {
            isCVVComplete = true;
            self.hideErrorForId('card-cvv');
          } else if (event.field === 'expiry') {
            isExpiryComplete = true;
            self.hideErrorForId('card-expiry');
          }
          console.log(isCardNumberComplete);
          console.log(isCVVComplete);
          console.log(isExpiryComplete);

          self.setPayButton(
            isCardNumberComplete && isCVVComplete && isExpiryComplete
           );
        });
  
        customCheckout.on('error', function(event) {
          console.log('error: ' + JSON.stringify(event));
  
          if (event.field === 'card-number') {
            isCardNumberComplete = false;
            self.showErrorForId('card-number', event.message);
          } else if (event.field === 'card-cvv') {
            isCVVComplete = false;
            self.showErrorForId('card-cvv', event.message);
          } else if (event.field === 'card-expiry') {
            isExpiryComplete = false;
            self.showErrorForId('card-expiry', event.message);
          } 
          self.setPayButton(false);
        });
      },
      onSubmit: function(event) {
        var self = this;
  
        console.log('checkout.onSubmit()');
  
        event.preventDefault();
        self.setPayButton(false);
        self.toggleProcessingScreen();
  
        var callback = function(result) {
          console.log('token result : ' + JSON.stringify(result));
  
          if (result.error) {
            self.processTokenError(result.error);
          } else {
            self.processTokenSuccess(result.token);
          }
        };
        
        console.log('checkout.createToken()');
        customCheckout.createToken(callback);
      },
      hideErrorForId: function(id) {
        console.log('hideErrorForId: ' + id);
  
        var element = document.getElementById(id);
  
        if (element !== null) {
          var errorElement = document.getElementById(id + '-error');
          if (errorElement !== null) {
            errorElement.innerHTML = '';
          }
  
          var bootStrapParent = document.getElementById(id + '-bootstrap');
          if (bootStrapParent !== null) {
            bootStrapParent.classList.remove('has-error');
            bootStrapParent.classList.add('has-success');
          }
        } else {
          console.log('showErrorForId: Could not find ' + id);
        }
      },
      showErrorForId: function(id, message) {
        console.log('showErrorForId: ' + id + ' ' + message);
  
        var element = document.getElementById(id);
  
        if (element !== null) {
          var errorElement = document.getElementById(id + '-error');
          if (errorElement !== null) {
            errorElement.innerHTML = message;
          }
  
          var bootStrapParent = document.getElementById(id + '-bootstrap');
          if (bootStrapParent !== null) {
            bootStrapParent.classList.add('has-error');
            bootStrapParent.classList.remove('has-success');
          }
        } else {
          console.log('showErrorForId: Could not find ' + id);
        }
      },
      setPayButton: function(enabled) {
        console.log('checkout.setPayButton() disabled: ' + !enabled);
  
        var payButton = document.getElementById('pay-button');
        if (enabled) {
          payButton.disabled = false;
          payButton.className = 'btn btn-primary';
        } else {
          payButton.disabled = true;
          payButton.className = 'btn btn-primary disabled';
        }
      },
      toggleProcessingScreen: function() {
        var processingScreen = document.getElementById('processing-screen');
        if (processingScreen) {
          processingScreen.classList.toggle('visible');
        }
      },
      showErrorFeedback: function(message) {
        var xMark = '\u2718';
        this.feedback = document.getElementById('feedback');
        this.feedback.innerHTML = xMark + ' ' + message;
        this.feedback.classList.add('error');
      },
      showSuccessFeedback: function(message) {
        var checkMark = '\u2714';
        this.feedback = document.getElementById('feedback');
        this.feedback.innerHTML = checkMark + ' ' + message;
        this.feedback.classList.add('success');
       
      },
      processTokenError: function(error) {
        error = JSON.stringify(error, undefined, 2);
        console.log('processTokenError: ' + error);
  
        this.showErrorFeedback(
          'Error creating token: </br>' + JSON.stringify(error, null, 4)
        );
        this.setPayButton(true);
        this.toggleProcessingScreen();
      },
      processTokenSuccess: function(token) {
        console.log('processTokenSuccess: ' + token);
  
        this.showSuccessFeedback('Success! Created token: ' + token);
        this.setPayButton(true);
        this.toggleProcessingScreen();
  
        // Use token to call payments api
        this.makeTokenPayment(token);
        
      },
      processPaymentError: function(error) {
        error = JSON.stringify(error, undefined, 2);
        console.log('processPaymentError: ' + error);
  
        this.showErrorFeedback(
          'Error creating code: </br>' + JSON.stringify(error, null, 4)
        );
        this.setPayButton(true);
        this.toggleProcessingScreen();
      },
      
      createTokenProfile: function(trans_id){
        let data = JSON.stringify({
          card:{
          "create_from_id": trans_id
          },
          "billing": {
            "name": "chaiVala1",
               "address_line1": "Plot 276A, Silicon City",
               "address_line2": "",
               "city": "Indore",
               "province": "",
               "country": "in",
               "postal_code": "452012"
        }
        });
        let passcode_encoded = btoa("300212893:4391AAF0D238438EbF6DeA7430dAe0f0");
        console.log(passcode_encoded)
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        
        xhr.addEventListener("readystatechange", function() {
          if(this.readyState === 4) {
            console.log(this.responseText);
            location.href="orderPlaced.html";
          }
        });
        
        xhr.open("POST", "https://api.na.bambora.com/v1/profiles");
        xhr.setRequestHeader("Authorization", "Passcode " + passcode_encoded);
        xhr.setRequestHeader("Content-Type", "application/json");
        // WARNING: Cookies will be stripped away by the browser before sending the request.
        
        
        xhr.send(data);
      },
      
      makeTokenPayment: function(code){
        var x = localStorage.getItem("totalAmount");
        var convert_pay= parseFloat(x/61.32);
        var data1 = JSON.stringify({
          "amount": convert_pay,
          "payment_method": "token",
          "token": {
            "name": "chaiVala1",
            "code": code,
            "complete": true
          }
        });
        console.log("inside make payment")
        var passcode_encoded_1 = btoa("300212893:D89E430dB0014eb39804C58730100e6d");
        var self1=this;
        var xhr1 = new XMLHttpRequest();
        xhr1.withCredentials = false;
        xhr1.addEventListener("readystatechange", function() {
          if(this.readyState === 4) {
            console.log(this.responseText);
            var data=this.responseText;
            var jsonResponse = JSON.parse(data);
            console.log(jsonResponse.id);
            var trans_id = jsonResponse.id;
            //self1.createTokenProfile(trans_id);
            setTimeout( self1.createTokenProfile(trans_id),2000)
          }
        });
        
        xhr1.open("POST", "https://api.na.bambora.com/v1/payments",);
        xhr1.setRequestHeader("Authorization", "Passcode " + passcode_encoded_1);
        xhr1.setRequestHeader("Content-Type", "application/json");
        // WARNING: Cookies will be stripped away by the browser before sending the request.
        
        
        xhr1.send(data1);
      }
      
    };
   
    
    customCheckoutController.init();
  })();