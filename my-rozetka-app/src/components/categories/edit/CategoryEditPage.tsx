import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Divider, Form, Input, message, Upload, UploadFile, UploadProps } from "antd";
import axios from "axios";
import { RcFile, UploadChangeParam } from "antd/es/upload";
import { PlusOutlined } from "@ant-design/icons";
import { ICategoryCreate } from "./types.ts";

const CategoryEditPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const navigate = useNavigate();
    const { id } = useParams(); // Access the category ID from the URL
    const [categoryData, setCategoryData] = useState<ICategoryCreate | null>(null);

    useEffect(() => {
        // Fetch the category data by ID when the component mounts
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://pv116.rozetka.com/api/categories/${id}`);
                setCategoryData(response.data);
            } catch (error) {
                console.error('Error fetching category details:', error);
            }
        };

        fetchData();
    }, [id]);

    const onSubmit = async (values: any) => {
        if (file == null) {
            message.error("Оберіть фото!");
            return;
        }

        const model: ICategoryCreate = {
            name: values.name,
            image: file,
        };

        try {
            await axios.put(`http://pv116.rozetka.com/api/categories/${id}`, model, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/");
        } catch (ex) {
            message.error('Помилка редагування категорії!');
        }
    };

    const onSubmitFailed = (errorInfo: any) => {
        console.log("Error Form data", errorInfo);
    };

    type FieldType = {
        name?: string;
    };

    const beforeUpload = (file: RcFile) => {
        const isImage = /^image\/\w+/.test(file.type);
        if (!isImage) {
            message.error('Оберіть файл зображення!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('Розмір файлу не повинен перевищувать 10MB!');
        }
        return isImage && isLt2M;
    };

    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        const uploadedFile = info.file.originFileObj as File;
        setFile(uploadedFile);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <Divider>Редагувати категорію</Divider>
            {categoryData && (
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ name: categoryData.name }}
                    onFinish={onSubmit}
                    onFinishFailed={onSubmitFailed}
                >
                    <Form.Item<FieldType>
                        label="Назва"
                        name="name"
                        rules={[{ required: true, message: 'Вкажіть назву!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <div>
                        <Upload
                            name="avatar"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action="#"
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            accept="image/*"
                        >
                            {file ? <img src={URL.createObjectURL(file)} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                        </Upload>
                    </div>
                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Редагувати
                        </Button>
                    </Form.Item>
                </Form>
            )}
        </>
    );
};

export default CategoryEditPage;
