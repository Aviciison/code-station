/* eslint-disable react-hooks/rules-of-hooks */
// import MDEditor from '@uiw/react-md-editor';
import { addArticle, updateArticleByUser } from '@/services/article';
import { uploadImg } from '@/services/index';
import { DeleteFilled } from '@ant-design/icons';
// import { DeleteOutlined, DeleteFilled } from '@ant-design/icons';
import gemoji from '@bytemd/plugin-gemoji';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';
import { Editor } from '@bytemd/react';
import { history, useLocation, useModel } from '@umijs/max';
import { useHover } from 'ahooks';
import type { UploadProps } from 'antd';
import { Button, Card, Form, Input, Select, Upload, message } from 'antd';
import { BytemdPlugin } from 'bytemd';
import 'bytemd/dist/index.css';
import zh_Hans from 'bytemd/locales/zh_Hans.json';
import 'highlight.js/styles/default.css';
import { useEffect, useRef, useState } from 'react';
import './article.less';
// 主题
import 'juejin-markdown-themes/dist/condensed-night-purple';
import 'juejin-markdown-themes/dist/condensed-night-purple.min.css';

const { Dragger } = Upload;

function useMyLocation<T>() {
  return useLocation() as unknown as Location & { state: T };
}

// 路由传过来的类型
export interface detail {
  articleContent: string;
  coverPic: string;
  articleTitle: string;
  description: string;
  articleId: string;
  associatedLabels: string[];
}

const article: React.FC = () => {
  const [form] = Form.useForm();
  const { dictData, getDictData } = useModel('ditc');

  const ref = useRef(null);
  // 上传图片的ref，是否hover
  const isHovering = useHover(ref);

  // 文章内容
  const [articleContent, setArticleContent] = useState('');
  // 富文本的editorChange
  const editorChange = (v: string) => {
    setArticleContent(v);
  };

  // 上传图片的url
  const [coverPic, setCoverPic] = useState<string>();

  const [loading, setLoading] = useState(false);
  // 富文本配置插件
  const plugins: BytemdPlugin[] = [gfm(), highlight(), gemoji()];

  const props: UploadProps = {
    name: 'file',
    showUploadList: false,
    beforeUpload: (file) => {
      const r = new FileReader();
      r.readAsDataURL(file);
      r.onload = async () => {
        console.log(file);
        try {
          const res = await uploadImg(file);
          setCoverPic(res);
        } catch (e) {
          console.log(e);
        }
      };
    },
  };

  // 删除封面按钮
  const removePic = () => {
    setCoverPic('');
  };

  // 获取路由的值
  const { state } = useMyLocation<detail>();
  // const res = location.state;
  // 监听路由传的值
  useEffect(() => {
    if (state) {
      console.log(state);

      setArticleContent(state.articleContent);
      setCoverPic(state.coverPic);
      form.setFieldsValue({
        articleTitle: state.articleTitle,
        description: state.description,
        coverPic: state.coverPic,
        associatedLabels: state.associatedLabels,
      });
    }
  }, [state]);

  // 提交函数
  const onFinish = async (context: any) => {
    setLoading(true);
    const commit = state ? updateArticleByUser : addArticle;
    try {
      await commit({
        ...context,
        articleContent,
        coverPic,
        articleId: state ? state.articleId : undefined,
      });
      form.resetFields();
      setArticleContent('');
      setCoverPic('');
      message.success(state ? '文章修改成功' : '新增文章成功');
      history.replace('/');
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // 获取下拉框标签数据
  useEffect(() => {
    getDictData('ASSOCIATE_LABELS');
  }, []);

  const uploadImage = async (files: File[]) => {
    console.log('上传图片');
    console.log('files', files);
    try {
      const res = await uploadImg(files[0]);
      return Promise.resolve([
        {
          url: res,
          alt: files[0].name,
          title: files[0].name,
        },
      ]);
    } catch (e) {
      console.log(e);
      return Promise.reject();
    }
  };

  return (
    <div>
      <Card title={state ? '编辑文章' : '写文章'}>
        <Form
          form={form}
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          onFinish={onFinish}
        >
          <Form.Item
            label="标题"
            name="articleTitle"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input.TextArea
              showCount
              maxLength={60}
              placeholder="请输入文章标题"
            ></Input.TextArea>
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea
              showCount
              maxLength={100}
              placeholder="请简单介绍文章内容最多100字"
            ></Input.TextArea>
          </Form.Item>

          <Form.Item
            label="关联标签"
            name="associatedLabels"
            rules={[{ required: true, message: '请选择关联标签' }]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: '40%' }}
              placeholder="请输入关联标签"
              options={dictData.ASSOCIATE_LABELS}
            />
          </Form.Item>
          <Form.Item
            label="封面"
            name="coverPic"
            valuePropName="coverPic"
            rules={[{ required: true, message: '请上传封面图片' }]}
          >
            <Dragger
              style={{ width: '213px', height: '128px' }}
              {...props}
              disabled={Boolean(coverPic)}
            >
              {coverPic ? (
                <div className={true ? 'mask' : '11'} ref={ref}>
                  {isHovering && (
                    <DeleteFilled
                      className="deleteIcon"
                      style={{ color: '#fff', fontSize: '20px' }}
                      onClick={removePic}
                    />
                  )}
                  <img
                    src={coverPic}
                    style={{ width: '211px', height: '128px' }}
                  ></img>
                </div>
              ) : (
                <p>请上传封面图片，建议尺寸：213*128</p>
              )}
            </Dragger>
          </Form.Item>
          <Form.Item label="内容">
            <div className="context">
              <Editor
                locale={zh_Hans}
                value={articleContent}
                onChange={editorChange}
                plugins={plugins}
                placeholder={'开始你的创作吧！'}
                uploadImages={uploadImage}
              ></Editor>
            </div>
          </Form.Item>
          <Form.Item wrapperCol={{ span: 22, offset: 2 }}>
            <Button
              htmlType="submit"
              type="primary"
              style={{ width: '200px' }}
              loading={loading}
            >
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default article;
