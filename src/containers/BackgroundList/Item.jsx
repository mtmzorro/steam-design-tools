import React, { Component } from 'react';

export default class BackgroundItem extends Component {
 
    render() {
        const {
            item,
            onLike,
            onRemove,
            setBackgound,
        } = this.props;
        
        return (
            <li className="background-item">
                <div className="bi-drag"><span className="iconfont icon-drag-vertical"></span></div>
                <div className="bi-img">
                    <a title={item.name} href={item.marketUrl} target="_blank" rel="noopener noreferrer">
                        {
                            /\/economy\/profilebackground/.test(item.backgroundUrl) 
                            ? <img src={item.backgroundUrl + '?size=96x60'} alt="background-item" />
                            : <img src={item.backgroundUrl + '96fx96f'} alt="background-item" />
                        }
                    </a>
                </div>
                <div className="bi-name">
                    <a className="bi-n-link" title={item.name} href={item.marketUrl} target="_blank" rel="noopener noreferrer">
                        {item.name}
                    </a>
                    <span className="bi-n-price">{item.marketPrice}</span>
                </div>
                <div className="bi-operate">
                    <span className="bi-o-button" onClick={() => { onLike(item.marketUrl) }}>
                        <span className={item.isLike ? 'iconfont icon-star stared' : 'iconfont icon-star'}></span>
                    </span>
                    <span className="bi-o-button" onClick={() => { onRemove(item.marketUrl) }}>
                        <span className="iconfont icon-remove"></span>
                    </span>
                    <span className="bi-o-button" onClick={() => { setBackgound(item.backgroundUrl) }}>
                        <span className="iconfont icon-brush"></span><em>设为背景</em>
                    </span>
                </div>
            </li>
        )
    }

}
