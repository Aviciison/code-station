import mapbg2 from 'assets/mapbg2.jpg';
import * as echarts from 'echarts';
import 'echarts-gl';
import { useEffect } from 'react';
import haerbinMap from './wz.json';

const Map: React.FC = () => {
  // const componentWillUnmount = () => {
  //   const mapDoc = document.getElementById('map');
  //   mapDoc!.removeEventListener('wheel', () => {});
  // };
  useEffect(() => {
    const mapDoc = document.getElementById('map');
    const myChart = echarts.init(mapDoc);
    let option1 = {
      // tip悬浮提示框
      tooltip: {
        //格式化内容，返回为空，地图组件不起作用，得在地图组件重新定义
        formatter: () => '',
        textStyle: {
          color: '#fff',
        },
      },
      // geo3D: {
      //   map: 'hrb', //注册地图的名字
      //   roam: true, //开启鼠标缩放和平移漫游。默认不开启
      //   itemStyle: {
      //     color: {
      //       type: 'linear', // 指定为线性渐变
      //       x: 0, // 渐变起点 x 坐标
      //       y: 0, // 渐变起点 y 坐标
      //       x2: 0, // 渐变终点 x 坐标
      //       y2: 1, // 渐变终点 y 坐标
      //       colorStops: [
      //         { offset: 0, color: '#4189f2' }, // 起始颜色
      //         { offset: 1, color: '#ffffff' }, // 结束颜色
      //       ],
      //     },
      //     opacity: 1, //透明度
      //     borderWidth: 0.1, // 边框宽度
      //     borderColor: '#eee', // 边框颜色
      //     fontSize: 0.1, //
      //   },
      //   viewControl: {
      //     distance: 120,
      //     alpha: 70, // 上下旋转的角度
      //     beta: 0, // 左右旋转的角度
      //   },
      // },
      // backgroundColor: 'transparent',
      // backgroundImage: mapbg2,
      // graphic: {
      //   type: 'image',
      //   id: 'background',
      //   left: 'center',
      //   top: 'center',
      //   z: -10, // 背景图层
      //   bounding: 'all',
      //   origin: [0, 0],
      //   style: {
      //     image: mapbg2, // 替换为你的背景图片路径
      //     width: '100%',
      //     height: '100%',
      //     opacity: 0.4,
      //   },
      // },
      tooltip: {
        show: false,
      },
      geo: {
        show: true,
        map: 'hrb',
        roam: false,
        itemStyle: {
          normal: {
            borderColor: '#04BEF4',
            borderWidth: 5,
            shadowColor: '#032A81',
            shadowOffsetX: 15,
            shadowOffsetY: 10,
          },
        },
      },
      series: [
        {
          name: '哈尔滨地图',
          type: 'map',
          map: 'hrb',
          label: {
            show: true,
            color: '#fff',
            fontSize: 15,
            formatter: function (params) {
              return params.name;
            },
          },
          itemStyle: {
            normal: {
              borderColor: '#0FA3F0',
              // areaColor: 'lightblue',
              color: 'white',
              borderWidth: 1,
              // 地图块的背景色或者背景图
              areaColor: {
                image: mapbg2,
                repeat: 'no-repeat',
              },
            },
            emphasis: {
              // 选择区域的样式
              areaColor: 'blue',
            },
          },
        },
      ],
    };
    const useZoom = (
      el: HTMLElement,
      callback = (translateData: { x: number; y: number }, scale: number) => {},
    ) => {
      el.style.transformOrigin = '0 0';
      /** 缩放的比例 */
      let scale = 1;
      /** 平移的距离 */
      let translateData = { x: 0, y: 0 };
      const { width, height } = el.getBoundingClientRect();
      /** 重置数据, 并触发回调更新元素 */
      const reset = () => {
        scale = 1;
        translateData = { x: 0, y: 0 };
        callback(translateData, scale);
      };
      const distanceMovedZoom = (
        { offsetX, offsetY }: any,
        oldScale: number,
        newScale: number,
      ) => {
        console.log(oldScale);
        const newWidth = width * newScale;
        const newHeight = height * newScale;
        const diffWidth = width * oldScale - newWidth;
        const diffHeight = height * oldScale - newHeight;
        // 鼠标在图片上坐标比例, offsetX 是取原始大小的值, 所用要除 widht
        const xRatio = offsetX / width;
        const yRatio = offsetY / height;

        // 需要再次移动的距离 x = (新的宽度 - 旧的宽度) * 鼠标在旧的宽度的比例
        return { x: diffWidth * xRatio, y: diffHeight * yRatio };
      };
      const wheelZoom = (event: any) => {
        let _scale = scale;
        _scale += event.deltaY > 0 ? -0.09 : 0.1;
        if (_scale < 0.3) return;
        let _translateData = distanceMovedZoom(event, scale, _scale);
        scale = _scale;

        // 需要移动的距离 = 已经移动的距离 + 需要再次移动的距离
        translateData.x += _translateData.x;
        translateData.y += _translateData.y;

        callback(translateData, scale);
      };

      return {
        wheelZoom,
        reset,
      };
    };
    echarts.registerMap('hrb', haerbinMap);
    // const { wheelZoom } = useZoom(mapDoc as any, (transform, scale) => {
    //   document.body.style.overflow = 'hidden';
    //   // translate 和 scale 的顺序影响最终效果
    //   mapDoc!.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${scale})`;
    // });
    // mapDoc!.addEventListener('wheel', wheelZoom);
    myChart.setOption(option1);
    // return { componentWillUnmount };
  }, []);

  return (
    <div>
      <div id="map" style={{ width: '40vw', height: '40vw' }}></div>
    </div>
  );
};

export default Map;
