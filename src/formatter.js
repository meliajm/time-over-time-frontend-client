class Formatter {
    static capitalize(str) {
      return `${str[0].toUpperCase()}${str.slice(1)}`
    }
  
    static sanitize(str) {
      return str.replace(/[^A-Za-z0-9-' ]+/g, '')
    }
  
    static titleize(str) {
      const exceptions = ['the', 'a', 'an', 'but', 'of', 'and', 'for', 'at', 'by', 'from', 'to']
      str = this.capitalize(str)
      let strArray = str.split(' ')
      const title = []
      for (let i=0; i<strArray.length; i++) {
        if (exceptions.includes(strArray[i])) {
          title.push(strArray[i])
        } else {
          title.push(this.capitalize(strArray[i]))
        }
      }
      return title.join(' ')
    }
  }