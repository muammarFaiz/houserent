const tohousepage = document.querySelector('#aa')
window.addEventListener('load', async (event) => {
  const registerForm = document.querySelector('#registerForm')
  const loginForm = document.querySelector('#loginForm')
  const gridparent = document.querySelector('.mygrid-parent')
  const housepagewrap = document.querySelector('.house-page__wrap')
  
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
            const house_index = elem.children['1'].firstElementChild.firstElementChild.className
            window.location.assign('/house/' + house_index)
          })
        })
      },
      replace_scrollbar: function() {
        const thehtml = document.querySelector('html')
        if (thehtml.scrollHeight > thehtml.clientHeight) {
          const body_el = document.querySelector('body')
          body_el.classList.toggle('replace_scrollbar')
        }
      },
    }
  
  function runEverywhere() {
    function sidemenu() {
      const burgercontainer = document.querySelector('.burgercontainer')
      const sidemenu = document.querySelector('.sidemenu')
      const sidemenu_contentwrap = document.querySelector('.sidemenu_contentwrap')
      const body_el = document.querySelector('body')
    
      function toggleSidemenu (ev) {
        burgercontainer.classList.toggle('burgerclicked')
        body_el.classList.toggle('sidemenuon')
        body_el.classList.toggle('noscroll')
        utils.replace_scrollbar()
      }
      
      burgercontainer.addEventListener('click', toggleSidemenu)
      sidemenu.addEventListener('click', toggleSidemenu)
      sidemenu_contentwrap.addEventListener('click', function(ev) {ev.stopPropagation()})
    }
    sidemenu()
  }
  runEverywhere()

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
  } else if(housepagewrap) {
    // user in house page
    const imagewrap = document.querySelector('.house-page__houseimg-wrap')
    function toggle_displayimg() {
      imagewrap.classList.toggle('house-page__imagedisplayfront')
      document.querySelector('body').classList.toggle('noscroll')
      utils.replace_scrollbar()
    }
    imagewrap.addEventListener('click', toggle_displayimg)
  }
})