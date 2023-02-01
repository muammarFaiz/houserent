const tohousepage = document.querySelector('#aa')
window.addEventListener('load', async (event) => {
  const registerForm = document.querySelector('#registerForm')
  const loginForm = document.querySelector('#loginForm')
  const gridparent = document.querySelector('.mygrid-parent')
  
  function runEverywhere() {
    function sidemenu() {
      const burgercontainer = document.querySelector('.burgercontainer')
      const sidemenu = document.querySelector('.sidemenu')
      const sidemenu_contentwrap = document.querySelector('.sidemenu_contentwrap')
      const body_el = document.querySelector('body')
      const thehtml = document.querySelector('html')
    
      function toggleSidemenu (ev) {
        if(thehtml.scrollHeight > thehtml.clientHeight) {
          body_el.classList.toggle('replace_scrollbar')
        }
        burgercontainer.classList.toggle('burgerclicked')
        body_el.classList.toggle('sidemenuon')
      }
      
      burgercontainer.addEventListener('click', toggleSidemenu)
      sidemenu.addEventListener('click', toggleSidemenu)
      sidemenu_contentwrap.addEventListener('click', function(ev) {ev.stopPropagation()})
    }
    sidemenu()
  }
  runEverywhere()

  const utils = {
    yesnoDialog: function(dialog_words, nextCB) {
      const dialog = document.querySelector('#mainDialog')

      const buttonWrapper = document.createElement('div')
      const b_yes = document.createElement('button')
      const b_no = document.createElement('button')
      b_yes.innerText = 'Yes'
      b_no.innerText = 'No'
      buttonWrapper.classList.add('btnWrap')
      b_yes.classList.add('dialogButton', 'dialogButtonYes')
      b_no.classList.add('dialogButton', 'dialogButtonNo')

      dialog.appendChild(dialog_words)
      buttonWrapper.appendChild(b_yes)
      buttonWrapper.appendChild(b_no)
      dialog.appendChild(buttonWrapper)
      this.ifYesDo(dialog, nextCB)
      return dialog
    },
    ifYesDo: function(dialog, cb) {
      const dialogButton = document.querySelectorAll('.dialogButton')
      
      dialogButton.forEach((element, key, parent) => {
        element.addEventListener('click', (ev2) => {
          dialog.close()
          if (element.innerHTML === 'Yes' || element.innerHTML === 'Ok') cb?.()
        })
      })
    },
    clickToHousePage: function() {
      const tohousepage = document.querySelectorAll('.clicktohousepage')

      tohousepage.forEach(function(elem, key, parent) {
        elem.addEventListener('click', function() {
          window.location.href = '/house/test'
        })
      })
    }
  }

  if(registerForm) {
    const dialog_words = document.createElement('p')
    dialog_words.innerText = `username: ${document.querySelector('#formUsername').value}
    age: ${document.querySelector('#formAge').value}
    password: ${document.querySelector('#formPassword').value}

    Are you sure?`
    const dialog = utils.yesnoDialog(dialog_words, () => registerForm.submit())
    registerForm.addEventListener('submit', (ev) => {
      const inputs = document.querySelectorAll('.lrform_input')
      ev.preventDefault()
      dialog.showModal()
    })
  } else if(loginForm) {

  } else if(gridparent) {
    // user in homepage
    utils.clickToHousePage()
  }
})