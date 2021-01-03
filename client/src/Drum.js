import React, { Component } from 'react';

class Drum extends Component{
  constructor(props) {
    super(props);

  }
  
   napraviSlot(brojSlotova,niz) {
    const a = []
    for (let i = 0; i < brojSlotova; i++) {
      a.push(React.createElement('ul',{className:'slot'},this.brojke(niz[i]) ))
    
      }
      return a
  }


   brojke(broj) {
    const a = []
    a.push(React.createElement('li',{className:'number'},broj))
    if(broj === 1){
      a.push(React.createElement('li',{className:'number'},39))
    }else{
      a.push(React.createElement('li',{className:'number'},broj-1))
      
    }

      for (let i = 1; i <= 7; i++) {
      a.push(React.createElement('li',{className:'number'},Math.floor(Math.random() * 39) ))
    
      }
      
      a.push(React.createElement('li',{className:'number'},broj+1))
   return a
  }

   pocniOdbrojavanje(onZavrsio) {
    setTimeout(function() { onZavrsio() }, 7000);
  }

    



  render(){
    const izvuceni = [ 6 , 24 , 11 , 8 , 11,13,26];
    console.log()

return(
    <div className='machine'>
        <div className='slots'>
        {this.napraviSlot(7,izvuceni)}
        {this.pocniOdbrojavanje(this.props.onZavrsio)}
    
      </div>
    </div>
  
)
  }
    
}

export default Drum