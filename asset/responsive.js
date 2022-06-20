let burger=document.querySelector('.burger-menu');
let line1=document.querySelector('.line1');
let line2=document.querySelector('.line2');
let line3=document.querySelector('.line3');
let nav=document.querySelector("nav ul");

burger.addEventListener('click', function(){
    line1.classList.toggle('line1-active')
    line2.classList.toggle('line2-active')
    line3.classList.toggle('line3-active')
    burger.classList.toggle('burger-active')
    nav.classList.toggle('wrapper-active')
})
