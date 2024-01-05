import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Modal } from "antd";
import { ColumnsType } from "antd/es/table";
import { Button, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';

interface ICategoryItem {
    id: number;
    name: string;
    image: string;
}

const HomePage = () => {
    const [list, setList] = useState<ICategoryItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<ICategoryItem | null>(null);
    const [detailsModalVisible, setDetailsModalVisible] = useState<boolean>(false);

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
                <Button icon={<EditOutlined />}>
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
        </>
    );
};

export default HomePage;
