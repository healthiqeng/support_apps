/*global jQuery*/

var $j = jQuery.noConflict();
console.log("Version 1.5");
/**/
/* Key Shortcuts /*
// ctrl + t = Touched Trivially
// ctrl + d = Disability
// ctrl + b = Bad Number
// crtl + x = Xfered
// ctrl + w = Will Not Buy Right Now
// ctrl + u = Uninsurable
// ctrl + q = DNC
// ctrl + n = No VM
// ctrl + h = Hang Up

/* Constants for Pedrokeys */
const TRIVI = '0Touched: Trivially';
const DISAB = 'NRN: Disability';
const BADNUM = '2BadNumber: Wrong Number';
const XFER = '0Touched: Transferred';
const WILLNOTBUY = 'NRN: Will Not Buy Right Now';
const UNINSURE = 'NRN: Uninsurable';
const DNC = 'NFC: DNC List';
const NOVM = '0Not Contacted: No VM';
const LEFTVM = '0Not Contacted: Left Voicemail';


const BANNER_CLASS = 'hiq-banner';
const HANGUP_BUTTON = '.end-contact';
const HANGUP_CONFIRM_BUTTON = '.confirm-end-contact';
const SUBMIT_BUTTON = '.save-close-acw-submit';


class HiqHotkeys{
  constructor(){
    this.helpText = [];
    this.isMac();
    this.bindKeys();
  }

  isMac(){
    if (navigator.platform.indexOf('Mac') > -1){
      console.log("is Mac");
      this.PREFIX = 'ctrl';
      this.FRIENDLY_PREFIX = 'Ctrl';
    }
    else{
      console.log("is PC");
      this.PREFIX = 'alt';
      this.FRIENDLY_PREFIX = 'Alt';
    }
  }

  click(query, name){
    let element = $j(query);
    if(element.length){
      element.click();
      return true;
    }else{
      alert(`Could not find ${name || query}`);
    }

    return false;
  }

  banner(text){
    console.log(`banner ${text}`);
    let div = $j('<div>');
    div.text(text);
    div.addClass(BANNER_CLASS);
    $j('body').append(div);
    div.fadeIn(250).delay(3000).fadeOut(150);
  }

  hangUp(){
    var activeContact = document.querySelector('div .module-container[data-status="Active"]');
    var disconnectedContact = document.querySelector('div .module-container[data-status="Disconnected"]');

    if(activeContact){
      var endContact = activeContact.querySelector('.confirm-end-contact');
    endContact.click();
    }
    else if (disconnectedContact){
      return this.click(HANGUP_BUTTON, 'Hangup Button') &&
      this.click(HANGUP_CONFIRM_BUTTON, 'Hangup Confirm Button');
    }
   
  }

  finalize(){
    return this.click(SUBMIT_BUTTON, 'Submit button');
  }

  save(){
    //var activeContact = document.querySelector('div .module-container[data-status="Active"]');
    //var saveButton = activeContact.querySelector('form.acw-form button.save');
    //return this.click(saveButton, 'Save button') 
    var activeContact = document.querySelector('div .module-container[data-status="Active"]');
    var saveButton = activeContact.querySelector('form.acw-form button.save');
    saveButton.click();

  }



