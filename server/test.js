const hehe = {
  yo: function() {
    this.ye()
  },
  ye: function() {
    console.log('yes it does')
  }
}
hehe.yo()