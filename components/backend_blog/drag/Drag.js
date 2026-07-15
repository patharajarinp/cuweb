import React from 'react';
import ReactDOM from 'react-dom';
import ReactDragListView from 'react-drag-listview/lib/index.js';
import Link from 'next/link';


class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragProps : {
        onDragEnd : this.onDragEnd,
        nodeSelector: 'li',
        handleSelector: 'li'
      }
    }
    
  }

  onDragEnd = (fromIndex, toIndex) => {
    const setCate = this.props.handleCateChange;
    const data  = this.props.cate;
    const item = data.splice(fromIndex, 1)[0];
    data.splice(toIndex, 0, item);
    // this.props.setCate([]);
    setCate([])
    setCate(data);

  }


  render() {
    return (
      <div className="blog-drag-data">
          <div className="simple simple1">
        <div className="simple-inner">
          <ReactDragListView {...this.state.dragProps}>
            <div className="header-text">
                <div className="show-index">#</div>
                <div className="show-name">ชื่อตอน</div>
               
            </div>
            <ol>
              {
                this.props.cate && this.props.cate.map((item, index) => (
                  <li key={index}>
                    <div className="show-index">{item.item.index}</div>
                    <div className="show-name">{item.item.title}</div>
                    
                  </li>
                ))
              }
            </ol>
          </ReactDragListView>
        </div>
      </div>

      </div>
        );
  }
}

export default Demo
