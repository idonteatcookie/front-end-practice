// list.jsx
import React, { Component } from 'react';
import './list.less';

class List extends Component {
    render() {
        return (
          <div>
              {
                  this.props.list.map((item, idx) =>
                    <div className='listItem' key={idx}>
                        <span>{item}</span>
                        <button onClick={() => this.props.handleRemove(idx)}></button>
                    </div>
                  )
              }
          </div>
        )
    }
}

export default List;