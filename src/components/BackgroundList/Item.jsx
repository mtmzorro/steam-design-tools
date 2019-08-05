import React, { Component } from 'react';


export default class Item extends Component {
    constructor(props) {
        super(props)
        this.state = {
            star: false
        }
    }
    render() {
        const { name, marketUrl, marketPrice, backgroundUrl } = this.props.data;
        return (
            <li>
                <div className="bl-img">
                    <a href={marketUrl} target="_blank" rel="noopener noreferrer">
                        <img src={backgroundUrl + '96fx96f'} width="92px" height="92px" alt="" />
                    </a>
                </div>
                <div className="bl-name">{name}</div>
                <div className="bl-price">{marketPrice}</div>
                <div className="bl-operate">
                    <span onClick={() => { this.starHandle(name) }}>暂存</span>
                    删除
                    设为背景
                </div>
            </li>
        )
    }
    /**
     * 
     */    
    starHandle = name => {
        this.props.onStar(name);
    }

}
