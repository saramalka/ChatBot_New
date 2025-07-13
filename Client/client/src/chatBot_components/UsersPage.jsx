import React, { useState, useEffect, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import UserDetails from './UserDetails';
import {
  useGetUsersQuery,
  useAddUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
} from '../features/admin/userApiSlice';

export default function UsersPage() {
  const { data = [], refetch } = useGetUsersQuery();
  const [addUser] = useAddUserMutation();
  const [updateUser] = useEditUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', role: 'user', password: '' });

  const toast = useRef(null);

  useEffect(() => {
    setFiltered(
      data.filter((u) =>
        [u.username, u.email, u.role].some((val) =>
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


  const handleSave = async () => {
  if (!form.username || !form.email || (!editUser && !form.password)) {
    toast.current.show({
      severity: 'warn',
      summary: 'שגיאה',
      detail: 'נא למלא את כל השדות הנדרשים',
      life: 3000,
    });
    return;
  }

  try {
    if (editUser) {
      await updateUser({ ...editUser, ...form }).unwrap();
      toast.current.show({ severity: 'success', summary: 'עודכן', detail: 'המשתמש עודכן בהצלחה' });
    } else {
      await addUser(form).unwrap();
      toast.current.show({ severity: 'success', summary: 'נוסף', detail: 'משתמש חדש נוסף' });
    }

    setDialogVisible(false);
    await refetch();
  } catch (err) {
    toast.current.show({
      severity: 'error',
      summary: 'שגיאה',
      detail: err?.data?.message || 'קרתה שגיאה',
    });
  }
};


  return (
    <div className="p-4">
      <Toast ref={toast} />
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
        <UserDetails form={form} setForm={setForm} handleSave={handleSave} />
      </Dialog>
    </div>
  );
}
