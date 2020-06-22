import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './index.scss';
import wechatUrl from '../../assets/img/wechat-admire.png'

export default class About extends Component {
    render() {
        return (
            <div className="about">
                <div className="about-wrap">
                    <div className="about-content">
                        <p>
                            Steam Design Tools 是一个 Steam 个人主页背景图和艺术品展柜预览增强工具。能通过 Chrome 浏览器存储将 Steam 市场中的背景图快速应用在您的个人资料主页上进行预览，同时开启艺术品展柜从本地拖拽预览您准备好的图片，帮助您快速设计出自己的主页。
                        </p>
                        <p>
                            同时，这也是一个兴趣驱动开发的个人项目，我会持续适配 Steam 对页面的改版更新。如果有幸帮助到了您，也可以通过微信支付等方式鼓励项目，帮助我更好的维护下去。有问题欢迎联系我：mtmzorro@foxmail.com。
                        </p>
                        <p className="center">
                            <img className="payment-img" src={wechatUrl} alt="wechat" />
                        </p>
                    </div>
                </div>
                <div className="about-operate">
                    <a target="_blank" rel="noopener noreferrer" href="https://steamDT.mtmzorro.com" className="button button-help">帮  助</a>
                    <Link to="/index.html" className="button button-return">返  回</Link>
                </div>
            </div>
        )
    }
}
