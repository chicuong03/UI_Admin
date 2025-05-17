import { Button, Modal } from 'react-bootstrap';
export default function AddUserModal({ show, onHide, newUser, roles, onChange, onSubmit }) {

    return (
        <Modal size="lg" show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Thêm người dùng mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="form-label">Họ và tên</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập họ và tên"
                        value={newUser.fullName}
                        onChange={(e) => onChange({ ...newUser, fullName: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tên đăng nhập</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên đăng nhập"
                        value={newUser.userName}
                        onChange={(e) => onChange({ ...newUser, userName: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Nhập mật khẩu"
                        value={newUser.password}
                        onChange={(e) => onChange({ ...newUser, password: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Nhập lại mật khẩu"
                        value={newUser.confirmPassword}
                        onChange={(e) => onChange({ ...newUser, confirmPassword: e.target.value })}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Vai trò</label>
                    <select
                        className="form-select"
                        value={newUser.roleId}
                        onChange={(e) => onChange({ ...newUser, roleId: e.target.value })}
                    >
                        <option value="">Chọn vai trò</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={onSubmit}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    );

}