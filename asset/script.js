const mainImgCardCnt=document.querySelector(".main-card-image-cnt");
const listCardContainer=document.querySelector(".list-image");
const imgCard=document.querySelector(".list-image .card img");
const mainImgCard=document.querySelector(".main-card-image");
const atkDefense=document.querySelector(".attack-defense");
const search= document.querySelector(".search-card input");
let autoComplete= document.querySelector(".auto-complete"); 
let searchIcon= document.querySelector(".search-icon"); 
const description=document.querySelector(".description");
const pagination=document.querySelector(".pagination"); 
const navList=document.querySelectorAll("nav ul li");
const quickPlay=document.querySelector(".quic-play");
const cardName=document.querySelector(".card-name");
const archType=document.querySelector(".archtype");
const next=document.querySelector(".arrow-next"); 
const prev=document.querySelector(".arrow-back"); 
const modal = document.querySelector(".modal");
let buttonPagination=undefined;
let btnDetail=undefined;
//result
let result;
let monsterType=[];
let trapType=[];
let spellType=[];
let otherType=[];
let currentType=undefined;

//for card pagination
let btnCurrentActive=-1;
let cardPaginationList=[];

//for button pagination
let paginationListAll=0;
let headPagination=0;
let tailPagination=5;
let btnPaginationActive={
  id: headPagination,
  text: (headPagination+1).toString()
}

// function defenition
async function callAPI(){
  return fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php", {
    method: 'GET'
  }).then(response => response.json())
    .then(result => result.data)
}

async function initUI(){
  result= await callAPI();
  paginationListAll=Math.floor(result.length/6)//1996
  cardPaginationList=result.slice(0,6);
  renderListCardUI(cardPaginationList);
  initListBtnPagination();
  setTypeCard();
  currentType=result;
}

function renderListCardUI(){
  cardPaginationList.forEach( (cardData,index) => {
    listCardContainer.innerHTML+=`<div class="card">
      <div class="list-card-img-cnt" id=id="${cardData.id}">
        <img src="${cardData.card_images[0].image_url}" alt="" class="list-card-image">
      </div>
      <h4 class="card-title">${cardData.name ? cardData.name.slice(0,16)+'...' : cardData.name}</h4>
      <p class="card-type">${cardData.type}</p>
      <div class="button-choose">
        <button class="btn-detail" id="${index}">See card</button>
        <button class="btn-add">+</button>
      </div>
    </div>`
  })
  btnDetail=[...document.getElementsByClassName("btn-detail")];
}

function updateListCardUI(type){
  let cardImg=document.getElementsByClassName("list-card-image");
  let cardTitle=document.getElementsByClassName("card-title");
  let cardType=document.getElementsByClassName("card-type");

  let sliceIndex = (parseInt(btnPaginationActive.text)-1)*6;
  cardPaginationList = type.slice(sliceIndex,sliceIndex+6)
  
  for( let i =0; i<6 ; i++){
    cardImg[i].src=cardPaginationList[i].card_images[0].image_url;
    cardTitle[i].innerText=cardPaginationList[i].name 
      ? cardPaginationList[i].name.slice(0,16)+'...' 
      : cardPaginationList[i].name;
    cardType[i].innerText=cardPaginationList[i].type;
  }

  [...btnDetail].forEach(btn=>btn.classList.remove("btn-detail-active"))

}

function renderMainCardUI(card){
  cardName.innerText = card.name !== undefined ? card.name : '-';
  description.innerText = card.desc !== undefined ? card.desc : '-';
  quickPlay.innerText = card.race !== undefined ? card.race : '-';
  archType.innerText = card.archetype !== undefined ? card.archType : '-';
  mainImgCard.src = card.card_images[0].image_url;
  atkDefense.innerText = card.atk !== undefined ? card.atk+'  /  '+card.def : '-';
}

function initListBtnPagination(){
  for(let i=0; i<=tailPagination; i++){
    if(i==btnPaginationActive.id){
      pagination.innerHTML+=`<button class="pagination-btn pagination-btn-on" id=${i}>${headPagination+(i+1)}</button>`;
      continue;
    }
    pagination.innerHTML+=`<button class="pagination-btn" id=${i}>${headPagination+(i+1)}</button>`;
  }
  buttonPagination=[...document.getElementsByClassName("pagination-btn")];
}

function updateListBtnPagination(payload,direct){
  if( payload === 'direct' ){
    buttonPagination.forEach( btn=> btn.id === direct 
      ? btn.classList.add("pagination-btn-on") 
      : btn.classList.remove("pagination-btn-on") );
    return
  } else {
    if( payload === 'next' ){
      if( btnPaginationActive.id < 5 ){ btnPaginationActive.id++; }
    } else if( payload === 'previous' ){
      if( btnPaginationActive.id > 0){ btnPaginationActive.id--; }
    } else if(payload === 'reset'){
      btnPaginationActive={
        id: headPagination,
        text: (headPagination+1).toString()
      }
    }

    buttonPagination.forEach( btn => {
      btn.id == btnPaginationActive.id 
        ? btn.classList.add("pagination-btn-on") 
        : btn.classList.remove("pagination-btn-on");
    })
    btnPaginationActive.text=buttonPagination[btnPaginationActive.id].innerText
  }
  
  insertListBtnPagination();
  updateListCardUI(currentType);
  
}

