// list.jsx
import React, { Component } from 'react';

class List extends Component {
    render() {
        return (
          <div>
              {
                  this.props.list.map((item, idx) =>
                    <div className='listItem' key={idx}>
                        <span>{item}</span>
                        <button onClick={() => this.props.handleRemove(idx)}>删除</button>
                    </div>
                  )
              }
          </div>
        )
    }
}

export default List;