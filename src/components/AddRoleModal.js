import { Button, Modal } from 'react-bootstrap';

export default function AddRoleModal({ show, onHide, newRole, onChange, onSubmit }) {

    return (
        <Modal>
            <Modal.Header closeButton>
                <Modal.Title>Thêm vai trò mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="form-label">Tên vai trò</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên vai trò"
                        value={newRole.name}
                        onChange={(e) => onChange({ ...newRole, name: e.target.value })}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Đóng</Button>
                <Button variant="primary" onClick={onSubmit}>
                    Thêm vai trò
                </Button>
            </Modal.Footer>
        </Modal>
    );

}