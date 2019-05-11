const els = {};

function writeResp(data) {
  els.resp.innerText = data;
}

function handleBtnClick(ev) {
  const btn = ev.target;
  const name = btn.name;
  const protocol = btn.dataset.protocol;
  
  switch(name){
    case 'cReq':
      writeResp('Loading');
      fetch('https://rickandmortyapi.com/api/character/1')
        .then((resp) => resp.json())
        .then((data) => writeResp(JSON.stringify(data, null, 2)))
        .catch((err) => writeResp(err));
      break;
    
    case 'sReq':
      writeResp('Loading');
      fetch(`/api/data?protocol=${protocol}`)
        .then((resp) => resp.text())
        .then((data) => {
          if(data) writeResp(data);
          else writeResp('No data returned');
        })
        .catch((err) => writeResp(err));
      break;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', handleBtnClick);
  els.resp = document.querySelector('#resp');
  
  if(window.appData){
    writeResp( JSON.stringify(window.appData, null, 2) );
  }
});