  setDisposition(disp){

    var activeContact = document.querySelector('div .module-container[data-status="Active"]');
    var disconnectedContact = document.querySelector('div .module-container[data-status="Disconnected"]');
    
      
    if (activeContact) {
      console.log("This is an Active Call");
      console.log(`handling dispo ${disp}`);

      for (var i = 0; i < activeContact.querySelectorAll('.primary-disposition .selectmenu-menu-item').length; i++){
      var dispotitle = activeContact.querySelectorAll('.primary-disposition .selectmenu-menu-item')[i].title;
       console.log(dispotitle +`compare to ${disp}`);
        if ( dispotitle == disp) {
          var dispo = activeContact.querySelectorAll('.primary-disposition .selectmenu-menu-item')[i]; //You’ll want to move this to your desired dispo item
          dispo.click();
          this.save();
          let success = this.finalize();
        if(success){
          this.banner(disp);
          console.log(`Succesfully hit a ${disp}`);
        }
      }
    }
  }
  else if (disconnectedContact){
    console.log("This is a Disconnected Call");
    console.log(`handling dispo ${disp}`);
         for (var i = 0; i < disconnectedContact.querySelectorAll('.primary-disposition .selectmenu-menu-item').length; i++){
      console.log("iterating through list of dispos");
      var dispotitle = disconnectedContact.querySelectorAll('.primary-disposition .selectmenu-menu-item')[i].title;
       console.log(dispotitle +`compare to ${disp}`);
        if ( dispotitle == disp) {
          var dispo = disconnectedContact.querySelectorAll('.primary-disposition .selectmenu-menu-item')[i]; //You’ll want to move this to your desired dispo item
          dispo.click();
          let success = this.finalize();
        if(success){
          this.banner(disp);
          console.log(`Succesfully hit a ${disp}`);
        }
      }
    }


  }
}


  handleHotkey(hotkey){
    console.log(`handle hotkey ${hotkey}`);
    switch (hotkey) {
      case 'n':
        this.setDisposition(NOVM);
        break;
      case 'l':
        this.setDisposition(LEFTVM);
        break;
      case 'h':
        this.hangUp();
        break;


        
       case 't':
       	 this.setDisposition(TRIVI);
       	 break;
       	  case 'd':
       	 this.setDisposition(DISAB);
       	 break;
       	  case 'b':
       	 this.setDisposition(BADNUM);
       	 break;
       	  case 'x':
       	 this.setDisposition(XFER);
       	 break;
       	  case 'w':
       	 this.setDisposition(WILLNOTBUY);
       	 break;
       	  case 'u':
       	 this.setDisposition(UNINSURE);
       	 break;
       	  case 'q':
       	 this.setDisposition(DNC);
       	 break;

    }
  }

  binder(item){
    return function(){
      this.handleHotkey(item);
    };
  }

  installHotkey(key, method, helpText){
    let binding = `${this.PREFIX}+${key}`;
    $j(document).bind('keydown', binding, method);
    this.helpText.push([`${this.FRIENDLY_PREFIX} + ${key}`, helpText]);
  }
  /* Key Shortcuts /*
    //ctrl + t = Touched Trivially
    // ctrl + d = Disability
    // ctrl + b = Bad Number
    // crtl + x = Xfered
    // ctrl + w = Will Not Buy Right Now
    // ctrl + u = Uninsurable
    // ctrl + q = DNC

    // ctrl + n = No VM
    // ctrl + h = Hang Up
  /* */

  bindKeys(){
    this.installHotkey('t', () => this.setDisposition(TRIVI), '0Touched: Trivially');
    this.installHotkey('d', () => this.setDisposition(DISAB), 'NRN: Disability');
    this.installHotkey('b', () => this.setDisposition(BADNUM), '2BadNumber: Wrong Number');
    this.installHotkey('x', () => this.setDisposition(XFER), '0Touched: Transferred' );
    this.installHotkey('w', () => this.setDisposition(WILLNOTBUY), 'NRN: Will Not Buy Right Now');
    this.installHotkey('u', () => this.setDisposition(UNINSURE), 'NRN: Uninsurable');
    this.installHotkey('q', () => this.setDisposition(DNC), 'NFC: DNC List' );



    this.installHotkey('n', () => this.setDisposition(NOVM), '0Not Contacted: No VM');
    this.installHotkey('l', () => this.setDisposition(LEFTVM), '0Not Contacted: Left Voicemail');
    this.installHotkey('h', () => this.hangUp(), 'Hang up');
    // $j(document).bind('keydown', 'ctrl+n', this.binder('n'));
    // $j(document).bind('keydown', 'ctrl+l', this.binder('l'));
  }
}

$j(document).ready(function(){
  let hotkeys = new HiqHotkeys();
  hotkeys.banner('Welcome! HIQ Pedrokeys is up and running');
});
