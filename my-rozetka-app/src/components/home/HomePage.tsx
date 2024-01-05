import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Modal, Form, Input, Upload, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';

interface ICategoryItem {
    id: number;
    name: string;
    image: string;
}

const HomePage = () => {
    const [list, setList] = useState<ICategoryItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ICategoryItem | null>(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState<boolean>(false);
    const [editModalVisible, setEditModalVisible] = useState<boolean>(false);

    const [editForm] = Form.useForm();

    useEffect(() => {
        axios.get<ICategoryItem[]>("http://pv116.rozetka.com/api/categories")
            .then(resp => {
                setList(resp.data);
            });
    }, []);

    const handleDetails = (record: ICategoryItem) => {
        setSelectedCategory(record);
        setDetailsModalVisible(true);
    };

    const handleEdit = (record: ICategoryItem) => {
        setSelectedCategory(record);
        editForm.setFieldsValue({
            name: record.name,
            // Add other fields as needed
        });
        setEditModalVisible(true);
    };

    const handleEditSave = async () => {
        try {
            const values = await editForm.validateFields();
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("image", values.image?.[0]); // Assuming "image" is the name of the file input field

            // Make API call to update category information using POST
            await axios.post(`http://pv116.rozetka.com/api/categories/${selectedCategory?.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update local state with the edited category
            setList(list.map(item => (item.id === selectedCategory?.id ? { ...item, ...values } : item)));
            setEditModalVisible(false);
        } catch (error) {
            console.error('Error editing category:', error);
        }
    };

    const handleDelete = async (record: ICategoryItem) => {
        try {
            await axios.delete(`http://pv116.rozetka.com/api/categories/${record.id}`);
            setList(list.filter(x => x.id !== record.id));
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const columns: ColumnsType<ICategoryItem> = [
        {
            title: '#',
            dataIndex: 'id'
        },
        {
            title: 'Фото',
            dataIndex: 'image',
            render: (image: string) => (
                <img src={`http://pv116.rozetka.com/upload/150_${image}`} width={100} alt={"Фото"} />
            )
        },
        {
            title: 'Назва',
            dataIndex: 'name'
        },
        {
            title: 'Детальніше',
            dataIndex: 'details',
            render: (_, record) => (
                <Button icon={<InfoCircleOutlined />} onClick={() => handleDetails(record)}>
                    Детальніше
                </Button>
            ),
        },
        {
            title: 'Редагувати',
            dataIndex: 'edit',
            render: (_, record) => (
                <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                    Редагувати
                </Button>
            ),
        },
        {
            title: 'Видалити',
            dataIndex: 'delete',
            render: (_, record) => (
                <Popconfirm
                    title="Ви впевнені, що хочете видалити цю категорію?"
                    onConfirm={() => handleDelete(record)}
                    okText="Так"
                    cancelText="Ні"
                >
                    <Button icon={<DeleteOutlined />}>
                        Видалити
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <>
            <Table dataSource={list} rowKey="id" columns={columns} />

            <Modal
                title="Детальна інформація"
                visible={detailsModalVisible}
                onCancel={() => setDetailsModalVisible(false)}
                footer={[
                    <Button key="back" onClick={() => setDetailsModalVisible(false)}>
                        Закрити
                    </Button>,
                ]}
            >
                {selectedCategory && (
                    <>
                        <p>ID: {selectedCategory.id}</p>
                        <p>Назва: {selectedCategory.name}</p>
                        <img src={`http://pv116.rozetka.com/upload/150_${selectedCategory.image}`} width={100} alt="Фото" />
                    </>
                )}
            </Modal>

            <Modal
                title="Редагування категорії"
                visible={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                onOk={handleEditSave}
            >
                <Form form={editForm} layout="vertical" initialValues={{}}>
                    <Form.Item
                        name="name"
                        label="Назва"
                        rules={[{ required: true, message: 'Введіть назву категорії' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="image"
                        label="Фото"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e && e.fileList}
                        extra="Змініть фото категорії"
                    >
                        <Upload
                            name="image"
                            action="http://pv116.rozetka.com/api/upload" // Replace with your image upload API endpoint
                            listType="picture"
                            beforeUpload={() => false} // Prevent default upload behavior
                            fileList={selectedCategory?.image ? [{ uid: '-1', name: 'Current Image', status: 'done', url: `http://pv116.rozetka.com/upload/150_${selectedCategory.image}` }] : []}
                        >
                            <Button icon={<UploadOutlined />}>Вибрати файл</Button>
                        </Upload>
                    </Form.Item>
                    {/* Add other form fields as needed */}
                </Form>
            </Modal>
        </>
    );
};

export default HomePage;
