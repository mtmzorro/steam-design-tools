import React, { Component } from 'react';

export default class BackgroundItem extends Component {

    handleOnLike = () => {
        const {onLike, item} = this.props;
        onLike(item.marketUrl);
    }

    handleOnRemove = () => {
        const {onRemove, item} = this.props;
        onRemove(item.marketUrl);
    }

    handleSetBackgound = () => {
        const {setBackgound, item} = this.props;
        setBackgound(item.backgroundUrl);
    }
 
    render() {
        const { item } = this.props;
        
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
                    <span className="bi-o-button" onClick={this.handleOnLike}>
                        <span className={item.isLike ? 'iconfont icon-star stared' : 'iconfont icon-star'}></span>
                    </span>
                    <span className="bi-o-button" onClick={this.handleOnRemove}>
                        <span className="iconfont icon-remove"></span>
                    </span>
                    <span className="bi-o-button" onClick={this.handleSetBackgound}>
                        <span className="iconfont icon-brush"></span><em>设为背景</em>
                    </span>
                </div>
            </li>
        )
    }

}
