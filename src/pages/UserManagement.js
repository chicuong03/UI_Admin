import axios from 'axios';
import { Edit, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge, Button, Form, Modal, Nav, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import AddUserModal from '../components/AddUserModal';
import ConfirmModal from '../components/ConfirmModal';

export default function UserManagement() {
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [activeTab, setActiveTab] = useState('allUsers');
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showAddRoleModal, setShowAddRoleModal] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [newUser, setNewUser] = useState({
        fullName: '',
        userName: '',
        password: '',
        confirmPassword: '',
        roleId: '',
    });
    const [editUser, setEditUser] = useState({
        id: '',
        fullName: '',
        userName: '',
        password: '',
        roleId: ''
    });

    const [confirmActionType, setConfirmActionType] = useState(null);
    const token = localStorage.getItem('token');

    const getUser = async () => {
        try {
            const res = await axios.get('https://quanlitiendoapi.cadico.vn/api/AppUser/admin/all');
            console.log(res.data);
            setUsers(res.data);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    useEffect(() => {
        getUser();
        getroles();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchKeyword, statusFilter]);

    const [roles, setRoles] = useState([]);

    const getroles = async () => {
        const res = await axios.get('https://quanlitiendoapi.cadico.vn/api/Role/admin/all');
        console.log(res.data);
        setRoles(res.data);

    }

    const handleEditUser = (user) => {
        setCurrentUser(user);
        setEditUser({
            id: user.id,
            fullName: user.fullName || '',
            userName: user.userName || '',
            password: '',
            roleId: user.role?.id || '',
        });
        setShowEditUserModal(true);
    };

    const handleDeleteUserConfirmed = async () => {
        try {
            await axios.delete(
                `https://quanlitiendoapi.cadico.vn/api/AppUser/admin/${currentUser.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            toast.success(`Đã xóa người dùng ${currentUser.fullName}`);
            console.log("Xóa người dùng:", currentUser.id);
            setShowDeleteConfirm(false);
            getUser();

        } catch (error) {
            console.error('Lỗi khi xóa người dùng:', error);
            toast.error('Lỗi khi xóa người dùng!');
        }
    };

    const handleResetPassword = async () => {
        try {
            const res = await axios.put(
                'https://quanlitiendoapi.cadico.vn/api/AppUser/reset-password',
                { userId: currentUser.id },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (res.status === 200) {
                toast.success(`Đã reset mật khẩu cho ${currentUser.fullName}`);
            } else {
                toast.error('Lỗi khi reset mật khẩu!');
            }

            console.log("Reset mật khẩu cho người dùng:", currentUser.id);
            setShowDeleteConfirm(false);
        } catch (error) {
            toast.error('Lỗi khi reset mật khẩu!');
            console.error('Chi tiết lỗi:', error.response?.data || error.message);
        }
    };

    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case 'Admin':
                return 'danger';
            case 'Quản lý':
                return 'success';
            case 'Nhân viên':
                return 'info';
            default:
                return 'secondary';
        }
    };

    const renderUsersTab = () => {
        const filteredUsers = users.filter((user) => {
            const matchesSearch =
                user.fullName?.toLowerCase().includes(searchKeyword) ||
                user.userName?.toLowerCase().includes(searchKeyword);

            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && user.isActived === true) ||
                (statusFilter === 'inactive' && user.isActived === false);

            return matchesSearch && matchesStatus;
        });

        const indexOfLastUser = currentPage * itemsPerPage;
        const indexOfFirstUser = indexOfLastUser - itemsPerPage;
        const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
        const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

        return (
            <>
                <Table hover responsive className="mb-0 ">
                    <thead className="bg-light">
                        <tr>
                            <th className="p-3 text-left font-medium text-gray-500">#</th>
                            <th className="p-3 text-left font-medium text-gray-500">Họ và tên</th>
                            <th className="p-3 text-left font-medium text-gray-500">Tên đăng nhập</th>
                            <th className="p-3 text-left font-medium text-gray-500">Vai trò</th>
                            <th className="p-3 text-left font-medium text-gray-500">Trạng thái</th>
                            <th className="p-3 text-center font-medium text-gray-500">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <tr key={user.id}>
                                <td className="p-3">{indexOfFirstUser + index + 1}</td>
                                <td className="p-3">{user.fullName}</td>
                                <td className="p-3">{user.userName}</td>
                                <td className="p-3">
                                    <Badge bg="primary" className="font-normal">
                                        {user.role?.name || 'Chưa phân quyền'}
                                    </Badge>
                                </td>
                                <td className="p-3">
                                    <Badge pill bg={user.isActived ? 'success' : 'danger'}>
                                        {user.isActived ? 'Hoạt động' : 'Khóa'}
                                    </Badge>
                                </td>
                                <td className="p-3">
                                    <div className="d-flex justify-content-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            className="d-flex align-items-center"
                                            onClick={() => handleEditUser(user)}
                                        >
                                            <Edit size={14} className="me-1" /> Sửa
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-danger"
                                            className="d-flex align-items-center"
                                            onClick={() => {
                                                setCurrentUser(user);
                                                setConfirmActionType('delete');
                                                setShowDeleteConfirm(true);
                                            }}

                                        >
                                            <Trash2 size={14} className="me-1" /> Xóa
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline-warning"
                                            className="d-flex align-items-center"
                                            onClick={() => {
                                                setCurrentUser(user);
                                                setConfirmActionType('reset');
                                                setShowDeleteConfirm(true);
                                            }}

                                        >
                                            <RefreshCw size={14} className="me-1" /> Reset
                                        </Button>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <div className="p-4 d-flex justify-content-center align-items-center bg-white border-top">
                    <span className="text-sm text-gray-600 me-2">
                        Hiển thị {indexOfFirstUser + 1}–{Math.min(indexOfLastUser, filteredUsers.length)} trong tổng {filteredUsers.length} mục
                    </span>
                    <nav>
                        <ul className="pagination mb-0">
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li
                                    key={i}
                                    className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </>
        );
    };

    const renderButtonUser = () => (
        <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center mx-1 my-1">
                <span className="mx-2 my-1">Trạng thái:</span>
                <Form.Group className="mx-2 my-1">
                    <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Khóa</option>
                    </Form.Select>
                </Form.Group>
            </div>

            <Button
                variant="primary"
                className="d-flex align-items-center mx-1 my-1"
                onClick={() => setShowAddUserModal(true)}
            >
                <Plus size={18} className="me-2" /> Thêm người dùng
            </Button>
        </div>
    );

    const renderButtonRole = () => (
        <>
            {/* <div className="d-flex justify-content-end align-items-center mx-1 ">
                <Button
                    variant="primary"
                    className="d-flex align-items-center"
                    onClick={() => setShowAddRoleModal(true)}
                >
                    <Plus size={18} className="me-2" /> Thêm Vai trò
                </Button>
            </div> */}
        </>
    );

    const renderRolesTab = () => (
        <>
            <Table hover responsive className="mb-0">
                <thead className="bg-light">
                    <tr>
                        <th className="p-3 text-left font-medium text-gray-500">Id</th>
                        <th className="p-3 text-left font-medium text-gray-500">Tên vai trò</th>
                        <th className="p-3 text-left font-medium text-gray-500">Tên vai trò</th>
                        <th className="p-3 text-left font-medium text-gray-500">Mô tả</th>
                        {/* <th className="p-3 text-center font-medium text-gray-500">Thao tác</th> */}
                    </tr>
                </thead>
                <tbody>
                    {roles
                        .filter((role) =>
                            role.name.toLowerCase().includes(searchKeyword)
                        )
                        .map((role) => (
                            <tr key={role.id}>
                                <td className="p-3">{role.id}</td>
                                <td className="p-3">
                                    <Badge bg={getRoleBadgeVariant(role.name)} className="font-normal">
                                        {role.name}
                                    </Badge>
                                </td>
                                <td className="p-3">{role.normalizedName}</td>
                                <td className="p-3">{role.name}</td>
                                {/* <td className="p-3">
                                    <div className="d-flex justify-content-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline-primary"
                                            className="d-flex align-items-center"
                                        >
                                            <Edit size={14} className="me-1" /> Sửa
                                        </Button>
                                    </div>
                                </td> */}
                            </tr>
                        ))}
                </tbody>
            </Table>

            <div className="p-4 d-flex justify-content-between align-items-center bg-white border-t">
                <span className="text-sm text-gray-600">Hiển thị 1-3 của 3 mục</span>
            </div>
        </>
    );

    const handleChange = (e) => {
        setSearchKeyword(e.target.value.toLowerCase());
    };

    const handleAddrole = () => {
        toast.success('Thêm vai trò thành công!');
        setShowAddRoleModal(false);
    }

    const handleAddUser = async () => {
        const { fullName, userName, password, confirmPassword, roleId } = newUser;

        if (!fullName || !userName || !password || !confirmPassword || roleId === '') {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Mật khẩu và xác nhận mật khẩu không khớp!");
            return;
        }

        try {
            const userData = {
                userName: userName,
                password: password,
                confirmPassword: confirmPassword,
                fullName: fullName,
                roleId: parseInt(roleId)
            };

            console.log("Dữ liệu gửi đi:", userData);

            const response = await axios.post(
                'https://quanlitiendoapi.cadico.vn/api/Auth/register',
                userData,
                {
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log("Kết quả API:", response.data);
            toast.success("Thêm người dùng thành công!");

            setNewUser({
                fullName: '',
                userName: '',
                password: '',
                confirmPassword: '',
                roleId: '',
            });

            getUser();
            setShowAddUserModal(false);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);

            if (error.response) {
                console.log("Chi tiết lỗi:", error.response.data);
                toast.error(`Lỗi: ${error.response.data.message || JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                toast.error("Không nhận được phản hồi từ máy chủ!");
            } else {
                toast.error("Có lỗi xảy ra trong quá trình thêm người dùng!");
            }
        }
    }

    const handleUpdateUser = async () => {
        try {
            const payload = {
                roleId: parseInt(editUser.roleId),
            };

            console.log("PUT TO:", `https://quanlitiendoapi.cadico.vn/api/AppUser/admin/${editUser.id}/role`);
            console.log("Payload:", payload);

            await axios.put(
                `https://quanlitiendoapi.cadico.vn/api/AppUser/admin/${editUser.id}/role`,
                parseInt(editUser.roleId),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                }
            );

            toast.success('Cập nhật vai trò thành công!');
            setShowEditUserModal(false);
            getUser();
        } catch (error) {
            console.error(error);
            toast.error('Lỗi khi cập nhật vai trò người dùng!');
            if (error.response?.data) {
                console.error("Chi tiết:", error.response.data);
            }
        }
    };

    return (
        <div className="p-4 bg-light shadow-lg" style={{ fontSize: '20px' }}>
            <div className="d-flex" style={{ minHeight: '100vh' }}>

                <div className="flex-grow-1">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <Nav variant="tabs">
                            <Nav.Item>
                                <Nav.Link
                                    active={activeTab === 'allUsers'}
                                    onClick={() => setActiveTab('allUsers')}
                                    className="font-medium me-3"
                                >
                                    Tất cả người dùng
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                    active={activeTab === 'roles'}
                                    onClick={() => setActiveTab('roles')}
                                    className="font-medium"
                                >
                                    Vai trò
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Form.Group className="p-4">
                            <Form.Label className="font-medium">Tìm kiếm</Form.Label>
                            <Form.Control
                                name="content"
                                onChange={handleChange}
                                placeholder="Tìm thứ gì đó..."
                                className="shadow-sm"
                                required
                            />
                        </Form.Group>

                        <div className="justify-content-between align-items-center px-4 pt-2 border-bottom">


                            <div>
                                {activeTab === 'allUsers' ? renderButtonUser() : renderButtonRole()}
                            </div>
                        </div>

                        <div className="tab-content">
                            {activeTab === 'allUsers' ? renderUsersTab() : renderRolesTab()}
                        </div>
                    </div>

                    <AddUserModal
                        show={showAddUserModal}
                        onHide={() => setShowAddUserModal(false)}
                        newUser={newUser}
                        roles={roles}
                        onChange={setNewUser}
                        onSubmit={handleAddUser}
                    />

                    <Modal size='lg' show={showAddRoleModal} onHide={() => setShowAddRoleModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Thêm vai trò mới</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="mb-3">
                                <label className="form-label">Tên vai trò</label>
                                <input type="text" className="form-control" placeholder="Nhập tên vai trò" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mô tả</label>
                                <textarea className="form-control" placeholder="Nhập mô tả"></textarea>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowAddRoleModal(false)}>
                                Đóng
                            </Button>
                            <Button variant="primary" onClick={() => handleAddrole()}>
                                Lưu
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal size="lg" show={showEditUserModal} onHide={() => setShowEditUserModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Chỉnh sửa vai trò người dùng</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {currentUser && (
                                <>
                                    <div className="mb-3">
                                        <label className="form-label">Họ và tên</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editUser.fullName}
                                            onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
                                        />

                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Tên đăng nhập</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editUser.userName}
                                            onChange={(e) => setEditUser({ ...editUser, userName: e.target.value })}
                                        />

                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Mật khẩu mới (để trống nếu không thay đổi)</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={editUser.password}
                                            onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                                        />                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Vai trò</label>
                                        <select
                                            className="form-select"
                                            value={editUser.roleId}
                                            onChange={(e) => setEditUser({ ...editUser, roleId: e.target.value })}
                                        >
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>{role.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowEditUserModal(false)}>
                                Hủy
                            </Button>
                            <Button variant="primary" onClick={handleUpdateUser}>
                                Lưu thay đổi
                            </Button>

                        </Modal.Footer>
                    </Modal>

                    <ConfirmModal
                        show={showDeleteConfirm}
                        onHide={() => setShowDeleteConfirm(false)}
                        title={confirmActionType === 'delete' ? 'Xác nhận xóa' : 'Xác nhận reset mật khẩu'}
                        message={
                            confirmActionType === 'delete'
                                ? `Bạn có chắc chắn muốn xóa ${currentUser?.fullName}?`
                                : `Bạn có chắc chắn muốn reset mật khẩu cho ${currentUser?.fullName}?`
                        }
                        onConfirm={
                            confirmActionType === 'delete' ? handleDeleteUserConfirmed : handleResetPassword
                        }
                    />
                </div>
            </div>
        </div>
    );
}