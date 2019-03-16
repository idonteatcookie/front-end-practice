import React from 'react';
import _ from './lib/lodash';

class App extends React.PureComponent {
    render() {
        // 为了引入而引入 lodash 
        // 打印个版本假装用过吧 = =
        return (
            <div className="content">
                手写一个Webpack配置
                <div>Lodash: {_.VERSION}</div>
            </div>
        )
    }
}

export default App;