export function isEmailValid(email: string): boolean {
  /**
   * Requirements:
   * default email requirements
   * source: https://emailregex.com
   */
  return email.match(/^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/) !== null
}

/**
 * Function to check whether the given username meets the requirements.
 */
export function isUsernameValid(name: string): boolean {
  /**
   * Requirements:
   * Length: 4-16 characters
   * Characters: only letters and numbers
   * Keyword admin is not allowed
   */
  if (name.length >= 4 && name.length <= 16) {
    if (name.match("^[a-zA-Z0-9]+$")) {
      if (name.match("[a-z,A-Z,0-9]*[a,A][d,D][m,M][i,I][n,N][a-z,A-Z,0-9]*")) {
        return false;
      }
      return true;
    }
  }
  return false;
}

/**
 * Function to check whether the given password meets the requirements.
 */
export function isPasswordValid(password: string): boolean {
  /**
   * Requirements:
   * Length: min. 8 characters
   * Characters: min. 1 number, 1 uppercase character, 1 lowercase character, 1 special character
   * Characters: only letters and numbers + !*#,;?+-_.=~^%(){}|:"/
   */
  if (password.length >= 8) {
    if (password.match(".*[0-9].*") && password.match(".*[A-Z].*") && password.match(".*[a-z].*") && password.match('.*[!,*,#,;,?,+,_,.,=,~,^,%,(,),{,},|,:,",/,\,,\-].*')) {
      if (password.match('^[a-z,A-Z,0-9,!,*,#,;,?,+,_,.,=,~,^,%,(,),{,},|,:,",/,\,,\-]*$')) {
        return true;
      }
    }
  }
  return false;
}
