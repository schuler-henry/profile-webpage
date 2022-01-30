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
   */
  if (name.length >= 4 && name.length <= 16) {
    if (name.match("^[a-zA-Z0-9]+$")) {
      return true
    }
  }
  return false;
}

export default isUsernameValid