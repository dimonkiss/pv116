import {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import {Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {Button, Popconfirm} from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import { EditOutlined } from '@ant-design/icons';
interface ICategoryItem {
    id: number;
    name: string;
    image: string;
}

const HomePage = () => {
    const[list, setList] = useState<ICategoryItem[]>([]);

    useEffect(() => {
        axios.get<ICategoryItem[]>("http://pv116.rozetka.com/api/categories")
            .then(resp=> {
                setList(resp.data);
            });
    },[]);

    const columns: ColumnsType<ICategoryItem> = [
        {
            title: '#',
            dataIndex: 'id'
        },
        {
            title: 'Фото',
            dataIndex: 'image',
            render: (image: string) => {
                return (
                    <img src={`http://pv116.rozetka.com/upload/150_${image}`} width={100} alt={"Фото"}/>
                )
            }
        },
        {
            title: 'Назва',
            dataIndex: 'name'
        },
        {
            title: 'Видалить',
            dataIndex: 'delete',
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure to delete this category?"
                    onConfirm={async () => {
                        try {
                            await axios.delete(`http://pv116.rozetka.com/api/categories/${record.id}`);
                            setList(list.filter(x=>x.id!=record.id));

                        } catch (error) {
                            console.error('Error fetching category details:', error);
                            throw error;
                        }
                    }}
                    okText="Так"
                    cancelText="Ні"
                >
                    <Button icon={<DeleteOutlined />}>
                        Delete
                    </Button>
                </Popconfirm>
            ),
        },
        {
            title: 'Редагувати',
            dataIndex: 'edit',
            render: () => (
                <Link to={`categories/edit`}>
                    <Button icon={<EditOutlined />}>
                        Edit
                    </Button>
                </Link>
            ),
        },

    ];

    return (
        <>
            <Table dataSource={list} rowKey="id" columns={columns} />
        </>
    )
}

export default HomePage;