/**
 * Function to check whether the given username meets the requirements.
 * @param {string} name username to check
 * @returns {boolean} true if username meets requirements, false if not
 */
function isUsernameValid(name: string): boolean {
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
 * Funciton to check whether the given password meets the requirements.
 * @param {string} password password to check
 * @returns {boolean} true if password meets requirements, false if not
 */
function isPasswordValid(password: string): boolean {
  /**
   * Requirements:
   * Length: 
   */
  return false;
}

export default isUsernameValid