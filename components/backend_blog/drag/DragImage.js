import React from 'react';
import ReactDOM from 'react-dom';
import ReactDragListView from 'react-drag-listview';
import Link from 'next/link';
import ModalToggler from '../widget/ImageModalToggler'

const { DragColumn } = ReactDragListView;

class Dreg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragProps : {
        onDragEnd : this.onDragEnd,
        nodeSelector: '.drag',
        handleSelector: '.drag',
        ignoreSelector: '.ignore'
      }
    }
    
  }

  onDragEnd = (fromIndex, toIndex) => {
    const {handleOrderChange,type} = this.props;
    const data  = [...this.props.banner];
    const item = data.splice(fromIndex, 1)[0];
    data.splice(toIndex, 0, item);
    // this.props.setCate([]);
    //setImg([])
    handleOrderChange(data,type)
  }



  render() {
    // console.log('this.props.banner', this.props.banner);
    const {onDelete,showModal,type} = this.props;
    return (
      <div className="simple simple1">
      <div className="simple-inner drag-book">
        <DragColumn  {...this.state.dragProps}>
          {
            this.props.banner && this.props.banner.map((val, index) => (
                
              <ModalToggler className="drag"  key={`dsk-${index}`} img={val.img}  
              onClick={() => showModal(true,type,index)} 
              onDelete={()=>onDelete(index,type,val.id)}
               _text={"รูปภาพ "+(index+1)}   />
                
            ))
          }
        </DragColumn >
      </div>
    </div>
    );
  }
}

export default Dreg