function insertListBtnPagination(){
  isInsert = btnPaginationActive.id 
  isInsertText= btnPaginationActive.text;
  if( isInsert === tailPagination){
    headText = parseInt(buttonPagination[headPagination].innerText);
    buttonPagination.forEach( btn => {
      headText++;
      btn.innerText = headText;
      btnPaginationActive.text=headText.toString();
    })
  }

  if( isInsert === headPagination && isInsertText !== '1'){
    headText = parseInt(buttonPagination[headPagination].innerText)-2;
    buttonPagination.forEach( btn => {
      headText++;
      btn.innerText = headText;
    })
    btnPaginationActive.text=buttonPagination[headPagination].innerText;
  }
}

//rerender
function setTypeCard(){
  for(let i=0; i<result.length; i++) { 
    if(result[i].type.toLowerCase().includes('monster')){
      monsterType.push(result[i]);
    } else if(result[i].type.toLowerCase().includes('spell')){
      spellType.push(result[i]);
    } else if(result[i].type.toLowerCase().includes('trap')){
      trapType.push(result[i]);
    } else{
      otherType.push(result[i]);
    }
  }
  // for(let i=0; i<result.length; i++) { typeResult.push(result[i].type); }
  // var uniq = [ ...new Set(typeResult) ];
}

function renderTypeCard(data){

  data.classList.add("list-active")

  if(data.innerText === 'All'){
    paginationListAll=Math.floor(result.length/6)
    currentType=result;
    updateListBtnPagination('reset',undefined)
  }else if(data.innerText === 'Monsters'){
    paginationListAll=Math.floor(monsterType.length/6)
    currentType=monsterType;
    updateListBtnPagination('reset',undefined)
  } else if(data.innerText === 'Spells'){
    paginationListAll=Math.floor(spellType.length/6)
    currentType=spellType;
    updateListBtnPagination('reset',undefined)
  } else if(data.innerText === 'Traps'){
    paginationListAll=Math.floor(trapType.length/6)
    currentType=trapType;
    updateListBtnPagination('reset',undefined)
  } else if(data.innerText === 'Others'){
    paginationListAll=Math.floor(otherType.length/6)
    currentType=otherType;
    updateListBtnPagination('reset',undefined)
  }
}

function searchAutoComplete(value){
  if(value.length<=0){
    autoComplete.innerHTML='';
    autoComplete.style.display='none'
    return;
  }
  autoComplete.style.display='block'
  let cardResult=currentType.filter( data => data.name.toLowerCase().includes(value.toLowerCase()));
  renderAutoComplete(cardResult);
}

function renderAutoComplete(card){
  card = card.length>8 ? card.slice(0,8) : card;
  autoComplete.innerHTML='';
  card.forEach( data =>{
    autoComplete.innerHTML+=`<h4 class="text-auto-complete">
      ${data.name.length>18 ? data.name.slice(0,18)+'...' : data.name}
    </h4>`
  })

  let textNode = [].slice.call(autoComplete.children);

  for(let i=0;i<textNode.length;i++){
    textNode[i].addEventListener('click',function(){
      renderMainCardUI(card[i]);
      autoComplete.innerHTML='';
      search.value='';
    })
    textNode[i].addEventListener('mouseenter',()=>search.value=card[i].name)
    // textNode[i].addEventListener('mouseleave',()=>search.value='')
  }
}

// { journey.filter( list => list.title.toLowerCase().includes(searchTitle.toLowerCase()) )

// event
document.addEventListener('click',function(e){
  if(e.target.className === 'btn-detail'){
    [...btnDetail].forEach( btn => btn.id === e.target.id 
      ? btn.classList.add("btn-detail-active") 
      : btn.classList.remove("btn-detail-active") )

    btnCurrentActive=e.target.id;
    renderMainCardUI(cardPaginationList[e.target.id])
  }

  if(e.target.className === 'pagination-btn'){
    updateListBtnPagination('direct',e.target.id);
    btnPaginationActive.id = parseInt(e.target.id);
    btnPaginationActive.text=e.target.innerText
    updateListCardUI(currentType);
  }

  if(e.target.className !== 'auto-complete'){
    autoComplete.innerHTML=''
    autoComplete.style.display='none'
  }

  navList.forEach( nav =>  e.target==nav ? renderTypeCard(nav) : nav.classList.remove("list-active") );

})

mainImgCardCnt.addEventListener('click', e => {
  imgSrc=modal.firstChild.nextSibling.firstChild.nextSibling
  imgSrc.src=mainImgCard.src;
  modal.classList.toggle("modal-active");
})

search.addEventListener('input', e => searchAutoComplete(e.target.value))
searchIcon.addEventListener('click',()=>{
  if(search.value.length){
    let card=currentType.filter( data => data.name.toLowerCase().includes(search.value.toLowerCase()))[0];
    renderMainCardUI(card)
    search.value=card.name
  }
})


next.addEventListener('click', e=> updateListBtnPagination('next'))
prev.addEventListener('click', e=> updateListBtnPagination('previous'))
modal.addEventListener('click', e => modal.classList.toggle("modal-active"))



// window.addEventListener('DOMContentLoaded', function() {
//   console.log('window - DOMContentLoaded - capture'); // 1st
// }, true);

// window.addEventListener("load", function(){
//   console.log('window - DOMContentLoaded - capture'); // 1st
// });

initUI();
