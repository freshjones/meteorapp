getSetting = function(whichKey, defaultValue){
  var settings=Settings.find({'key': whichKey }).fetch()[0];
  if(settings){
    return settings.value;
  }
  return typeof defaultValue === 'undefined' ? '' : defaultValue;
}