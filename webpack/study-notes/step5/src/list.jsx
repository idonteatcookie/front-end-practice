// list.jsx
import React, { Component } from 'react';
import styles from './list.less';

class List extends Component {
    render() {
        return (
          <div>
              {
                  this.props.list.map((item, idx) =>
                    <div className={styles.listItem} key={idx}>
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