import { useEffect } from 'react';
import './index.less';

const Accessible: React.FC = () => {
  useEffect(() => {
    // console.log(1);
    setTimeout(() => {
      window.location.href = './login';
    }, 3000);
  }, []);
  return (
    <div className="show">
      <div className="load-container load6">
        <div className="loader">Loading...</div>
      </div>
      {/* <div className="loading">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div> */}
      该页面需要登录，3秒后自动跳转至登录页
    </div>
  );
};

export default Accessible;
