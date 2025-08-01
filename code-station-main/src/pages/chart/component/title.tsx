import './title.less';
interface title {
  bigTitle: string;
  smallTitle: string;
}

const Title: React.FC<title> = (props) => {
  const { bigTitle, smallTitle } = props;
  return (
    <div className="component-title">
      <span className="component-title-bigTitle">{bigTitle}</span>
      <span className="component-title-smallTitle">{smallTitle}</span>
    </div>
  );
};

export default Title;
