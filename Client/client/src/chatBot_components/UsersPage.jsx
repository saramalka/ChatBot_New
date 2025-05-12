import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import { Column } from 'primereact/column';
import {
  useGetUsersQuery,
  useAddUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
} from '../features/admin/userApiSlice';

export default function UsersPage() {
  const { data = [], refetch } = useGetUsersQuery();
  const [addUser] = useAddUserMutation();
  const [updateUser] =  useEditUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [originalUsers, setOriginalUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', role: 'user', password: '' });

 
  useEffect(() => {
    setFiltered(
      data.filter((u) =>
        [u.username, u.email, u.role]
          .some((val) =>
            val?.toLowerCase().includes(searchTerm.toLowerCase())
          )
      )
    );
  }, [searchTerm, data]);
  

  const openNew = () => {
    setEditUser(null);
    setForm({ username: '', email: '', role: 'user', password: '' });
    setDialogVisible(true);
  };

  const handleSave = async () => {
    if (editUser) {
      await updateUser({ ...editUser, ...form })
    } else {
      await addUser(form)
    }
    setDialogVisible(false)
    await refetch()
    
  };
  

  const handleDelete = (user) => {
    confirmDialog({
      message: 'האם אתה בטוח שברצונך למחוק את המשתמש?',
      header: 'אישור מחיקה',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'מחק',
      rejectLabel: 'בטל',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        await deleteUser(user._id);
        await refetch();
      
      },
    });
  };
  

  const roles = [
    { label: 'admin', value: 'admin' },
    { label: 'user', value: 'user' }
  ];

  return (
    <div className="p-4">
      <Card title="ניהול משתמשים">
      <ConfirmDialog />
        <div className="flex justify-content-between mb-3">

          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="חיפוש לפי שם, אימייל או תפקיד"
            className="w-6"
          />
          <Button label="משתמש חדש" icon="pi pi-plus" onClick={openNew} />
        </div>

        <DataTable value={filtered} paginator rows={10} dataKey="_id">
         <Column field="username" header="שם משתמש" sortable />
          <Column field="email" header="אימייל" sortable />
          <Column field="role" header="תפקיד" sortable />
          <Column
            body={(row) => (
              <>
                <Button
                  icon="pi pi-pencil"
                  className="p-button-text p-button-sm"
                  onClick={() => {
                    setEditUser(row);
                    setForm({ ...row, password: '' });
                    setDialogVisible(true);
                  }}
                />
                <Button
                  icon="pi pi-trash"
                  className="p-button-text p-button-sm text-red-500"
                  onClick={() => handleDelete(row)}
                />
              </>
            )}
          />
        </DataTable>
      </Card>

      <Dialog
        header={editUser ? 'עריכת משתמש' : 'משתמש חדש'}
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        footer={
          <div>
            <Button label="ביטול" onClick={() => setDialogVisible(false)} />
            <Button label="שמור" onClick={handleSave} />
          </div>
        }
      >
        <div className="p-fluid">
          <label>שם משתמש</label>
          <InputText
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />

          <label>אימייל</label>
          <InputText
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label>סיסמה</label>
          <InputText
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <label>תפקיד</label>
          <Dropdown
            value={form.role}
            options={roles}
            onChange={(e) => setForm({ ...form, role: e.value })}
          />
        </div>
      </Dialog>
    </div>
  );
}
