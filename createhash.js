/* FUNCTIONS TO GENERATE THE RANDOM HASH
 * ---------------------------------------------------------------------
 * I'm only using numbers, letters from A-Z both lowercase & uppercase,
 * however, you can add other characters to increase the randomness.
 =====================================================================*/

function randomChar() {
  var n = Math.floor(Math.random() * 62);
  if(n < 10) return n; // 0-9
  if(n < 36) return String.fromCharCode(n + 55); // A-Z
  return String.fromCharCode(n+61); // a-z
}

function randomString(len) {
  var str = '';
  while(str.length < len) str += randomChar();
  return str;
}
  
module.exports = randomString;