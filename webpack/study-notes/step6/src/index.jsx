// index.jsx
import React from 'react';
import { render } from 'react-dom';
import Input from './input';
import List from './list';
import './index.less';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
    }

    addItem(item) {
        this.setState({
            list: this.state.list.concat(item)
        })
    }

    removeItem(idx) {
        this.setState({
            list: this.state.list.filter((it, id) => id !== idx)
        })
    }


    render() {
        return(
          <div className='todoList'>
              <Input handleSubmit={this.addItem.bind(this)} />
              <List list={this.state.list} handleRemove={this.removeItem.bind(this)} />
          </div>
        )
    }
}

render(<App />, document.getElementById('app'));