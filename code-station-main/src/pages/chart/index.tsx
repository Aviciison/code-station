import allimg from 'assets/allimg.png';
import topleft1 from 'assets/topleft1.png';
import zuoxiajiao from 'assets/zuoxiajiao.png';

import Map from './component/map';
import RentSellChart from './component/rentSellChart';
import Title from './component/title';

import './index.less';

const chart: React.FC = () => {
  const distributionArray = [
    { total: '456', type: '住宅' },
    { total: '4', type: '场地' },
    { total: '4', type: '仓库' },
    { total: '4', type: '办公' },
    { total: '4', type: '厂房' },
    { total: '4', type: '车库' },
    { total: '4', type: '其他' },
    { total: '4', type: '公寓' },
    { total: '4', type: '商业用途' },
  ];
  return (
    <div className="charts">
      {/* 头部 */}
      <div className="charts-head">
        <div className="charts-head-left">
          <div className="charts-head-left-time vertical-bottom">14:18:59</div>
          <div className="charts-head-left-date vertical-bottom">2024-7-24</div>
          <div className="charts-head-left-week vertical-bottom">星期三</div>
        </div>
        <div className="charts-head-title">重庆房产综合服务数智化平台</div>
      </div>
      {/* body */}
      <div className="charts-body">
        <div className="charts-body-left">
          {/* 业态分布 */}
          <div className="charts-body-business">
            <Title bigTitle="业态分布" smallTitle="ye tai fen bu"></Title>
            <div className="charts-body-business-body">
              <div className="charts-body-business-body-subtitle">
                <img src={allimg} alt="" />
                <span className="charts-body-business-body-subtitle-text">
                  房源总数
                </span>
              </div>
              <div className="charts-body-business-body-number">
                <span>481</span>
              </div>
              <div className="charts-body-business-body-distribution">
                {distributionArray.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="charts-body-business-body-distribution-item"
                    >
                      <div className="charts-body-business-body-distribution-item-img">
                        <img
                          style={{ width: '100%', height: '100%' }}
                          src={topleft1}
                          alt=""
                        />
                      </div>
                      <div className="charts-body-business-body-distribution-item-show">
                        <div className="charts-body-business-body-distribution-item-show-number">
                          {item.total}{' '}
                          <span className="charts-body-business-body-distribution-item-show-number-text">
                            套
                          </span>
                        </div>
                        <div className="charts-body-business-body-distribution-item-show-type">
                          {item.type}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* 租售占比 */}
          <div className="charts-body-rentSell">
            <Title bigTitle="租售占比" smallTitle="zu shou zhan bi"></Title>
            <div className="charts-body-rentSell-body">
              <div className="charts-body-rentSell-body-subTitle">租售总数</div>
              <div className="charts-body-rentSell-body-total">481</div>
              <div className="charts-body-rentSell-body-chart">
                <RentSellChart></RentSellChart>
              </div>
            </div>
          </div>
          {/* 政府企业房源 */}
          <div className="charts-body-zheng">
            <Title
              bigTitle="政企房源全景"
              smallTitle="zheng qi fang yuan quan jing"
            ></Title>
            <div className="charts-body-zheng-allSense">
              <img
                className="charts-body-zheng-allSense-img"
                src={zuoxiajiao}
                alt=""
              />
              <img
                className="charts-body-zheng-allSense-img2"
                src={zuoxiajiao}
                alt=""
              />
              <img
                className="charts-body-zheng-allSense-img3"
                src={zuoxiajiao}
                alt=""
              />
              <img
                className="charts-body-zheng-allSense-img4"
                src={zuoxiajiao}
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="charts-body-middle">
          <Map></Map>
        </div>
        <div className="charts-body-right"></div>
      </div>
    </div>
  );
};

export default chart;
