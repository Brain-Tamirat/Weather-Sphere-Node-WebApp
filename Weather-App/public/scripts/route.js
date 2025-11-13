const button = document.querySelectorAll('header > ul > li');

button.forEach((b)=>{
  b.addEventListener('click',(event)=>{
    if(event.target.innerText === 'Home'){
      window.location.href = 'home';
    }
    if(event.target.innerText === 'Weather'){
      window.location.href = 'weather';
    }
    if(event.target.innerText === 'About'){
      window.location.href = 'about';
    }
  })
})
